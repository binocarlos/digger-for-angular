/*

  the main bootstrap for the digger-angular adaptor

  it's role is to kick in angular on a page where the user has only pasted the script tag to here

  the user has the role to define a custom angular application

  we boot into that if defined otherwise we boot into the standard 'digger' app
  
*/

angular
  .module('digger', [
    require('digger-utils-for-angular'),
    require('./filters'),
    require('./repeat'),
    require('./supplychain'),
    require('./templates')
  ])

  /*
  
    the root controller gives access to things like the user and root warehouse
    
  */
  .controller('DiggerRootCtrl', function($scope, $rootScope, $digger){

    /*
    
      expose the connect command - this enables warehouses to be made from directives
      
    */
    $scope.connect = $digger.connect;

    /*
    
      expose the digger user - this is null if not logged in
      
    */
    $scope.user = $digger.user;

    /*
    
      expose the root warehouse - this can be used a the root container for the page
      
    */
    $scope.warehouse = $digger.connect($digger.config.root_warehouse || '/');
    $rootScope.warehouse = $scope.warehouse;
    $rootScope.blueprint = $digger.blueprint;


  })


if(!window.$digger){
  throw new Error('$digger must be loaded on the same page to use the digger angular module');
}
else{
  //window.$digger.on('connect', function(){
  // choose what application to boot - either a user defined one or the default digger one

  /*
  
    rely on the socket buffer to hold requests before $digger is connected

    this means we can boot into angular right away on not have markup hanging around on the page
    for a split second
    
  */
  var app = window.$digger.config.application || 'digger';
  document.documentElement.setAttribute('ng-controller', 'DiggerRootCtrl');
  angular.element(document).ready(function() {
    angular.bootstrap(document, [app]);
  });
}  