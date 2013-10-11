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