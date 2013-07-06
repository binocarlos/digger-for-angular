angular
  .module('digger.supplychain', [
    
  ])

  .directive('diggerWarehouse', function(){
    return {
      restrict:'EA',
      scope:true,
      link:function($scope, $elem, $attr){
        var path = $attr.location;

        console.log('-------------------------------------------');
        console.log('warehouse: ' + path);
      }
    }
  })