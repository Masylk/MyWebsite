define([
  './digits.js'
],function (digits) {

  var assets = {
    low : {
      asset:"./Assets/Cards/Slash_Low.png",
    },
    middle : {
      asset:"./Assets/Cards/Slash_Middle.png",
    },
    high  :{
      asset:"./Assets/Cards/Slash_High.png",
    },
    guard:{
      asset:"./Assets/Cards/Guard.png",
    },
    faceOff:{
      asset:"./Assets/Cards/Back.png",
    }
  };
  const DIGITS_COLOR = 'blue';

  const INHAND_WIDTH = 140;
  function CardDisplay(pType,pPower,pfaceOff,parent, side) {

    this.type=pType;
    this.power=pPower;

    if(side !== 'undefined')this.side = side
    if(parent !== 'undefined')this.parent = parent;
    if(pfaceOff==='undefined')this.faceOff=true;
    else this.faceOff=pfaceOff;

    this.createHtml();
    this.createPowerNumbers(pPower);
    this.updateAsset();


  }

  CardDisplay.prototype.createHtml=function () {
    var template=$('#cardTemplate');
    this.container=$(template.html());

    if (this.parent !== undefined) {
      $(this.parent).append(this.container);
    }
    else{
       $('#hud').append(this.container);
    }
  };

  CardDisplay.prototype.updateAsset = function(){
    if(this.faceOff){
      this.container.css({
        backgroundImage: 'url(' + assets.faceOff.asset + ')',
      })
    }else{
      this.container.css({
        backgroundImage: 'url(' + assets[this.type].asset + ')',
      });
    }
    this.powerDisplay();
  };

  CardDisplay.prototype.powerDisplay = function () {
    var container = this.container;
    if(this.faceOff){
      container.find('.cardPower1').hide();
      container.find('.cardPower2').hide();
    }else{
      container.find('.cardPower1').show();
      container.find('.cardPower2').show();
    }
  }

  CardDisplay.prototype.createPowerNumbers = function (power) {
    var digitsValue = ('' + power).split('');
    var digitImage;
    var container = this.container;
    for(var i = 0; i < digitsValue.length; i++) {
      digitImage = digits.getImage(digitsValue[i], DIGITS_COLOR);
      digitImage.addClass('cardDigit');
      container.find('.cardPower1').append(digitImage);

      digitImage = digits.getImage(digitsValue[i], DIGITS_COLOR);
      digitImage.addClass('cardDigit');
      container.find('.cardPower2').append(digitImage);
    }

  }

  CardDisplay.prototype.destroyPowerNumbers = function () {
    this.container.find('.cardPower1').empty();
    this.container.find('.cardPower2').empty();
  }

  CardDisplay.prototype.changeValues = function(type, power, faceOff) {
    this.type = type;
    this.power = power;
    if(faceOff !== undefined)
      this.faceOff = faceOff

    this.destroyPowerNumbers();
    this.createPowerNumbers(power);
    this.updateAsset();
  }

  CardDisplay.prototype.defPos=function(pX,pY){
    this.container.css({
      left : pX,
      top : pY
    })
  };

  CardDisplay.prototype.show = function () {
    this.container.show();
  }

  CardDisplay.prototype.hide = function () {
    this.container.hide();
  }

  CardDisplay.prototype.translation = function (pX,pY,pTime,pFunction,pWidth,pHeight) {

    this.container.stop(true);

    var fWidth = pWidth || this.container.width();
    var fHeight = pHeight || this.container.height();

    this.container.animate({
      left : pX,
      top : pY,
      width: fWidth,
      height: fHeight
    },pTime,
    function () {
      if(pFunction) pFunction();
    });
  }

  CardDisplay.prototype.draw=function (pX,pY,pTime,pFunction) {
    var position = this.container.position();
    var mX=position.left + (pX - position.left)/2;
    var mY=position.top + (pY - position.top)/2;
    var fWidth = INHAND_WIDTH;
    var zis = this;
    this.container
      .animate({
        left:mX,
        top:mY,
        width:'0%'
      },
      pTime/2,
      function(){
        zis.faceOff=!(zis.faceOff);

        zis.updateAsset();
      })

      .animate({
        left:pX,
        top:pY,
        width:fWidth
      },
      pTime/2,
      function(){
        if(pFunction) pFunction();

      })

  }

  CardDisplay.prototype.swapSide = function (time, callback) {
    var position = this.container.position();
    var halfLeft = position.left + this.container.width() / 2;
    var halfTime = time / 2;
    var originalWidth = this.container.width();
    var zis = this;
    this.container
    .animate({
      left : halfLeft,
      width : '0%'
    }, halfTime,
    function () {
      zis.faceOff = !zis.faceOff;
      zis.updateAsset();
    })

    .animate({
      left : position.left,
      width : originalWidth
    }, halfTime,
    function () {
      if(callback) callback();
    })
  }

  CardDisplay.prototype.discard=function (pDistance,pTime, pCallback) {
    var zis = this;
    this.container.animate({
      top:'-=' + pDistance,
      opacity:0
    },
    pTime,
    function(){
      if(pCallback) pCallback();
      zis.destroy();
    })
  }

  CardDisplay.prototype.destroy=function () {
    this.container.remove();
  }

  return CardDisplay;
})
