define([
  './animationStack.js'
], function (animationStack) {

  const HANDCONTAINER_ID = {
    self : '#selfHand',
    opponent : '#opponentHand'
  }

  const PLAYEDCARD_ID = {
    self : '#selfPlayedCard',
    opponent : '#opponentPlayedCard'
  }

  const INHAND_WIDTH = 140;
  const INHAND_HEIGHT = 200;
  const INHAND_MARGIN = 10;
  const HOVERED_HEIGHT = 300;
  const HOVERED_WIDTH = 210;
  const HOVERED_TIME = 200;
  const HOVERED_ADD_X = HOVERED_WIDTH - INHAND_WIDTH;
  const HOVERED_ADD_Y = HOVERED_HEIGHT - INHAND_HEIGHT;

  const DISCARD_Y_LENGTH = 100;
  const DISCARD_TIME = 1000;

  const PLAYEDCARD_WIDTH = 400;
  const PLAYEDCARD_HEIGHT = 280;
  const PLAYEDCARD_TIME = 400;

  const GET_INDEX_POSITION = {
    self : function(index) {
      var position = this.container.position();
      return {
        left : position.left + index * (INHAND_WIDTH + INHAND_MARGIN),
        top : position.top
      }
    },
    opponent : function (index) {
      var position = this.container.position();
      return {
        left : position.left - ((index + 1) * (INHAND_WIDTH + INHAND_MARGIN)),
        top : position.top
      }
    }
  }

  function Hand (id, cardPlayedHandler, discardpile) {
    this.list = new Array();
    this.discardpile = discardpile;
    this.cardPlayedHandler = cardPlayedHandler;
    this.getContainer(id);
    this.getPlayedCardContainer(id);
    this.getIndexPosition = GET_INDEX_POSITION[id];
  }

  Hand.prototype.getContainer = function (id) {
    this.container = $(HANDCONTAINER_ID[id]);
    this.container.css({
      height : INHAND_HEIGHT
    })
  }

  Hand.prototype.getPlayedCardContainer = function (id) {
    this.playedCardContainer = $(PLAYEDCARD_ID[id]);
  }

  Hand.prototype.addCard = function (card) {
    this.list.push(card);
  }

  Hand.prototype.getCardPosition = function (card) {
    return this.getIndexPosition(this.list.indexOf(card));
  }

  Hand.prototype.enableCardInputs = function () {
    var zis = this;
    var card;
    for(var i = 0; i < this.list.length; i++) {
      card = this.list[i];
      this.enableClick(card, i);
      this.enableHover(card, i);
    }
  }

  Hand.prototype.enableClick = function (card, index) {
    var zis = this;
    card.container.off('click');
    card.container.on('click', function () {
      zis.playedCard(index);
    })
  }

  Hand.prototype.enableHover = function (card, index) {
    var zis = this;
    card.container.hover(function () {
      zis.hoveredIn(index);
    }, function () {
      zis.hoveredOut(index);
    })
  }

  Hand.prototype.hoveredIn = function (index) {
    var position;
    for(var i = 0; i < this.list.length; i++) {
      position = this.getIndexPosition(i);
      if (i < index) {
        this.list[i].translation(position.left, position.top, HOVERED_TIME, undefined, INHAND_WIDTH, INHAND_HEIGHT);
      } else if (i == index) {
        this.list[i].translation(position.left, position.top - HOVERED_ADD_Y, HOVERED_TIME, undefined, HOVERED_WIDTH, HOVERED_HEIGHT);
      } else {
        this.list[i].translation(position.left + HOVERED_ADD_X, position.top, HOVERED_TIME, undefined, INHAND_WIDTH, INHAND_HEIGHT);
      }
    }
  }

  Hand.prototype.hoveredOut = function (index) {
    var position;
    for(var i = 0; i < this.list.length; i++) {
      position = this.getIndexPosition(i);
      this.list[i].translation(position.left, position.top, HOVERED_TIME, undefined, INHAND_WIDTH, INHAND_HEIGHT);
    }
  }

  Hand.prototype.disableCardInputs = function () {
    var card;
    for(var i = 0; i < this.list.length; i++) {
      this.list[i].container.off();
    }
  }

  Hand.prototype.playRandomCard = function () {
    this.playedCard(Math.floor(Math.random() * this.list.length));
  }

  Hand.prototype.playedCard = function (index) {
    var card = this.list[index];
    this.discardpile.addCardToList(card, 'self');
    this.cardPlayedHandler(index, card);
    this.disableCardInputs();
    this.playedCardAnimation(index);
  }

  Hand.prototype.playedCardAnimation = function (index, handler, noDiscard) {
    animationStack.addPlayedCard(index, this, this.playedCardContainer, handler, noDiscard)
  }

  Hand.prototype.playCardAt = function (index, handler) {
    this.playedCardAnimation(index, handler, true);
  }

  Hand.prototype.discardAll = function () {
    var card;
    for(var i = this.list.length - 1; i >= 0; i--) {
        card = this.list[i];
        card.discard(DISCARD_Y_LENGTH, DISCARD_TIME);
        this.list.splice(i, 1);
    }
  }

  Hand.prototype.getCardIndex = function(card) {
    return this.list.indexOf(card);
  }

  Hand.prototype.getInhandDimensions = function() {
    return {
      width : INHAND_WIDTH,
      height : INHAND_HEIGHT
    }
  }

  Hand.prototype.destroy = function () {
    for(var i = this.list.length - 1; i >= 0; i--) {
      this.list.pop().destroy();
    }
  }

  return Hand;
})
