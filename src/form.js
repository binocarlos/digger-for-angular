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
        fieldclass:'@',
        showedit:'='
      },
      transclude:true,
      replace:true,
      template:templates.form
    }
  })

  .directive('diggerClassField', function($compile, $safeApply){
    return {
      restrict:'A',
      link:function($scope){

        function getstring(){

          return ($scope.model ? $scope.model[$scope.fieldname] : []).join(', ');
        }

        function setstring(st){
          if(!$scope.model){
            return;
          }
          var parts = _.map(st.split(','), function(s){
            return s.replace(/^\s+/, '').replace(/\s+$/, '');
          })

          $scope.model[$scope.fieldname] = parts;
          //$safeApply($scope, function(){});
        }

        $scope.classval = getstring();
        $scope.$watch('classval', setstring);
        $scope.$watch('model', function(){
          $scope.classval = getstring();
        });

        
      }
    }
  })

  .factory('$diggerFieldTypes', function(){
    return {
      list:[
        'text',
        'textarea',
        'number',
        'email',
        'radio',
        'checkbox',
        'select'
      ],
      properties:{
        text:{},
        number:{},
        email:{},
        textarea:{},
        checkbox:{},
        file:{},
        radio:{
          options:true
        },
        select:{
          options:true
        }
      }
    }
  })

  .directive('diggerField', function($compile, $safeApply){

    //field.required && showvalidate && containerForm[field.name].$invalid

    /*
    
      these are types that should be converted into the input type="..."
      
    */
    var fieldtypes = {
      text:true,
      number:true,
      email:true,
      textarea:true,
      diggerclass:true,
      template:true,
      checkbox:true,
      radio:true,
      select:true
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
        fieldclass:'=',
        globalreadonly:'=readonly'
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

          if(!$scope.container){
            return;
          }
          
          var pattern = $scope.field.pattern;

          if(_.isEmpty(pattern)){
            $scope.pattern = /./;
          }
          else{
            $scope.pattern = new RegExp(pattern);
          }

          if($scope.field.options_csv){
            $scope.options = _.map($scope.field.options_csv.split(/,/), function(option){
              return option.replace(/^\s+/, '').replace(/\s+$/, '');
            })
          }
          else if($scope.field.options_warehouse){
            var warehouse = $digger.connect($scope.field.options_warehouse);

            warehouse($scope.field.options_selector).ship(function(results){
              $safeApply($scope, function(){
                $scope.options = results.map(function(result){
                  return result.title();
                })
              })
            })
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

            $scope.readonly = $scope.field.type==='readonly' || $scope.field.readonly || $scope.container.data('readonly');
            $scope.fieldtype = fieldtypes[$scope.field.type] ? $scope.field.type : 'text';

            
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