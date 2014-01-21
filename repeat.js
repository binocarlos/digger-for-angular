/*

  we are in private scope (component.io)
  
*/
module.exports = 'digger.repeat';
angular
  .module('digger.repeat', [
    
  ])

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