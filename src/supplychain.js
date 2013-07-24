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
        $scope.runselector = function(selector, context, force){
          if(!selector || selector.length<=0){
            return;
          }

          $scope.lastselector = selector;

          var currentwarehouse = $scope.warehouse.diggerurl();
          var currentselector = selector;
          var currentpath = currentwarehouse + currentselector;

          /*
          
            this prevents double requests as things get updated
            
          */
          if(!force && currentpath==$scope.lastpath){
            return;
          }

          $scope.lastpath = currentpath;

          var args = [selector];
          if(context){
            args.push(context);
          }

          var contract = $scope.warehouse.apply($scope.warehouse, args);

          /*
          
            run the selector and populate results
            
          */
          contract.ship(function(results){
            $safeApply($scope, function(){

              var prop = $scope.assign ? $scope.assign : 'results';
              $scope[prop] = results;

            })
          })
        }
      },
      link:function($scope, $elem, $attrs){

        /*
        
          the selector string we are running for results
          
        */
        var selector = '';

        $attrs.$observe('warehouse', $scopedWarehouse($scope));

        $attrs.$observe('selector', function(value) {
          $scope.selector = value;
        })

        $attrs.$observe('context', function(value) {
          $scope.context = value;
        })
       
        $attrs.$observe('assign', function(value) {
          $scope.assign = value;
        })

        $scope.$watch('warehouse', function(){
          $scope.runselector($scope.selector, $scope.context);
        })
        
        $scope.$watch('selector', function(){
          $scope.runselector($scope.selector, $scope.context);
        })


        /*
        
          the container to hold our results - blank at present
          

        $scope.results = null;

        $scope.warehouse(selector).ship(function(answer){
          console.log('-------------------------------------------');
          console.log('-------------------------------------------');
          console.log('results');
          console.dir(answer.toJSON());
          $scope.$apply(function(){
            $scope.results = answer;
          })
          
        })
                */
      }
    }
  })