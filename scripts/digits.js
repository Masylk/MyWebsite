define([

], function () {

  const PATH_PREFIX = './Assets/Numbers/';
  const COLORS_PREFIX = {
    blue : 'blue_',
    red : 'red_'
  }

  const IMAGE_FORMAT = '.png'

  var digits = {};
  digits.images = {};

  digits.getImage = function (digit, color) {
    return $(this.images[COLORS_PREFIX[color] + digit].prop('outerHTML'))
  }

  digits.loadAssets = function () {
    var img;
    for(var i = 0; i < 10; i++) {
      img = $('<img></img>');
      img.attr('src', PATH_PREFIX + COLORS_PREFIX.blue + i + IMAGE_FORMAT);
      this.images[COLORS_PREFIX.blue + i] = img;
    }

    for(var i = 0; i < 10; i++) {
      img = $('<img></img>');
      img.attr('src', PATH_PREFIX + COLORS_PREFIX.red + i + IMAGE_FORMAT);
      this.images[COLORS_PREFIX.red + i] = img;
    }
  }

  return digits
})
