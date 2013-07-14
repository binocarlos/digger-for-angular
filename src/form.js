var templates = {
  form:require('./templates/form'),
  field:require('./templates/field')
}

angular
  .module('digger.form', [
    
  ])

  .directive('diggerForm', function(){


    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        fields:'=',
        container:'=',
        fieldclass:'@'
      },
      transclude:true,
      replace:true,
      template:templates.form
    }
  })

  .directive('diggerField', function($compile){

    //field.required && showvalidate && containerForm[field.name].$invalid

    var typemap = {
      money:'text',
      number:'text'
    }

    return {
      restrict:'EA',
      scope:{
        field:'=',
        container:'=',
        fieldclass:'='
      },
      replace:true,
      template:templates.field,
      controller:function($scope){
        $scope.$watch('container', function(container){
          if(!container){
            return;
          }
          var field = $scope.field.name;
          $scope.model = container.propertymodel(field);
        })

        var pattern = $scope.field.pattern;

        if(_.isEmpty(pattern)){
          $scope.pattern = /./;
        }
        else{
          $scope.pattern = new RegExp(pattern);
        }

        $scope.type = $scope.field.type;
        $scope.type = typemap[$scope.type] || $scope.type;

        $scope.type = $scope.type || 'text';  

        $scope.rendertype = $scope.type;

        var template = $digger.template.get($scope.type);

        if(template){
          $scope.rendertype = 'template';
          $scope.rendertemplate = template;
        }
      },
      link:function($scope, elem, $attrs){

        $scope.$watch('rendertemplate', function(html){

          $(elem).append($compile(html)($scope));
        })
          
      }

    }
  })