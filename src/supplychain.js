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

        $scope.$on('digger:reload', function(){
          loader($attrs.selector, $attrs.warehouse);
        })

        $attrs.$observe('selector', function(selector){
          loader(selector, $attrs.warehouse);
        })
      }
    }
  })
