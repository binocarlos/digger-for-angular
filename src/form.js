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

    /*
    
      these are types that should be converted into the input type="..."
      
    */
    var fieldtypes = {
      textarea:true,
      template:true
    }

    var textrendertypes = {
      number:true,
      email:true
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

        $scope.fieldname = '';
        $scope.rendertype = 'text';

        $scope.setup = function(){
          $scope.setup_field_and_model();
          $scope.setup_render_type();
        }

        $scope.setup_field_and_model = function(){

          if(!$scope.container){
            return;
          }
          $scope.fieldname = $scope.field.name;
          $scope.model = $scope.container.propertymodel($scope.fieldname);

          if($scope.fieldname.indexOf('.')>0){
            var parts = $scope.fieldname.split('.');
            $scope.fieldname = parts.pop();
          }
        }

        $scope.setup_render_type = function(){
          var pattern = $scope.field.pattern;

          if(_.isEmpty(pattern)){
            $scope.pattern = /./;
          }
          else{
            $scope.pattern = new RegExp(pattern);
          }


          /*
          
            if they have registered a custom template then use that!
            
          */
          var template = $digger.template.get($scope.field.type);

          if(template){
            $scope.fieldtype = 'template';
            $scope.rendertemplate = template;
          }
          else{
            $scope.readonly = $scope.field.type==='readonly';
            $scope.fieldtype = fieldtypes[$scope.field.type] ? $scope.field.type : 'text';

            if(textrendertypes[$scope.fieldtype]){
              $scope.rendertype = textrendertypes[$scope.fieldtype] ? $scope.fieldtype : 'text';
            }
          }
        }

 


      },
      link:function($scope, elem, $attrs){

        $scope.$watch('rendertemplate', function(html){

          $(elem).append($compile(html)($scope));
        })

        $scope.$watch('container', function(){
          $scope.setup();
        })

        $scope.$watch('field', function(){
          $scope.setup();
        })

          
      }

    }
  })