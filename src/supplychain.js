angular
  .module('digger.supplychain', [
    
  ])

   /*
  
    a function that returns a digger container based on the HTML (treated as XML)
    contents
    
  */
  .factory('$containerParser', function(){
    return function(elem){
      console.log('-------------------------------------------');
      console.log('parsing');
      var string = elem.html();
      console.dir(string);
    }
  })

  /*
  
    a directive that issues a select contract and loops the results
    
  */
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
