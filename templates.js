/*

  the main bootstrap for the digger-angular adaptor

  it's role is to kick in angular on a page where the user has only pasted the script tag to here

  the user has the role to define a custom angular application

  we boot into that if defined otherwise we boot into the standard 'digger' app
  
*/
module.exports = 'digger.templates';
angular
  .module('digger.templates', [
    
  ])

  /*
  
    make sure that the $digger object has been loaded onto the page
    
  */
  .run(function($rootScope, xmlDecoder, $safeApply){
    
    /*
    
      auto template injection
      
      this is for when the templates are embedded into the page manually
    */
    var templates = {};

    var scripts = angular.element(document).find('script');

    for(var i=0; i<scripts.length; i++){
      var script = angular.element(scripts[i]);
      var html = script.html();
      if(script.attr('type')==='digger/field'){
        var name = script.attr('name');
        var html = script.html();
        if($digger.config.debug){
          console.log('-------------------------------------------');
          console.log('add template: ' + name);
          console.log(html);
        }
        $digger.blueprint.add_template(name, html);
      }
      else if(script.attr('type')==='digger/blueprint'){
        var blueprint_container = xmlDecoder(html);
        if(blueprint_container){
          $digger.blueprint.add(blueprint_container);
        }
      }
    }

    /*
    
      DO BLUEPRINT AUTO INJECTION HERE
      
    */
   
  })
