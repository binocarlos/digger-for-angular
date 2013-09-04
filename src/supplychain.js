/*

  we are in private scope (component.io)
  
*/


angular
  .module('digger.supplychain', [
    'digger.utils'
  ])

  /*
  
    connects to the current warehouse or a custom one and runs the selector against it

    it populates the $digger scope property with the results

    <div digger warehouse="/my/warehouse" selector="thing.red">
      there are {{ $digger.count() }} results
    </div>
    
  */

  .factory('$warehouseLoader', function($rootScope, $safeApply){

    /*
    
      return a loader bound onto the current scope

      it will populate the $digger property
      
    */
    return function($scope){

      return function(selector, warehousepath){
          
        if(!selector){
          return;
        }

        var warehouse = $rootScope.warehouse;

        if(warehousepath){
          warehouse = $digger.connect(warehousepath);
        }

        /*
        
          run the selector and populate results
          
        */
        warehouse(selector)
          .ship(function(results){

            $safeApply($scope, function(){

              $scope.$digger = results;
              $scope.containers = results.containers();

            })

          })
          .fail(function(error){
            $scope.error = error;
          })
      }

    }
  })


  /*
  
    a generic trigger for the warehouse loader above
    
  */
  .directive('digger', function($warehouseLoader, $safeApply){
    return {
      restrict:'EA',
      // we want this going before even the repeat
      // this lets us put the repeat and digger on the same tag
      // <div digger warehouse="/" selector="*" digger-repeat="children()" />
      priority: 1000,
      scope:true,
      link:function($scope, elem, $attrs){
        var loader = $warehouseLoader($scope);

        $attrs.$observe('selector', function(selector){
          loader(selector, $attrs.warehouse);
        })
      }
    }
  })

  .directive('diggerRepeat',function($filter){
    return {
      transclude : 'element',
      scope:true,
      // we want this going first so other directives on the 
      // tag get access to $digger in the scope
      priority: 100,
      compile : function(element, attr, linker){
        return function($scope, $element, $attr){

          var self = this;
          var repeat_what = $attr.diggerRepeat || 'containers()';

          var fn_string = repeat_what;
          var parent = $element.parent();
          var elems = [];

          // build a new child scope and link to the transclude
          function build_template(container){
            var $child_scope = $scope.$new();
            $child_scope.$digger = container;
            linker($child_scope, function(clone_of_template){
              elems.push(clone_of_template);
              parent.append(clone_of_template);
            })
          }

          function reset_template(){
            elems.forEach(function(elem){
              elem.remove();
            })
          }

          function run_compile(){
            var $digger = $scope.$digger;
            if(!$digger){
              return;
            }
            reset_template();

            var st = '$digger.' + fn_string;

            try{
              var arr = eval(st);

              /*
              
                if we have a container back then turn it into an array for the loop
                
              */
              if(typeof(arr.containers)==='function'){
                arr = arr.containers();
              }

              arr.forEach(build_template);
            } catch (e){
              console.log('-------------------------------------------');
              console.dir(e);
              console.log(e.stack);
            }
          }
        
          $scope.$watch('$digger', run_compile);
        }
      }
    }
  })



/*
          // $watchCollection is called everytime the collection is modified
          $scope.$watchCollection(collectionString, function(collection){
            var i, block, childScope;

            // check if elements have already been rendered
            if(elements.length > 0){
              // if so remove them from DOM, and destroy their scope
              for (i = 0; i < elements.length; i++) {
                elements[i].el.remove();
                elements[i].scope.$destroy();
              };
              elements = [];
            }

            for (i = 0; i < collection.length; i++) {
              // create a new scope for every element in the collection.
              childScope = $scope.$new();
              // pass the current element of the collection into that scope
              childScope[indexString] = collection[i];

              linker(childScope, function(clone){
                // clone the transcluded element, passing in the new scope.
                parent.append(clone); // add to DOM
                block = {};
                block.el = clone;
                block.scope = childScope;
                elements.push(block);
              });
            };
          });
*/