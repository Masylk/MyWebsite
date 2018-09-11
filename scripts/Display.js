define([

],
function () {

  function display () {
      this.container.css({
        left: this.x + 'px',
        top:  this.y + 'px'
      });
  }

  return display
})
