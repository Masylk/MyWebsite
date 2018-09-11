$(init);

const MATCH_FOUND_DELAY = 2000;

function init() {
  require([
    './scripts/NumberPopup.js',
    './scripts/CardDisplay.js',
    './scripts/Hand.js',
    './scripts/animationStack.js',
    './scripts/digits.js',
    './scripts/gameManager.js'
  ], function (NumberPopup, CardDisplay, Hand, animationStack, digits, gameManager) {


    setVolumes();


    function setVolumes () {
      $('.drawSound').prop('volume', 1);
    }

  })

}
