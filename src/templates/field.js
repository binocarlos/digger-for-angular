module.exports = '<div ng-switch="fieldtype">\n	<div ng-switch-when="textarea">\n		<textarea name="{{ field.name }}" class="form-control" ng-readonly="readonly" ng-model="model[fieldname]"></textarea>\n	</div>\n	<div ng-switch-when="template">\n		\n	</div>\n	<div ng-switch-when="diggerclass">\n		<input name="{{ field.name }}" digger-class-field class="form-control {{ fieldclass || \'input\' }}" type="text" ng-model="classval" ng-required="field.required" ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="readonly" ng-pattern="pattern" />\n	</div>\n	<div ng-switch-when="radio">\n		<span ng-repeat="option in options">\n			<input type="radio"\n	       ng-model="model[fieldname]"\n	       value="{{option}}" /> <small>{{ option }}</small> &nbsp;\n	  </span>\n\n	</div>\n	<div ng-switch-when="select">\n\n		<select \n			ng-model="model[fieldname]" \n			ng-options="o for o in options"></select>\n	  \n	</div>\n	<div ng-switch-when="checkbox">\n\n		<input type="checkbox" ng-model="model[fieldname]" />\n		\n	</div>\n	<div ng-switch-when="text">\n		<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="text" ng-model="model[fieldname]" ng-required="field.required" ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="readonly" ng-pattern="pattern" />\n	</div>\n	<div ng-switch-when="email">\n		<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="email" ng-model="model[fieldname]" ng-required="field.required" ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="readonly" />\n	</div>\n	<div ng-switch-when="number">\n		<input name="{{ field.name }}" class="form-control {{ fieldclass || \'input\' }}" type="number" ng-model="model[fieldname]" ng-required="field.required" ng-minlength="field.minlength" ng-maxlength="field.maxlength" ng-readonly="readonly" />\n	</div>\n</div>';