var templates = {
  simple_editor:require('./templates/simple_editor'),
  simple_form:require('./templates/simple_form'),
  simple_table:require('./templates/simple_table')
}

angular
  .module('digger.form', [
    
  ])

  /*
  
    the ACCOUNT DETAILS controller
    
  */
  .directive('simpleEditor', function($blueprints){
    return {
      restrict:'EA',
      scope:{
        blueprint:'=',
        selector:'=',
        warehouse:'=',
        savefn:'=',
        deletefn:'='
      },
      replace:true,
      template:templates.simple_editor,
      controller:function($scope){
        $scope.action = 'Add';
        $scope.title = '';

        $scope.$on('form:cancel', function(){
          $scope.editcontainer = $scope.makeblankcontainer();
          $scope.action = 'Add';
        })

        $scope.editfn = function(container){
          $scope.editcontainer = container;
          $scope.action = 'Save';
        }

        $scope.$watch('blueprint', function(name){

          var blueprintobj = $scope.blueprintobj = $blueprints[name];

          if(!name || !blueprintobj){
            return;
          }

          $scope.title = blueprintobj.name;
          $scope.makeblankcontainer = function(){
            return $digger.create({
              _digger:_.extend({}, blueprintobj._digger)
            })
          }
          $scope.editcontainer = $scope.makeblankcontainer();

          if($scope.selector){
            $scope
              .warehouse($scope.selector)
              .ship(function(items){

                /*
                
                  text
                  
                */
                $scope.$apply(function(){
                  $scope.currentcontainer = items;
                })
              })
          }
          

        })
        
      }
    }
  })

  .directive('simpleTable', function($blueprints){
    return {
      restrict:'EA',
      scope:{
        container:'=',
        blueprint:'=',
        editfn:'=',
        deletefn:'='
      },
      replace:true,
      template:templates.simple_table,
      controller:function($scope){
        $scope.myValueFunction = function(c) {
          return c.digger('diggerpath')[0] || c.attr('name');
        };
      }
    }
  })

  .directive('simpleForm', function($blueprints){
    return {
      restrict:'EA',
      scope:{
        container:'=',
        blueprint:'=',
        action:'='
      },
      replace:true,
      template:templates.simple_form,
      controller:function($scope){

        $scope.model = {};

        $scope.$watch('container', function(container){
          if(!container){
            return;
          }
          $scope.showvalidate = false;
          $scope.model = container.get(0);
        })

        $scope.$watch('blueprint', function(blueprint){
          
        })

        $scope.formcancel = function(){
          $scope.$emit('form:cancel');
        }

        $scope.formsubmit = function(){

          $scope.showvalidate = true;

          if($scope.containerForm.$valid){

            $scope.container.save().ship(function(){
              console.log('-------------------------------------------');
              console.dir($scope.container.toJSON());  
            })
            
            $scope.$emit('form:save');
          }

          return false;
        }
        
      }
    }
  })

  .filter('ucfirst', function () {
    return function (text, length, end) {
      return text.replace(/^\w/, function(st){
        return st.toUpperCase();
      })
    }
  })
  