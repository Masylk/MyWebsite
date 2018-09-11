define([
  './Animation.js',
  './NumberPopup.js'
], function (Animation, NumberPopup) {

  const PLAYERCONTAINER_ID = {
    self : '#playerSelf',
    opponent : '#playerOpponent'
  }

  const PLAYERMARKER_ID = {
    self : '#playerSelfMarker',
    opponent : '#playerOpponentMarker'
  }

  const REPLACE_CONTAINER = {
    self : function (container) {
      var marker = $(PLAYERMARKER_ID['self']);
      var position = marker.position();
      container.css({
        left : position.left,
        top : position.top
      })
    },
    opponent : function (container) {
      var marker = $(PLAYERMARKER_ID['opponent']);
      var position = marker.position();
      var width = marker.width();
      container.css({
        right : $('#fieldContainer').width() - (position.left + width),
        top : position.top
      })
    }
  }

  const LIFEBAR_CONTAINER_ID = {
    self : '#lifeBarSelf',
    opponent : '#lifeBarOpponent'
  }

  const DGTBAR_ID = {
    self : '#dgtSelf',
    opponent : '#dgtOpponent'
  }

  const LIFEBAR_ID = {
    self : '#lifeSelf',
    opponent : '#lifeOpponent'
  }

  const NAMEFIELD_ID = {
    self : '#nameSelf',
    opponent : '#nameOpponent'
  }


  const DAMAGE_POPUP_Y_OFFSET = 100;
  const DAMAGE_POPUP_WIDTH = 100;
  const DAMAGE_POPUP_HEIGHT = 100;
  const DAMAGE_POPUP_COLOR = 'red';

  var arrayAnimation={
    self:{
      default:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Masamune/Masamune_Idle_sprite.png",
        steps:7,
        totalTime:1000,

        width:243,
        height:296,
        onScale:false,

        startWidth:20,
        offsetWidth:190,

      },
      low:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Masamune/Masamune_slash_low_sprite.png",
        steps:16,
        totalTime:1000,

        width:243,
        height:296,
        onScale:false,

        startWidth:20,
        offsetWidth:190,

      },
      middle:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Masamune/Masamune_Slash_middle_sprite.png",
        steps:16,
        totalTime:1000,

        width:243,
        height:296,
        onScale:false,

        startWidth:20,
        offsetWidth:190,

      },
      high:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Masamune/Masamune_Slash_High_Sprite.png",
        steps:16,
        totalTime:1000,

        width:243,
        height:296,
        onScale:false,

        startWidth:20,
        offsetWidth:190,

      },
      guard:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Masamune/Masamune_guard_high_sprite.png",
        steps:2,
        totalTime:1000,

        width:243,
        height:296,
        onScale:false,

        startWidth:20,
        offsetWidth:190,

      },
      hit:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Masamune/Masamune_Hit_High_Low_sprite.png",
        steps:6,
        totalTime:1000,

        width:243,
        height:296,
        onScale:false,

        startWidth:20,
        offsetWidth:190,

      },
      death:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Masamune/Masamune_death_front_sprite.png",
        steps:9,
        totalTime:1000,

        width:243,
        height:296,
        onScale:false,

        startWidth:20,
        offsetWidth:190,

      }
    },
    opponent:{
      default:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Nemusama/Nemusama_Idle_Sprite.png",
        steps:7,
        totalTime:1000,

        width:243,
        height:296,
        onScale:true,

        startWidth:20,
        offsetWidth:190,

      },
      low:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Nemusama/Nemusama_Slash_Low_Sprite.png",
        steps:8,
        totalTime:1000,

        width:243,
        height:296,
        onScale:true,

        startWidth:20,
        offsetWidth:190,

      },
      middle:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Nemusama/Nemusama_Slash_Middle_Sprite.png",
        steps:16,
        totalTime:1000,

        width:243,
        height:296,
        onScale:true,

        startWidth:20,
        offsetWidth:190,

      },
      high:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Nemusama/Nemusama.png",
        steps:16,
        totalTime:1000,

        width:243,
        height:296,
        onScale:true,

        startWidth:20,
        offsetWidth:190,

      },
      guard:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Nemusama/Nemusama_Guard_High_Sprite.png",
        steps:2,
        totalTime:1000,

        width:243,
        height:296,
        onScale:true,

        startWidth:20,
        offsetWidth:190,

      },
      hit:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Nemusama/Nemusama_hit_High_Low_Sprite.png",
        steps:6,
        totalTime:1000,

        width:243,
        height:296,
        onScale:true,

        startWidth:20,
        offsetWidth:190,

      },
      death:{
        asset:"./Assets/Image_bonus/sprite_sheet/Sprite_en_ligne/Nemusama/Nemusama_Death_Front_Sprite.png",
        steps:9,
        totalTime:1000,

        width:243,
        height:296,
        onScale:true,

        startWidth:20,
        offsetWidth:190,

      }
    }
  }

  const METEOR_RANDOMIZER = [
    'low',
    'high'
  ]
  const DGTBAR_WAIT_TIME = 1500;

  function Player(id, startingLife, name) {
    this.getContainer(id);
    REPLACE_CONTAINER[id](this.container);
    this.getBars(id);
    this.updateName(id, name);
    this.life = startingLife;
    this.maxLife = startingLife;

    this.updateLifebar('100%');

    this.id=id;
    this.createAnimation('default',1,true);
  }

  Player.prototype.updateLifebar = function (percent) {
    var dgtBar = this.dgtBar;
    this.lifeBar.css('width', percent);
    setTimeout(function () {
      dgtBar.css('width', percent);
    }, DGTBAR_WAIT_TIME);
  }
  Player.prototype.takeDamage = function (damage) {
    var dgtBar = this.dgtBar;
    this.life -= damage;
    var barPercent = ((this.life / this.maxLife) * 100) + '%';

    this.updateLifebar(barPercent);

    var position = this.marker.position();
    new NumberPopup(
      damage,
      position.left,
      position.top - DAMAGE_POPUP_Y_OFFSET,
      DAMAGE_POPUP_WIDTH,
      DAMAGE_POPUP_HEIGHT,
      DAMAGE_POPUP_COLOR,
      $('#fieldContainer')
     )
     var zis = this;

     this.createAnimation('hit', 0.7, false);
  }

  Player.prototype.getContainer = function (id) {
    this.container = $(PLAYERCONTAINER_ID[id]);
    this.marker = $(PLAYERMARKER_ID[id]);
  }

  Player.prototype.getBars = function (id) {
    this.lifeBarContainer = $(LIFEBAR_CONTAINER_ID[id]);
    this.dgtBar = $(DGTBAR_ID[id]);
    this.lifeBar = $(LIFEBAR_ID[id]);
  }

  Player.prototype.updateName = function (id, name) {
    $(NAMEFIELD_ID[id]).text(name);
  }

  Player.prototype.createHtml=function () {
    $('playerSelf').append(this.container);
  }

  Player.prototype.meteorSlash = function () {
    var type = METEOR_RANDOMIZER[Math.floor(Math.random() * METEOR_RANDOMIZER.length)];
    this.createAnimation(type, 0.15, false);
  }

  Player.prototype.createAnimation=function(pType,pTimeScale,pLoop,pCallBack,pLastframe){
    var zis=this;
    var id=this.id;

    if(this.animation!== undefined)this.animation.destroy();

    this.animation = new Animation(arrayAnimation[id][pType], this.container, pTimeScale, pLoop, function () {
      zis.createAnimation('default', 1, true);
      if(pCallBack) pCallBack();
    });
  }

  return Player;
})
