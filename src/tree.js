angular
  .module('digger.tree', [
    
  ])

  .directive('diggerTree', function($safeApply){


    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        root:'=',
        selected:'=',
        selector:'=',
        treetitle:'@',
        loadchildren:'&',
        icon:'&'
      },
      replace:true,
      templateUrl:"template/tree/tree.html",
      controller:function($scope){

        $scope.findicon = function(container){
          return 'icon-folder-close';
        }

        $scope.toggleopen = function(container){
          var existing = container.data('open') || false;
          container.data('open', !existing);
          /*
          
            this means actually yes
            
          */
          if(!existing){
            $scope.loadcontainer(container);
          }
        }

        $scope.clickcontainer = function(container){
          $scope.selected = container;
          $scope.loadcontainer(container);
          $scope.$emit('loadcontainer', container);
        }

        $scope.$on('digger:reload', function(){
          $scope.loadcontainer($scope.selected);
        })

        $scope.loadcontainer = function(container, done){
          if(!container){
            return;
          }

          container.data('open', true);

          container('> *:sort').ship(function(results){

            $safeApply($scope, function(){

              /*
              
                hard reset the children
                
              */
              container.get(0)._children = results.models;
              
              done && done();
            })
            
          })

        }
      },
      link:function($scope, elem, $attrs){
        $scope.$watch('root', function(root){
          if(!root){
            return;
          }
          console.log('-------------------------------------------');
          console.log('root changed');
          $scope.container = root;
          $scope.container.isroot = true;
          $scope.loadcontainer(root);

        })
/*
        $scope.$watch('selected', function(container){
          console.log('-------------------------------------------');
          console.log('selected');
          var treeone = $scope.root.find('=' + container.diggerid());
          if(!treeone){
            return;
          }
          //$scope.loadcontainer(treeone);
        })
*/
        $scope.$on('manualcontext', function(){
          $scope.selected = $scope.root;
        })

      }
    }
  })

  /*
  
    we put this one in the template cache so we can call ng-include on it
    
  */
  .run(["$templateCache", function($templateCache){

      /*
      
        Recursive tree view
        
      */
    $templateCache.put("template/tree/tree.html",
      [
  '<div class="digger-angular-tree">',
  '   <div>',
  '     <div ng-click="toggleopen(container);" class="treetoggle"> ',
  '       <div class="plusminus" ng-hide="container.data(\'open\')">+</div>',
  '       <div class="plusminus" ng-show="container.data(\'open\')">-</div>',
  '     </div>',
  '     <div class="treetitle" ng-class="{treehover:over || container.diggerid()==selected.diggerid()}" ng-click="clickcontainer(container);" ng-mouseenter="over=true" ng-mouseleave="over=false">',
  '       <i class="digger-icon {{ icon({container:container}) || \'icon-folder-close\' }}"></i>',
  '       <span ng-hide="container.isroot">{{container.title()}}</span>',
  '       <span ng-show="container.isroot">{{treetitle}}</span>',
  '     </div>',
  '   </div>',
  '   <div ng-show="container.data(\'open\')">',
  '     <div class="children">',
  '       <div ng-repeat="container in container.children().containers() | orderBy:sortContainer" ng-include="\'template/tree/tree.html\'"></div>',
  '     </div>',
  '   </div>',
  '</div>'
      ].join("\n")
      );

  }]);