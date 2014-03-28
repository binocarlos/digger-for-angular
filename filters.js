module.exports = 'digger.filters';
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

  .filter('cutoff', function(){
    return function (text, length) {
      text = text || '';
      if(text.length>length){
        text = text.substr(0, length) + '...';
      }
      return text;
    }
  })

  .filter('idcolon', function () {
    return function (text, length, end) {
      text = text || '';
      return text.replace(/^\w+:/, '');
    }
  })

  .filter('lastfieldpart', function(){
    return function(st){
      var parts = st.split('.');
      return parts.pop();
    }
  })

  .filter('money', function(){
    return function(st){
      if(!st){
        return '';
      }
      return ('' + st).replace(/^\./, '0.');
    }
  })

  .filter('icontitle', function () {
    return function (text, length, end) {
      text = text || '';
      return text.replace(/^icon-/, '');
    }
  })

  .filter('datetime', function () {
    return function (timestamp) {
      var dt = new Date(timestamp);

      return dt.toString();
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

  .filter('namesort', function() {

    return function(items) {
      var ret = [].concat(items);
      ret.sort(function(a, b) {
        var textA = (a.attr('name') || a.attr('title') || a.tag()).toUpperCase();
        var textB = (b.attr('name') || a.attr('title') || b.tag()).toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });  
      return ret;
    };
  })

  .filter('diggername', function() {

    return function(container) {
      if(!container){
        return '';
      }
      return container.title();
    }
  })

  .filter('diggersummary', function() {

    return function(container) {
      if(!container){
        return '';
      }
      var st = container.tag();
      if(container.id()){
        st += '#' + container.id();
      }
      var c = container.classnames() || [];
      if(c.length>0){
        st += '.' + container.classnames().join('.');
      }
      return st;
    }
  })

  .filter('viewersort', function() {

    return function(items) {
      var ret = [].concat(items);
      ret.sort(function(a, b) {
        var textA = (a.attr('name') || a.tag()).toUpperCase();
        var textB = (b.attr('name') || b.tag()).toUpperCase();
        var folderA = (a.tag()=='folder');
        var folderB = (b.tag()=='folder');

        if(folderA && !folderB){
          return -1;
        }
        else if(folderB && !folderA){
          return 1;
        }
        
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });  
      return ret;
    };
  })
  