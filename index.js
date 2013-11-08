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

  /*
  
    the root controller gives access to things like the user and root warehouse
    
  */
  .controller('DiggerRootCtrl', function($scope, $rootScope, $digger){

    /*
    
      expose the connect command - this enables warehouses to be made from directives
      
    */
    $scope.connect = $digger.connect;

    /*
    
      expose the digger user - this is null if not logged in
      
    */
    $scope.user = $digger.user;

    /*
    
      expose the root warehouse - this can be used a the root container for the page
      
    */
    $scope.warehouse = $digger.connect($digger.config.root_warehouse || '/');
    $rootScope.warehouse = $scope.warehouse;
    $rootScope.blueprint = $digger.blueprint;


    console.log('-------------------------------------------');
    console.log('ROOT');

  })


  /*
  
    make sure that the $digger object has been loaded onto the page
    
  */
  .run(function($rootScope, xmlDecoder, $safeApply){
    
    console.log('-------------------------------------------');
    console.log('running');
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
        $digger.template.add(name, html);
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


if(!window.$digger){
  throw new Error('$digger must be loaded on the same page to use the digger angular module');
}
else{
  //window.$digger.on('connect', function(){
  // choose what application to boot - either a user defined one or the default digger one

  /*
  
    rely on the socket buffer to hold requests before $digger is connected

    this means we can boot into angular right away on not have markup hanging around on the page
    for a split second
    
  */
  var app = window.$digger.config.application || 'digger';
  document.documentElement.setAttribute('ng-controller', 'DiggerRootCtrl');
  angular.element(document).ready(function() {
    angular.bootstrap(document, [app]);
  });
}  