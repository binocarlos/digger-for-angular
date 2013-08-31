/*

  we are in private scope (component.io)
  
*/


angular
  .module('digger.supplychain', [
    'digger.utils'
  ])

  .directive('diggerWarehouse', function($rootScope, $safeApply, $parse){
    return {
      restrict:'EA',
      scope:{
        warehouse:'@'
      },
      link:function($scope, $elem, $attrs){

      }
    }
  })


  /*
  
    a directive that transcludes onto a ng-repeat

    the repeat is mapped onto the results of the selector

    if the warehouse string is given then we connect to there

    otherwise we use the parent scopes warehouse
    
  */
  .directive('digger', function($rootScope, $safeApply, $parse){
    return {
      restrict:'EA',
      scope:{
        selector:'@',
        warehouse:'@'
      },
      link:function($scope, $elem, $attrs){

        var warehouse = $rootScope.warehouse;

        if($scope.warehouse){
          warehouse = $digger.connect($scope.warehouse);
        }

        /*
        
          run the selector and populate results
          
        */
        
        
        warehouse($scope.selector)
          .ship(function(results){

            $safeApply($scope, function(){

              $scope.results = results;
              $scope.containers = results.containers();

            })

          })
          .fail(function(error){
            $scope.error = error;
          })


        

      }
    }
  })