define([
  './digits.js'
], function (digits) {

  const WAIT_DURATION = 500;
  const POPUP_DIGIT_DELAY = 100;
  const POPUP_HEIGHT = 70;
  const DIGIT_POPUP_TIME = 200;
  const DIGIT_MARGIN = 5;

  function NumberPopup (number, posX, posY, digitWidth, digitHeight, color, parent) {
    this.color = color;
    this.digitWidth = digitWidth;
    this.digitHeight = digitHeight;

    this.digitDisplays = new Array();

    this.createContainer(posX, posY, parent);

    this.digitaliseNumber(number);
    this.addDigit();
  }

  NumberPopup.prototype.addDigit = function () {
    var digitDisplay = digits.getImage(this.digits[0], this.color);
    digitDisplay.css({
      position : 'relative',
      marginLeft : DIGIT_MARGIN,
      top : POPUP_HEIGHT,
      width : this.digitWidth,
      height : this.digitHeight,
      opacity : '0'
    })
    this.digitDisplays.push(digitDisplay);
    this.container.append(digitDisplay);

    this.digits.shift();
    var zis = this;

    if(this.digits.length > 0) {
      digitDisplay.animate({top : 0, opacity : 1}, DIGIT_POPUP_TIME, 'swing');
      setTimeout(function () {
        zis.addDigit();
      }, POPUP_DIGIT_DELAY);

    } else {
      digitDisplay.animate({top : 0, opacity : 1}, DIGIT_POPUP_TIME, 'swing', function () {
        zis.startWaitPhase();
      })
    }
  }

  NumberPopup.prototype.removeDigit = function () {
    var digitDisplay = this.digitDisplays.shift();
    var zis = this;
    if(this.digitDisplays.length > 0) {
      digitDisplay.animate({top : -POPUP_HEIGHT, opacity : 0}, DIGIT_POPUP_TIME, 'swing');
      setTimeout(function () {
        zis.removeDigit();
      }, POPUP_DIGIT_DELAY);
    } else {
      digitDisplay.animate({top : -POPUP_HEIGHT, opacity : 0}, DIGIT_POPUP_TIME, 'swing', function () {
        zis.destroy();
      });
    }
  }

  NumberPopup.prototype.startWaitPhase = function () {
    var zis = this;
    setTimeout(function () {
      zis.removeDigit();
    }, WAIT_DURATION);
  }

  NumberPopup.prototype.digitaliseNumber = function (number) {
    this.digits = ('' + number).split('');
  }

  NumberPopup.prototype.createContainer = function (x, y, parent) {
    this.container = $('<div></div>');
    this.container.css({
      position : 'absolute',
      left : x,
      top : y
    })
    parent.append(this.container);
  }

  NumberPopup.prototype.destroy = function () {
    this.container.remove();
    this.parent = undefined;
  }

  return NumberPopup;
})
