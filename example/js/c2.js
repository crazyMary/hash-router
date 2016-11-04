!(function() {
  document.addEventListener('click', function(ev) {
    if (ev.target.id === 'btn') {
      alert('clicked')
    }
  }, false)
})()