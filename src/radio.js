angular
  .module('digger.radio', [
    
  ])

  .directive('diggerRadio', function($safeApply){


    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:true,
      link:function($scope, elem, $attrs){
        
        var url = null;

        function cleanup(){
          if(url){
            $digger.radio.unlisten(url);  
          }
        }

        $scope.$on('$destroy', cleanup);

        function listen(container){

          cleanup();

          url = container.diggerwarehouse();

          $digger.radio.listen(url, function(packet){            

            if(packet.action=='append'){

              /*
              
                this checks for appends to the root supplychain
                
              */
              if(!packet.target && packet.route!=container.diggerurl()){
                return;
              }

              var target = packet.target ? container.find('=' + packet.target._digger.diggerid) : container;

              if(target.isEmpty()){
                return;
              }

              var to_append = $digger.create(packet.body);

              $safeApply($scope, function(){
                to_append.each(function(append){
                  var check = target.find('=' + append.diggerid());
                  if(check.count()<=0){
                    target.append(append);
                  }
                })
              })

              $digger.emit('switchboard', packet);
            }
            else if(packet.action=='save'){
              var target_id = packet.target._digger.diggerid;
              var target = container.find('=' + target_id);

              $safeApply($scope, function(){
                target.inject_data(packet.body);
              })

              $digger.emit('switchboard', packet);

            }
            else if(packet.action=='remove'){
              var parent_id = packet.target._digger.diggerparentid;

              var parent = parent_id ? container.find('=' + parent_id) : container;

              if(parent.isEmpty()){
                return;
              }

              $safeApply($scope, function(){
                parent.get(0)._children = _.filter(parent.get(0)._children, function(model){
                  return model._digger.diggerid!=packet.target._digger.diggerid;
                })  
              })

              $digger.emit('switchboard', packet);
              
            }
          })
        }
        $scope.$watch($attrs.for, function(container){
          if(!container){
            return;
          }

          listen(container);


        })

      }
    }
  })
