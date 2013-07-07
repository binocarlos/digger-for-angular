/*

  Angular widgets that manage a digger application

  digger-routes

  this directive lets the user configure the angular-ui-state module
  via HTML

  the top level directive passes the child HTML to digger as data
  it then traverses this data to create the ui-routes

  
*/

angular
  .module('digger.app', [
    'digger.supplychain',
    'digger.user'
  ])

 


  /*
  
    directive that does the angular-ui-router setup via HTML
    
  */
  .directive('diggerRoutes', function($containerParser, $userFilter){

    /*
    
      keeps a map of the routes we have already setup (by id)

      this stops us doing one twice
      
    */
    var routesapplied = {};

    return {
      restrict:'EA',
      scope:true,
      controller:function($scope){
        $scope.filteruser = $userFilter.match;
        /*
        
          return a routes container with 'view' and 'route' nodes
          
        */
        $scope.getroutes = function(elem){
          var container = $containerParser(elem);

          console.log('-------------------------------------------');
          console.dir(container.toJSON());
          return {};
        }
      },
      link:function($scope, elem, $attr){
        console.log('-------------------------------------------');
        console.log('found routes');
        /*
        
          pass the user selector to the filter and don't carry on if it dosn't match
          
        */
        if(!$userFilter.matchselector($attr.user)){
          return;
        }

      }
    }
  })