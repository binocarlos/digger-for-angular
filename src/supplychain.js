angular
  .module('digger.supplychain', [
    
  ])

  /*
  
    a directive that issues a select contract and loops the results
    
  */
  .directive('diggerWarehouse', function(){
    return {
      restrict:'EA',
      scope:true,
      link:function($scope, $elem, $attr){
        var path = $attr.location;

        $scope.warehouse = $digger.connect(path);
      }
    }
  })

  /*
  
    a directive that transcludes onto a ng-repeat

    the repeat is mapped onto the results of the selector

    if the warehouse string is given then we connect to there

    otherwise we use the parent scopes warehouse
    
  */
  .directive('diggerRepeat', function(){
    return {
      restrict:'EA',
      scope:true,
      transclude:true,
      template:'<div ng-repeat="container in results.containers()" ng-transclude></div>',
      link:function($scope, $elem, $attr){
        /*
        
          they have pointed to a specific warehouse
          inject it into the scope
          
        */
        if($attr.warehouse){
          $scope.warehouse = $digger.connect($attr.warehouse);
        }

        /*
        
          the selector string from the directive attribute
          
        */
        var selector = $attr.selector;

        /*
        
          the container to hold our results - blank at present
          
        */
        $scope.results = null;

        $scope.warehouse(selector).ship(function(answer){
          $scope.$apply(function(){
            $scope.results = answer;
          })
          
        })
        
      }
    }
  })