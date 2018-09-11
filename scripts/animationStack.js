define([
  './CardDisplay.js',
  './SlidingText.js'
], function (CardDisplay, SlidingText) {

  var animationStack = {};

  const DRAWCARDS_CONSTS = {
    DECK_IN_TIME : 300,
    DECK_OUT_TIME : 800,
    TURNAROUND_TIME : 700,
    SHOW_TIME : 100,
    GETINHAND_TIME : 300,
    SHOW_X : 500,
    SHOW_Y : 200,
    SELF_DRAW_SHOW_ID : '#selfDrawShow',
    OPPONENT_DRAW_SHOW_ID : '#opponentDrawShow'
  }

  const PLAYEDCARD_CONSTS = {
    WIDTH : 280,
    HEIGHT : 400,
    TIME : 400
  }

  const REVEAL_CONSTS = {
    TIME : 500
  }

  const CARDFIGHT_CONSTS = {
    TIME : 400,
    OUT_TIME : 800,
    FADEWAY_WAIT : 400,
    FADEAWAY_TIME : 1000
  }

  const METEOR_FADEIN_CONSTS = {
    TIME : 1500
  }

  const METEOR_FADEOUT_CONSTS = {
    TIME : 700
  }

  const BLACKSCREEN_ID = '#blackScreen';

  animationStack.stack = new Array();

  animationStack.addPlayerFight = function (playerSelf, playerOpponent, requester) {
    var request;
    this.createAndAddStep(
      function () {
        request = requester();
      },
      function () {
        playerSelf.createAnimation(request.left.type, 1, false, function () {animationStack.animationEnded()});
        playerOpponent.createAnimation(request.right.type, 1, false);
      },
      function () {
        console.log('hey');
        playerSelf.createAnimation('default', 1, true);
        playerOpponent.createAnimation('default', 1, true);

        if(request.result == 'lose') {
          playerSelf.takeDamage(request.damageDone);
        } else if(request.result == 'win') {
          playerOpponent.takeDamage(request.damageDone);
        }
      }
    )
  }

  animationStack.addMeteorFadeIn = function (callback) {
    var blackScreen = $(BLACKSCREEN_ID);
    this.createAndAddStep(
      function () {

      },
      function () {
        blackScreen.animate({
          opacity : 1
        }, METEOR_FADEIN_CONSTS.TIME,
        function () {
          animationStack.animationEnded();
        })
      },
      function () {
        if (callback) callback();
      }
    )

  }

  animationStack.addMeteorFadeOut = function () {
    var blackScreen = $(BLACKSCREEN_ID);
    this.createAndAddStep(
      function () {

      },
      function () {
        blackScreen.animate({
          opacity : 0
        }, METEOR_FADEOUT_CONSTS.TIME,
        function () {
          animationStack.animationEnded();
        })
      },
      function () {
      }
    )
  }

  /**
  * Animation de combat des cartes
  * On utilise un requester pour récuperer les informations des cartes à animer
  * cela permet d'eviter les bugs dans les cas où l'animation est ajoutée alors
  * que les cartes à animer ne sont pas encore crées/stockées
  **/
  animationStack.addCardFight = function (cardsRequester) {
    var request;
    var leftCard;
    var rightCard;
    var result;
    var hudWidth = $('#hud').width();
    var centerPosition = hudWidth / 2;
    var zis = this;

    this.createAndAddStep(
      function () {
        request = cardsRequester();
        leftCard = request.left;
        rightCard = request.right;
        result = request.result;
      },
      function () {
        var leftWidth = leftCard.container.width();
        leftCard.translation(
          centerPosition - leftWidth,
          leftCard.container.position().top,
          CARDFIGHT_CONSTS.TIME,
          function () {
            if(result == 'lose') {
              leftCard.container.css({
                transform : 'rotate(-10turn)'
              })
              leftCard.translation(
                centerPosition - hudWidth, 0, CARDFIGHT_CONSTS.OUT_TIME,
                function () {
                  leftCard.destroy();
                }
              )
              setTimeout(function () {
                rightCard.discard(0, CARDFIGHT_CONSTS.FADEAWAY_TIME, function () {
                  zis.animationEnded();
                })
              }, CARDFIGHT_CONSTS.FADEWAY_WAIT)
            } else if (result == 'win'){
              rightCard.container.css({
                transform : 'rotate(10turn)'
              })
              rightCard.translation(
                centerPosition + hudWidth, 0, CARDFIGHT_CONSTS.OUT_TIME,
                function () {
                  rightCard.destroy();
                }
              )
              setTimeout(function () {
                leftCard.discard(0, CARDFIGHT_CONSTS.FADEAWAY_TIME, function () {
                  zis.animationEnded();
                })
              }, CARDFIGHT_CONSTS.FADEWAY_WAIT)

            } else if (result == 'meteor') {
              rightCard.discard(0, CARDFIGHT_CONSTS.FADEAWAY_TIME);
              leftCard.discard(0, CARDFIGHT_CONSTS.FADEAWAY_TIME);
              new SlidingText('METEOR!');
              zis.animationEnded();

            }else if (result == 'tie') {
              rightCard.discard(0, CARDFIGHT_CONSTS.FADEAWAY_TIME);
              leftCard.discard(0, CARDFIGHT_CONSTS.FADEAWAY_TIME, function () {
                zis.animationEnded();
              });
            }
          }
        );
        rightCard.translation(
          centerPosition,
          rightCard.container.position().top,
          CARDFIGHT_CONSTS.TIME
        )
      },
      function () {
      }
    )
  }

  animationStack.addRevealCard = function (requester, type, power) {
    var zis = this;
    var card;
    this.createAndAddStep(
      function () {
        card = requester();
      },
      function () {
        card.changeValues(type, power);
        card.swapSide(
          REVEAL_CONSTS.TIME,
          function () {
            zis.animationEnded();
          }
        )
      },
      function () {

      }
    )
  }

  animationStack.addPlayedCard = function(index, hand, container, handler, noDiscard) {
    var position;
    var card;
    var zis = this;
    this.createAndAddStep(
      function () {
        position = container.position();
        card = hand.list.splice(index, 1)[0];
        if(!noDiscard) hand.discardAll();
        if(handler) handler(card);
      },
      function () {
        card.translation(
          position.left,
          position.top,
          PLAYEDCARD_CONSTS.TIME,
          function () {
            zis.animationEnded();
          },
          PLAYEDCARD_CONSTS.WIDTH,
          PLAYEDCARD_CONSTS.HEIGHT
        )
      },
      function () {

      }
    )
  }

  animationStack.addDiscardHand = function (discarded, hand) {
    this.createAndAddStep(
      function () {

      },
      function () {
        console.log(hand.list);
        for (var i = 0; i < discarded.length; i++) {
          hand.list[i].changeValues(discarded[i].type, discarded[i].power, false);
        }
        hand.discardAll();
        animationStack.animationEnded();
      },
      function () {

      }
    )
  }

  animationStack.addDrawCards = function (cardInfos, selfHand, opponentHand, selfDeck, opponentDeck, endHandler) {
    var zis = this;
    var card;
    var cards = new Array();
    var opponentCards = new Array();
    var selfDrawShow = $(DRAWCARDS_CONSTS.SELF_DRAW_SHOW_ID);
    var opponentDrawShow = $(DRAWCARDS_CONSTS.OPPONENT_DRAW_SHOW_ID);
    this.createAndAddStep(
      function () {
        for(var i = 0; i < cardInfos.length; i++) {
          card = new CardDisplay(cardInfos[i].type, cardInfos[i].power, true);
          card.hide();
          cards.push(card);
          card = new CardDisplay('cheating!', '0', true);
          card.hide();
          opponentCards.push(card);
        }
      },
      function () {
        opponentDeck.slideIn(DRAWCARDS_CONSTS.DECK_IN_TIME);
        selfDeck.slideIn(DRAWCARDS_CONSTS.DECK_IN_TIME,
        function () {
          var i = 0;
          if(i < cards.length - 1) {
            zis.drawStandart(cards[i], selfHand, selfDeck, selfDrawShow);
            zis.drawFaceOff(opponentCards[i], opponentHand, opponentDeck, opponentDrawShow)

            var interval = setInterval(function () {
              if(i < cards.length - 1) {
                zis.drawStandart(cards[i], selfHand, selfDeck, selfDrawShow)
                zis.drawFaceOff(opponentCards[i], opponentHand, opponentDeck, opponentDrawShow)
              } else {
                zis.drawStandart(cards[i], selfHand, selfDeck, selfDrawShow, function () {zis.animationEnded()});
                zis.drawFaceOff(opponentCards[i], opponentHand, opponentDeck, opponentDrawShow)
                clearInterval(interval);
              }
              i++;
            },  DRAWCARDS_CONSTS.TURNAROUND_TIME + DRAWCARDS_CONSTS.SHOW_TIME)
          } else {
            this.drawStandart(cards[i], selfHand, selfDeck, selfDrawShow, function () {zis.animationEnded()});
            this.drawFaceOff(opponentCards[i], opponentHand, opponentDeck, opponentDrawShow)
          }
          i++;
        })
      },
      function () {
        selfDeck.slideOut();
        opponentDeck.slideOut();
        endHandler();
      }
    )
  }

  animationStack.drawStandart = function (card, hand, deck, drawShow, callBack) {
    var position = deck.getPosition();
    var showPosition = drawShow.position();
    card.defPos(position.left, position.top);
    card.show();

    card.draw(
      showPosition.left,
      showPosition.top,
      DRAWCARDS_CONSTS.TURNAROUND_TIME,
      function () {
        hand.addCard(card);

        setTimeout(function () {
          var position = hand.getCardPosition(card);
          var cardDimensions = hand.getInhandDimensions();

          card.translation(
            position.left,
            position.top,
            DRAWCARDS_CONSTS.GETINHAND_TIME,
            callBack,
            cardDimensions.width,
            cardDimensions.height
           )
        }, DRAWCARDS_CONSTS.SHOW_TIME)

      }
    )
  }

  animationStack.drawFaceOff = function (card, hand, deck, drawShow) {
    var position = deck.getPosition();
    var showPosition = drawShow.position();
    card.defPos(position.left, position.top);
    card.show();

    card.translation(
      showPosition.left,
      showPosition.top,
      DRAWCARDS_CONSTS.TURNAROUND_TIME,
      function () {
        hand.addCard(card);

        setTimeout(function () {
          var position = hand.getCardPosition(card);
          var cardDimensions = hand.getInhandDimensions();

          card.translation(
            position.left,
            position.top,
            DRAWCARDS_CONSTS.GETINHAND_TIME,
            undefined,
            cardDimensions.width,
            cardDimensions.height
          )
        }, DRAWCARDS_CONSTS.SHOW_TIME)
      }
    )
  }

  animationStack.createAndAddStep = function (start, animate, end) {
    var step = {
      start : start,
      animate : animate,
      end : end
    }
    this.addToStack(step);
  }

  animationStack.addToStack = function (step) {
    this.stack.push(step);
    if(this.stack.length <= 1) {
      this.launchNextStep();
    }
  }

  animationStack.animationEnded = function () {
    this.stack.shift().end();
    if(this.stack.length > 0) {
      this.launchNextStep();
    }
  }

  animationStack.launchNextStep = function () {
    this.stack[0].start();
    this.stack[0].animate();
  }

  return animationStack;
})
