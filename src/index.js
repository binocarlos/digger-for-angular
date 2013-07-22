require('./utils');
require('./supplychain');
require('./form');
require('./tree');
require('./radio');
require('./filters');


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
    'digger.filters'
  ])

  /*
  
    make sure that the $digger object has been loaded onto the page
    
  */
  .run([function (){
    $digger(function(){
      console.log('digger angular adaptor booted...');

      var templates = {};
      $('script[type="digger/template"]').each(function(){
        var template = $(this).html();
        var name = $(this).attr('name');
        templates[name] = template;
      })
      $digger.template.add(templates);
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
  .controller('DiggerRootCtrl', function($scope, $digger){

    /*
    
      expose the connect command - this enables warehouses to be made from directives
      
    */
    $scope.connect = $digger.connect;

    /*
    
      expose the digger use - this is null if not logged in
      
    */
    $scope.user = $digger.user;

    /*
    
      expose the root warehouse - this can be used a the root container for the page
      
    */
    $scope.warehouse = $digger.connect('/');


  })


/*

  BOOTSTRAP
  
*/
if(!window.$digger){
  throw new Error('$digger must be loaded on the same page to use the digger angular module');
}

/*

  we manually bootstrap angular here so HTML users do not need to insert ng-app

  the ng-app that is run is 'digger'
  
*/
window.$digger(function(){
  /*
  
    digger is loaded but lets give the rest of the code a chance to register before we bootstrap
    
  */
  setTimeout(function(){
    var app = window.$digger.config.application || 'digger';

    /*
    
      this auto adds the Root Controller so the rest of the page has things like user in it's scope
      
    */
    $('html').attr('ng-controller', 'DiggerRootCtrl');

    console.log('-------------------------------------------');
    console.log('digger angular adaptor booting - application: ' + app);
    angular.bootstrap(document, [app]);  
  }, 100)
  
})