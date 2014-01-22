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


  .factory('xmlDecoder', function(xmlParser){
    return function(xml){
      xml = xml.replace(/^[^<]*/, '').replace(/[^>]*$/, '');

      var domElement = xmlParser.parse(xml);
      var documentElement = domElement.documentElement;

      function process_elem(xml_elem){
        var attr = {};
        
        for(var i=0; i<xml_elem.attributes.length; i++){
          var node_attr = xml_elem.attributes[i];
          attr[node_attr.nodeName] = node_attr.nodeValue;
        }

        var classnames = (attr.class || '').split(/[\s,]+/);
        delete(attr.class);
        var id = attr.id;
        delete(attr.id);

        var container = $digger.container(xml_elem.tagName);  

        classnames.forEach(function(classname){
          container.addClass(classname);
        })

        if(id){
          container.id(id);
        }

        Object.keys(attr || {}).forEach(function(prop){
          var val = attr[prop];
          if(('' + val).toLowerCase()==="true"){
            val = true;
          }
          else if(('' + val).toLowerCase()==="false"){
            val = false;
          }
          else if(('' + val).match(/^-?\d+(\.\d+)?$/)){
            var num = parseFloat(val);
            if(!isNaN(num)){
              val = num;
            }
          }
          container.attr(prop, val);
        })

        var child_models = [];

        for(var j=0; j<xml_elem.childNodes.length; j++){
          var child_node = xml_elem.childNodes[j];
          if(child_node.nodeType==1){
            var child = process_elem(child_node);
            child_models.push(child.get(0));
          }          
        }

        container.get(0)._children = child_models;

        return container;
      }

      // invalid XML
      
      if(documentElement.nodeName=='html'){
        return null;
      }
      else{
        return process_elem(documentElement);
      }
    }
  })

  .factory('xmlParser', ['$window', function ($window) {

    function MicrosoftXMLDOMParser() {
      this.parser = new $window.ActiveXObject('Microsoft.XMLDOM');
    }

    MicrosoftXMLDOMParser.prototype.parse = function (input) {
      this.parser.async = false;
      return this.parser.loadXml(input);
    };

    function XMLDOMParser() {
      this.parser = new $window.DOMParser();
    }

    XMLDOMParser.prototype.parse = function (input) {
      return this.parser.parseFromString(input, 'text/xml');
    };

    if ($window.DOMParser) {
      return new XMLDOMParser();
    } else if ($window.ActiveXObject) {
      return new MicrosoftXMLDOMParser();
    } else {
      throw new Error('Cannot parser XML in this environment.');
    }

  }])
