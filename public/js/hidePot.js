const hidePot = function() {
  const jar = document.querySelector('#jar');
  jar.style.visibility = 'hidden';
  setTimeout(() => {
    jar.style.visibility = '';
  }, 1000);
};
