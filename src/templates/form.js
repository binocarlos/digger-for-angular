module.exports = '<div class="control-group" ng-class="{error: haserror}" ng-repeat="field in fields">\n\n  <label class="control-label" for="name">{{ field.name | ucfirst }}</label>\n  <div class="controls">\n  	<digger-field field="field" container="container" />\n    \n  </div>\n</div>\n\n\n';