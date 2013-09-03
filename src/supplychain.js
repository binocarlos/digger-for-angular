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

  .directive('diggerChildren', function($rootScope, $safeApply, $parse){
    return {
      restrict:'EA',
      scope:true,
      link:function($scope, $elem, $attrs){
        console.log('-------------------------------------------');
        console.log('-------------------------------------------');
        console.log('CHILDREN');
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
        warehouse:'@',
        assign:'@'
      },
      controller:function($scope){
      //link:function($scope, $elem, $attrs){

        var warehouse = $rootScope.warehouse;

        if($scope.warehouse){
          warehouse = $digger.connect($scope.warehouse);
        }

        $scope.$digger = function(models){
          return warehouse.spawn(models);
        }

        $scope.$watch('selector', function(selector){
          console.log('-------------------------------------------');
          console.log('here is the selector');
          console.dir(selector);
          /*
          
            run the selector and populate results
            
          */
          warehouse(selector)
            .ship(function(results){

              $safeApply($scope, function(){

                var containers = results.containers();
                $scope.results = results;
                $scope.containers = containers;

                /*
                $scope.containers = results.containers();

                if($scope.assign){
                  $scope[$scope.assign] = results;
                }*/

              })

            })
            .fail(function(error){
              $scope.error = error;
            })  
        })
        


        

      }
    }
  })