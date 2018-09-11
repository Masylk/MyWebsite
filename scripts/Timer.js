define([

], function () {

  const CONTAINER_ID = '#timer';
  const CANVAS_ID = '#timerCircle';
  const TEXTFIELD_ID = '#timerNumber';

  const THICKNESS = 15;
  const INTERVAL_TIME = 20;

  function Timer() {
    this.getContainers();
  }

  Timer.prototype.getContainers = function () {
    this.container = $(CONTAINER_ID);
    this.canvas = $(CANVAS_ID);
    this.textField = $(TEXTFIELD_ID);
    this.canvas.get(0).width = this.container.width();
    this.canvas.get(0).height = this.container.height();
    this.context = this.canvas.get(0).getContext('2d')
    this.context.lineWidth = THICKNESS;
  }

  Timer.prototype.start = function (time) {
    this.stop();
    this.maxTime = time;
    this.currentTime = time;
    
    var zis = this;
    this.interval = setInterval(function () {
      zis.decreaseTime();
    }, INTERVAL_TIME)
  }

  Timer.prototype.stop = function () {
    clearInterval(this.interval);
    this.clean();
  }

  Timer.prototype.decreaseTime = function () {
    this.currentTime -= INTERVAL_TIME;
    this.updateCanvas(this.currentTime / this.maxTime);
    this.updateNumbers(Math.ceil(this.currentTime / 1000));
    if(this.currentTime <= 0) {
      this.stop();
    }
  }

  Timer.prototype.clean = function () {
    var canvas = this.canvas.get(0);
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.textField.text('');
  }

  Timer.prototype.updateNumbers = function (integer) {
    this.textField.text(integer);
  }

  Timer.prototype.updateCanvas = function (percent) {
    var canvas = this.canvas.get(0);
    var ctx = this.context;
    var width = canvas.width
    var height = canvas.height
    var radius = width < height ? width / 2 : height / 2;
    var red = Math.floor(255 * (1 - percent));
    var green = Math.floor(255 * percent);
    this.context.strokeStyle = 'rgb(' + red + ', ' + green + ', 0)';


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, radius - THICKNESS / 2, -(Math.PI / 2), percent * Math.PI * 2 - (Math.PI / 2));
    ctx.stroke();
  }

  return Timer;
})
