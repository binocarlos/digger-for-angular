module.exports = angular
  .module('digger', [
    
  ])

  .directive('diggerPage', function(){
    return {
      restrict:'EA',
      scope:true,
      replace:true,
      template:'',
      transcludeL:true,
      compile:function(tElement, tAttrs, transclude){
        console.log('-------------------------------------------');
        console.log('-------------------------------------------');
        console.log('page found');
        console.dir(tElement);
        console.dir(transclude);
      }

    }
  })