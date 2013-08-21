/*

  we are in private scope (component.io)
  
*/

angular
  .module('digger.supplychain', [
    'digger.utils'
  ])

  /*
  
    returns a function that will assign the given path as the scopes warehouse
    
  */
  .factory('$scopedWarehouse', function(){
    return function($scope){
      return function(path){
        if(!path){
          return;
        }

        if($digger.config.debug){
          console.log('-------------------------------------------');
          console.log('assigning warehouse: ' + path);  
        }

        $scope.warehouse = $digger.connect(path);
      }
    }
  })

  /*
  
    sets the scopes warehouse for everything beneath
    
  */
  .directive('diggerWarehouse', function($rootScope, $scopedWarehouse){
    return {
      restrict:'EA',
      scope:true,
      priority:100,
      link:function($scope, $elem, $attrs){
        var assignwarehouse = $scopedWarehouse($scope);
        $attrs.$observe('warehouse', assignwarehouse);
        $attrs.$observe('diggerWarehouse', assignwarehouse);
      }
    }
  })

  /*
  
    a directive that transcludes onto a ng-repeat

    the repeat is mapped onto the results of the selector

    if the warehouse string is given then we connect to there

    otherwise we use the parent scopes warehouse
    
  */
  .directive('digger', function($rootScope, $scopedWarehouse, $safeApply, $parse){
    return {
      restrict:'EA',
      scope:true,
      controller:function($scope){

        $scope.lastpath = '';

        $scope.$on('digger:reload', function(){
          $scope.runselector($scope.lastselector, null, true);
        })

        /*
        
          this happens when the warehouse or selector changes
          
        */
        $scope.runselector = function(selector){
          /*
          
            run the selector and populate results
            
          */
          $scope.warehouse(selector).ship(function(results){

            $safeApply($scope, function(){

              $scope.results = results;
              $scope.containers = results.containers();

            })

          })
        }
      },
      link:function($scope, $elem, $attrs){

        $attrs.$observe('selector', function(value) {
          $scope.runselector(value);
        })

      }
    }
  })