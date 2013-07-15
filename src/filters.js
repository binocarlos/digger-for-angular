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
      return text.replace(/^\w+:/, '');
    }
  })
  