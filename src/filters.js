angular
  .module('digger.filters', [
    
  ])

  .filter('ucfirst', function () {
    return function (text, length, end) {
    	text = text || '';
      return text.replace(/^\w/, function(st){
        return st.toUpperCase();
      })
    }
  })

  .filter('idcolon', function () {
    return function (text, length, end) {
      text = text || '';
      return text.replace(/^\w+:/, '');
    }
  })

  .filter('icontitle', function () {
    return function (text, length, end) {
      text = text || '';
      return text.replace(/^icon-/, '');
    }
  })

  .filter('matchContainer', function() {
    return function(items, selector) {
      if(!search){
        return items;
      }
      var filtered = [];
      angular.forEach(items, function(item) {
        return item.match(selector);
      })
      return filtered;
    }
  })

  .filter('rejectContainer', function() {
    return function(items, selector) {
      if(!search){
        return items;
      }
      var filtered = [];
      angular.forEach(items, function(item) {
        return !item.match(selector);
      })
      return filtered;
    }
  })

  .filter('parentContainer', function() {

    return function(items, parentid, noresults) {
      if(!items){
        return null;
      }
      parentid = parentid || '';
      if(!parentid.match(/\w/)){
        return noresults ? [] : items;
      }
      var filtered = [];
      angular.forEach(items, function(item) {
        if(item.digger('diggerparentid')==parentid){
          filtered.push(item);
        }
      })
      return filtered;
    };
  })

  .filter('searchContainers', function() {

    return function(items, search, noresults) {
      if(!items){
        return null;
      }
      search = search || '';
      if(!search.match(/\w/)){
        return noresults ? [] : items;
      }
      var filtered = [];
      angular.forEach(items, function(item) {
        var attr = item.get(0);
        var added = false;
        for(var prop in attr){
          var value = attr[prop];
          if(!added && value && typeof(value)==='string'){
            if(prop.indexOf('_')!=0 && value.toLowerCase().indexOf(search.toLowerCase())>=0){
              added = true;
              filtered.push(item);
            }  
          }
        }
      })
      return filtered;
    };
  })
  