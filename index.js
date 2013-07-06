angular
  .module('digger', [
    
  ])

  /*
  
    make sure that the $digger object has been loaded onto the page
    
  */
  .run([function (){
    console.log('-------------------------------------------');
    console.log('-------------------------------------------');
    console.log('running digger module');    
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
    angular.bootstrap(document, ['digger']);
  })
})  