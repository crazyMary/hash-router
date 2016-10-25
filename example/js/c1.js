!(function() {
  var fn1 = function() {
    console.log('window clicked')
  };
  window.addEventListener('click', fn1, false);
})()