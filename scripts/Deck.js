define([

], function () {

  DECKCONTAINER_ID = {
    self : '#selfDeck',
    opponent : '#opponentDeck'
  }

  DECKMARKERS_ID = {
    self : {
      in : '#selfDeckIn',
      out : '#selfDeckOut'
    },
    opponent : {
      in : '#opponentDeckIn',
      out : '#opponentDeckOut'
    }

  }

  function Deck(id, startingSize) {
    this.size = startingSize;
    this.getContainers(id);
  }

  Deck.prototype.slideIn = function (time, callback) {
    var position = this.markerIn.position();
    this.container.animate({
      left : position.left,
      top : position.top
      }, time,
      function () {
        if(callback) callback();
      }
    )
  }

  Deck.prototype.slideOut = function (time, callback) {
    var position = this.markerOut.position();
    this.container.animate({
      left : position.left,
      top : position.top
      }, time,
      function () {
        if(callback) callback();
      }
    )
  }

  Deck.prototype.getPosition = function () {
    return this.container.position();
  }

  Deck.prototype.getContainers = function (id) {
    this.container = $(DECKCONTAINER_ID[id]);
    this.markerIn = $(DECKMARKERS_ID[id].in);
    this.markerOut = $(DECKMARKERS_ID[id].out);
    var position = this.markerOut.position();
    this.container.css({
      left : position.left,
      top : position.top
    })
  }

  Deck.prototype.destroy = function () {
    
  }

  return Deck;
})
