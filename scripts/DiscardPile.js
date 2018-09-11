define([
  './CardDisplay.js',
  './digits.js',
  './DiscardedCard.js'
],
function (CardDisplay, digits, DiscardedCard) {

  function DiscardPile()
  {
      this.discardedCards =
      {
        self :
        {
          low: {},
          middle: {},
          high: {},
          guard: {}
        },
        opponent :
        {
          middle: {},
          low: {},
          high: {},
          guard: {}
        }
      }

      this.globalPos = $('.discardPileIcon').offset()
      this.amount = 0
      this.margin = 40
  }

      DiscardPile.prototype.setView = function ()
      {
          var i = 0
          var index
          var nMargin

          for (var side in this.discardedCards)
          {
            for (var type in this.discardedCards[side])
            {

              var parentPos = $('#' + side).find('.discard' + type + 'Container').offset()

                if (index = Object.keys(this.discardedCards[side][type]).length)
                {
                    for (var power in this.discardedCards[side][type])
                    {

                        var nCard = this.discardedCards[side][type][power].card
                        nMargin = this.margin * i++
                        nCard.container.css({'z-index' : index})
                        nCard.translation(parentPos.left - this.globalPos.left , parentPos.top - this.globalPos.top - nMargin, 120)

                        index--
                    }
                  i = 0
                }

            }
          }
          $('.quantity').fadeIn(1000)
          $('.discardHelpText').fadeIn(1200)
      }

      DiscardPile.prototype.resetView = function ()
      {
        $('.discardedCard').animate({top: 0, left: 0}, 'fast')
        $('.quantity').fadeOut(12)
        $('.discardHelpText').fadeOut(100)
      }

      DiscardPile.prototype.addCardToList = function(card, side)
      {
        var powerIndex = {}
        var digitImage
        var quantityDiv = $('<div class="quantity"></div>')
        var parent = '.discardPileIcon'


        if (!this.discardedCards[side][card.type]['' + card.power])
        {
          powerIndex.quantity = 1
          digitImage =  digits.getImage(powerIndex.quantity, side === 'self' ? 'blue' : 'red')
          powerIndex.card = new CardDisplay(card.type, card.power, false, parent)

          this.discardedCards[side][card.type]['' + card.power] = powerIndex
          $(this.discardedCards[side][card.type]['' + card.power].card.container).addClass('discardedCard')
          $(this.discardedCards[side][card.type]['' + card.power].card.container).append(quantityDiv)
          $(this.discardedCards[side][card.type]['' + card.power].card.container).find(quantityDiv).append('<div>Amount : </div>')
          $(quantityDiv).append(digitImage)
        }
        else {
          var newImage
          var newAmount = ++this.discardedCards[side][card.type]['' + card.power].quantity
          digitImage = digits.getImage(newAmount, side === 'self' ? 'blue' : 'red')
          newImage = $(digitImage).attr('src')

          $(this.discardedCards[side][card.type]['' + card.power].card.container).find('.quantity').find('img').attr('src', newImage)

        }
        this.amount++
      }

      DiscardPile.prototype.destroy = function () {

      }

  return DiscardPile
})
