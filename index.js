angular
  .module('digger', [
    
  ])

  .run([function (){
    if(!window.$digger){
      throw new Error('$digger must be loaded on the same page to use the digger angular module');
    }
  }])

  .factory('$digger', function() {

    return window.$digger;

  })

  .directive('digger',function(){
   return {
    replace:true,
    restrict:'E'
   }
  })