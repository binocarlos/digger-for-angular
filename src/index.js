require('./utils');
require('./supplychain');
require('./form');
require('./tree');
require('./radio');
require('./filters');
require('./repeat');


/*

  the main bootstrap for the digger-angular adaptor

  it's role is to kick in angular on a page where the user has only pasted the script tag to here

  the user has the role to define a custom angular application

  we boot into that if defined otherwise we boot into the standard 'digger' app
  
*/

angular
  .module('digger', [
    'digger.utils',
    'digger.supplychain',
    'digger.form',
    'digger.tree',
    'digger.radio',
    'digger.filters',
    'digger.repeat'
  ])

  /*
  
    make sure that the $digger object has been loaded onto the page
    
  */
  .run([function($rootScope){
    
    var templates = {};

    var scripts = angular.element(document).find('script');

    scripts.each(function(index){
      var script = scripts.eq(index);
      if(script.attr('type')==='digger/field'){
        var name = script.attr('name');
        var html = script.html();
        if($digger.config.debug){
          console.log('-------------------------------------------');
          console.log('add template: ' + name);
          console.log(html);
        }
        $digger.template.add(name, html);
      }
    })
   
  }])

    /*
  
    return a promise that resolves when the window $digger object is ready
    
  */
  .factory('$digger', function($q){
    return window.$digger;
  })

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
    $scope.warehouse = $digger.connect('/');
    $rootScope.warehouse = $scope.warehouse;

  })




/*

  digger is loaded but lets give the rest of the code a chance to register before we bootstrap
  
*/
setTimeout(function(){
  
  /*

    BOOTSTRAP
    
  */
  if(!window.$digger){
    throw new Error('$digger must be loaded on the same page to use the digger angular module');
  }

  var app = window.$digger.config.application || 'digger';

  /*
  
    this auto adds the Root Controller so the rest of the page has things like user in it's scope
    
  */
  $('html').attr('ng-controller', 'DiggerRootCtrl');

  angular.bootstrap(document, [app]);  
}, 100)