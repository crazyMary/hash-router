!(function() {
  var btn = document.getElementById('btn');
  document.onclick = function(e) {
    if (e.target.id === 'btn') {
      alert(2)
    }
  }
})()