define([
  './Player.js',
  './Hand.js',
  './Deck.js',
  './animationStack.js',
  './Timer.js',
  './DiscardPile.js',
  './SlidingText.js'
], function (Player, Hand, Deck, animationStack, Timer, DiscardPile, SlidingText) {
  var gameManager = {};

  gameManager.startGame = function (report, socket) {
    this.socket = socket;
    this.playerSelf = new Player('self', report.startingLife, report.selfName);
    this.playerOpponent = new Player('opponent', report.startingLife, report.opponentName);
    this.discardpile = new DiscardPile();
    this.selfHand = new Hand('self', this.cardPlayed, this.discardpile);
    this.opponentHand = new Hand('opponent');
    this.selfDeck = new Deck('self');
    this.opponentDeck = new Deck('opponent');
    this.timer = new Timer();
    this.toolLeft = $('.toolLeft')
    this.toolRight = $('.toolRight')

    animationStack.addDrawCards(report.hand, this.selfHand, this.opponentHand, this.selfDeck, this.opponentDeck, this.startTurnReady);

    this.toolLeft.hover(function(){
      $(this).stop(true)
      $(this).animate({ 'left' : '-5%'}, 'fast')
    }, function(){
      $(this).stop(true)
      $(this).animate({ 'left' : '-19%'}, 'fast')
    })

    this.toolRight.hover(function(){
      $(this).stop(true)
      $(this).animate({ 'right' : '-5%'}, 'fast')
    }, function(){
      $(this).stop(true)
      $(this).animate({ 'right' : '-19%'}, 'fast')
    })

    $('.giveUpIcon').click(function(){
        gameManager.abandonGame();
    })

    $('.discardPileIcon').click(function(){
      $('#discardPileContainer').fadeIn(120, function(){
        // animate cards
        gameManager.toolLeft.addClass('no-hover')
        gameManager.setDiscardpileView()
      })
    })

    $('#discardPileContainer').click(function(){
      $('#discardPileContainer').fadeOut('fast', function (){
        // reset animation
        gameManager.resetDiscardpileView()
      })
    })


    $('.MenuTheme').trigger('pause');
    $('.FightTheme').trigger('play');
    this.socket.on('newTurn', function (report) {
      gameManager.newTurn(report);
    })

    this.socket.on('startTurn', function (turnTime) {
      $('.startTurn').trigger('play');
      gameManager.startTurn(turnTime);
    })

    this.socket.on('turnTimeOut', function () {
      gameManager.turnTimeOut();
    })

    this.socket.on('opponentPlayed', function (index) {
      gameManager.opponentHand.playCardAt(index, gameManager.noticeOpponentPlayedCard);
    })

    this.socket.on('meteorAnim', function (report) {
      console.log(report);
      gameManager.startMeteorAnim(report);
    })

    this.socket.on('meteorStart', function (duration) {
      gameManager.startMeteor(duration);
    })

    this.socket.on('meteorClick', function () {
      gameManager.opponentMeteorClick();
    })

    this.socket.on('endGame', function (report) {
      gameManager.endGame(report);
    })

    this.socket.on('opponentDisconnected', function () {
      gameManager.opponentDisconnected();
    })

    this.socket.on('opponentForfeited', function () {
      gameManager.opponentForfeited();
    })
  }

  gameManager.resetDiscardpileView = function() {
    this.discardpile.resetView();
  }

  gameManager.setDiscardpileView = function() {
    this.discardpile.setView();
  }

  gameManager.noticeOpponentPlayedCard = function (card) {
    gameManager.opponentPlayedCard = card;
  }

  gameManager.turnTimeOut = function () {
    console.log('time ran out');
    gameManager.selfHand.playRandomCard();
  }

  gameManager.cardFightRequester = function () {
    return {
      left : gameManager.selfPlayedCard,
      right : gameManager.opponentPlayedCard,
      result : gameManager.result,
      damageDone : gameManager.damageDone
    }
  }

  gameManager.revealRequester = function () {
    return gameManager.opponentPlayedCard;
  }

  gameManager.cardPlayed = function (index, card) {
    gameManager.selfPlayedCard = card;
    gameManager.socket.emit('cardPlayed', index)
  }

  gameManager.newTurn = function (report) {
    console.log(report);
    this.timer.stop();

    this.result = report.result;
    this.damageDone = report.damageDone;

    if(report.result == 'winMeteor' || report.result == 'loseMeteor') {
      $('body').off('click');
      animationStack.addMeteorFadeOut();
      if(report.result == 'winMeteor') {
        this.playerOpponent.takeDamage(report.damageDone);
      } else {
        this.playerSelf.takeDamage(report.damageDone);
      }
    }


    if(report.discarded) {
      this.discardOpponentHand(report.opponentDiscard);
      for (var i = 0; i < report.discarded.length; i++)
      {
        this.discardpile.addCardToList(report.discarded[i], 'self')
      }
      for (var i = 0; i < report.opponentDiscard.length; i++)
      {
        this.discardpile.addCardToList(report.opponentDiscard[i], 'opponent')
      }
    }

    if(report.opponentCard) {
      this.discardpile.addCardToList(report.opponentCard, 'opponent')
      animationStack.addRevealCard(gameManager.revealRequester, report.opponentCard.type, report.opponentCard.power);
    }

    if(report.result != 'winMeteor' && report.result != 'loseMeteor') {
      animationStack.addCardFight(this.cardFightRequester);
      animationStack.addPlayerFight(this.playerSelf, this.playerOpponent, this.cardFightRequester);
    }

    if(report.gameResult) {
      this.endGame(report.gameResult);
    } else {
      animationStack.addDrawCards(report.hand, this.selfHand, this.opponentHand, this.selfDeck, this.opponentDeck, this.startTurnReady);
    }
  }


  gameManager.startTurnReady = function () {
    gameManager.socket.emit('turnReady');
  }

  gameManager.startTurn = function (turnTime) {
    gameManager.timer.start(turnTime);
    gameManager.selfHand.enableCardInputs();
    new SlidingText('START TURN');
  }

  gameManager.startMeteorAnim = function (report) {
    this.timer.stop();
    this.result = report.result;

    gameManager.discardOpponentHand(report.discarded);

    animationStack.addRevealCard(gameManager.revealRequester, report.opponentCard.type, report.opponentCard.power);

    animationStack.addCardFight(this.cardFightRequester)

    animationStack.addMeteorFadeIn(function () {
      gameManager.socket.emit('meteorAnimEnded');
    })
  }

  gameManager.opponentMeteorClick = function () {
    this.playerOpponent.meteorSlash();
  }

  gameManager.startMeteor = function (duration) {
    var zis = this;
    this.meteorScore = 0;
    socket = this.socket;
    this.timer.start(duration);
    new SlidingText('START!');
    $('body').on('click', function () {
      zis.meteorScore++;
      zis.playerSelf.meteorSlash();
      socket.emit('meteorClick');
    })
  }

  gameManager.abandonGame = function() {
    this.socket.emit('forfeit')
    gameManager.endGame('loseGame');
  }

  gameManager.opponentDisconnected = function () {
    new SlidingText('Your opponent disconnected');
    setTimeout(function () {
      gameManager.endGame('winGame');
    }, 2000);
  }

  gameManager.opponentForfeited = function () {
    new SlidingText('Your opponent forfeited');
    setTimeout(function () {
      gameManager.endGame('winGame');
    }, 2000);

  }

  gameManager.endGame = function (result) {
    var endScreen;
    if(result == 'winGame') {
      endScreen = $('#winScreen');
    }else {
      endScreen = $('#loseScreen');
    }
    endScreen.show();
    $('body').on('click', function () {
      $('body').off('click');
      gameManager.destroyAll();
      $('#gameContainer').hide();
      endScreen.hide();
      $('#mainMenu').show();
      $('#play').text('Play');

      $('.FightTheme').trigger('pause');
      $('.MenuTheme').trigger('play');
    })

  }

  gameManager.destroyAll = function () {
    this.selfHand.destroy();
    this.opponentHand.destroy();
    this.selfDeck.destroy();
    this.opponentDeck.destroy();
    this.discardpile.destroy();
  }

  gameManager.discardOpponentHand = function (discarded) {
    animationStack.addDiscardHand(discarded, this.opponentHand);
  }



  return gameManager;
})
