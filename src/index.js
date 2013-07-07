require('./app.js');
require('./user.js');
require('./supplychain.js');
require('./form.js');

/*

  the main bootstrap for the digger-angular adaptor

  it's role is to kick in angular on a page where the user has only pasted the script tag to here

  the user has the role to define a custom angular application

  we boot into that if defined otherwise we boot into the standard 'digger' app
  
*/

angular
  .module('digger', [
    'digger.app',
    'digger.supplychain',
    'digger.user',
    'digger.form'
  ])

  /*
  
    make sure that the $digger object has been loaded onto the page
    
  */
  .run([function (){
    $digger(function(){
      console.log('digger angular adaptor booted...');
    })
    
  }])

  /*
  
    return a promise that resolves when the window $digger object is ready
    
  */
  .factory('$digger', function($q){
    return window.$digger;
  })

  .controller('DiggerRootCtrl', function($scope, $digger){
    $scope.user = $digger.user;
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('ROOT CONTROL');
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
    var app = window.$digger.config.app || 'digger';

    /*
    
      this auto adds the Root Controller so the rest of the page has things like user in it's scope
      
    */
    $('html').attr('ng-controller', 'DiggerRootCtrl');

    console.log('-------------------------------------------');
    console.log('digger angular adaptor booting - application: ' + app);
    angular.bootstrap(document, [app]);  
  }, 100)
  
})