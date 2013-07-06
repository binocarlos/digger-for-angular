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
    console.log('angular adaptor booted...');
  }])

  /*
  
    return a promise that resolves when the window $digger object is ready
    
  */
  .factory('$digger', function() {

    return window.$digger;

  })


if(!window.$digger){
  throw new Error('$digger must be loaded on the same page to use the digger angular module');
}

var $digger = window.$digger;
var config = $digger.config = window.$diggerconfig || {};

if(config.user){
  $digger.user = $digger.create(config.user);
}

if(!$digger.manualboot){

  window.$digger(function(){
  /*

    this bootstraps angular into the page and binds the document element onto the digger app

    ng-app="digger"
    
  */

    console.log('digger.io version ' + window.$digger.version + ' loaded');
    console.log('booting angular adaptor...');
    /*
    
      the boot module is passed as a query

          /digger/angular/index.js?boot=buildright
      
    */

    angular.bootstrap(document, ['digger']);
  })  
}
  
