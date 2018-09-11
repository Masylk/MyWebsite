define([

], function () {

  const PARENT_ID = '#hud';

  const IN_TIME = 350;
  const MID_TIME = 1300;
  const OUT_TIME = 350;

  const STARTING_LEFT = '5%';
  const MIDDLE_LEFT = '30%';
  const MIDDLE_END_LEFT = '35%';
  const END_LEFT = '60%';

  function SlidingText(text) {
    this.createContainer(text);
    this.addEntry();
    this.addMiddle();
    this.addExit();
  }

  SlidingText.prototype.addEntry = function () {
    this.container.css({
      left : STARTING_LEFT,
      opacity : 0
    });

    this.container.animate({
      left : MIDDLE_LEFT,
      opacity : 1
    }, IN_TIME, 'linear');
  }

  SlidingText.prototype.addMiddle = function () {
    this.container.animate({
      left : MIDDLE_END_LEFT
    }, MID_TIME, 'linear');
  }

  SlidingText.prototype.addExit = function () {
    var zis = this;
    this.container.animate({
      left : END_LEFT,
      opacity : 0
    }, OUT_TIME,
    function () {
      zis.destroy();
    });
  }

  SlidingText.prototype.destroy = function () {
    this.container.remove();
  }

  SlidingText.prototype.createContainer = function (text) {
    this.container = $('<div class="slidingText"></div>')
    this.container.text(text);
    $(PARENT_ID).append(this.container);
  }

  return SlidingText;
})
