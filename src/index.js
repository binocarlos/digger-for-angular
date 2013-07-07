require('./supplychain.js');
require('./form.js');

angular
  .module('digger', [
    'digger.supplychain',
    'digger.form'
  ])

  /*
  
    make sure that the $digger object has been loaded onto the page
    
  */
  .run([function (){
    $digger(function(){
      console.log('angular adaptor booted...');
    })
    
  }])

  /*
  
    return a promise that resolves when the window $digger object is ready
    
  */
  .factory('$digger', function($q){
    return window.$digger;
  })

  .controller('RootCtrl', function($scope, $digger){
    $scope.user = $digger.user;
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
if(!window.$digger.config.manual){
  console.log('running automatic bootstrap');
  angular.bootstrap(document, ['digger']);
}