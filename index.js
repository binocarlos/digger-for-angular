require('digger-bootstrap-for-angular');
require('digger-utils-for-angular');
require('digger-supplychain-for-angular');
require('digger-form-for-angular');
require('digger-tree-for-angular');
require('digger-radio-for-angular');
require('digger-filters-for-angular');
require('digger-repeat-for-angular');
require('digger-viewer-for-angular');
require('digger-folders');


/*

  the main bootstrap for the digger-angular adaptor

  it's role is to kick in angular on a page where the user has only pasted the script tag to here

  the user has the role to define a custom angular application

  we boot into that if defined otherwise we boot into the standard 'digger' app
  
*/

angular
  .module('digger', [
    'digger.bootstrap',
    'digger.utils',
    'digger.folders',
    'digger.supplychain',
    'digger.form',
    'digger.tree',
    'digger.viewer',
    'digger.radio',
    'digger.filters',
    'digger.repeat'
  ])
  .config(['$provide', function ($provide) {
    
    $provide.factory('xmlHttpInterceptor', ['xmlFilter', function (xmlFilter) {
      return function (promise) {
        return promise.then(function (response) {
          response.xml = xmlFilter(response.data);
          return response;
        });
      };
    }]);
    
  }])
  .factory('xmlEncoder', function(){

    function string_factory(data, depth){

      var meta = data._digger || {};
      var children = data._children || [];
      var attr = data;
      depth = depth || 0;

      function get_indent_string(){
        var st = "\t";
        var ret = '';
        for(var i=0; i<depth; i++){
          ret += st;
        }
        return ret;
      }

      var pairs = {};

      if(meta.id && meta.id.length>0){
        pairs.id = meta.id;
      }

      if(meta.class && angular.isArray(meta.class) && meta.class.length>0){
        pairs.class = meta.class.join(' ');
      }

      var pair_strings = [];

      Object.keys(attr || {}).forEach(function(key){
        var val = attr[key];
        if(key.indexOf('_')===0){
          return;
        }
        if(key=='$$hashKey'){
          return;
        }
        pairs[key] = val;
      })
      
      Object.keys(pairs || {}).forEach(function(field){
        var value = pairs[field];
      
        if(value!=null && value!=''){
          pair_strings.push(field + '="' + value + '"');  
        }
      })

      if(children && children.length>0){
        var ret = get_indent_string() + '<' + meta.tag + ' ' + pair_strings.join(' ') + '>' + "\n";

        children.forEach(function(child){      
          ret += string_factory(child, depth+1);
        })

        ret += get_indent_string() + '</' + meta.tag + '>' + "\n";

        return ret;    
      }
      else{
        return get_indent_string() + '<' + meta.tag + ' ' + pair_strings.join(' ') + ' />' + "\n";
      }
    }

    return string_factory;

  })

  .factory('xmlDecoder', function(xmlParser){
    return function(xml){
      var domElement = xmlParser.parse(xml);
      var documentElement = domElement.documentElement;

      function process_elem(xml_elem){
        var attr = {};
        
        
        for(var i=0; i<xml_elem.attributes.length; i++){
          var node_attr = xml_elem.attributes[i];
          attr[node_attr.nodeName] = node_attr.nodeValue;
        }

        var classnames = (attr.class || '').split(/\s*,\s*/);
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

        container.attr(attr);
/*
        var child_models = [];

        for(var j=0; j<xml_elem.childNodes.length; j++){
          var node_attr = xml_elem.attributes[i];
          attr[node_attr.nodeName] = node_attr.nodeValue;
        }
*/

        return container;
      }

      return process_elem(documentElement);
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
  .filter('xml', ['xmlParser', function (xmlParser) {
    return function (input) {
      var xmlDoc = xmlParser.parse(input);
      return angular.element(xmlDoc);
    };
  }])