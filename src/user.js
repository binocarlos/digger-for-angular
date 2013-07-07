/*

  Angular widgets that manage a digger application

  digger-routes

  this directive lets the user configure the angular-ui-state module
  via HTML

  the top level directive passes the child HTML to digger as data
  it then traverses this data to create the ui-routes

  
*/

angular
  .module('digger.user', [
    
  ])

  /*
  
    methods for deciding if the user can do/see stuff
    
  */
  .service('$userFilter', function(){

    return {
      /*
    
        matches the $digger.user against the given selector

        if the selector is empty it means there should be no user
        
      */
      matchselector:function(selector){
        selector = selector || '';

        /*
        
          no selector - we want no user
          
        */
        if(selector.length<=0){
          /*
          
            return true if no user
            
          */
          return $digger.user ? false : true;
        }
        else{
          return $digger.user.match(selector);
        }
      }
    }
  })