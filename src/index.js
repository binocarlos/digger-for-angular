var page = require('./page');

angular
  .module('digger', [
    
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
  .factory('$digger', function($q) {

    return window.$digger;

  })


angular.element(document).ready(function() {
  if(!window.$digger){
    throw new Error('$digger must be loaded on the same page to use the digger angular module');
  }
  window.$digger(function(){
    console.log('digger.io version ' + window.$digger.version + ' loaded');
    console.log('booting angular adaptor...');
    angular.bootstrap(document, ['digger']);
  })
})  