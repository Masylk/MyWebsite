define([
  "./Display.js"

],function (Display) {

  function Animation(pParam,pParent,pTimeScale,pLoop,pCallBack,pLastframe) {
    this.createAnimation(pParent);
    this.updateCss(pParam);
    this.theAnimation(pParam,pTimeScale,pLoop,pLastframe,pCallBack)

    this.display=Display;
  }

  Animation.prototype.createAnimation= function(pParent) {
    this.container=$('<div class="animation"></div>');
    pParent.append(this.container)
  };

  Animation.prototype.updateCss= function(pParam) {
    var pScaleValue;

    if(pParam.onScale)pScaleValue=-1;
    else pScaleValue=1;

    this.container.css({
      backgroundImage:'url('+pParam.asset+')',
      width:'100%',
      height:'100%',
      transform:'scaleX('+pScaleValue+')'
    })
  };

  Animation.prototype.theAnimation=function (pParam,pTimeScale,pLoop,pLastframe,pCallBack) {
    var frame=0;
    var totalTime=pParam.totalTime*pTimeScale;
    var timeperstep=totalTime/pParam.steps;
    var backgroundX=-(pParam.startWidth);

    var container=this.container;

    container.css({
      backgroundPositionX: backgroundX,
    })

    setInterval(function(){
        if(frame==(pParam.steps-1)) {
          if(pLoop){
            frame=0;
            backgroundX=-(pParam.startWidth);
          }else {

            if(pCallBack !== undefined){
                pCallBack()
                container.remove()
            }else container.remove();
          }
        }

        frame++;
        backgroundX-=(pParam.width+pParam.offsetWidth);

          container.css({
            backgroundPositionX: backgroundX,
          })

    },timeperstep)
  }

  Animation.prototype.destroy=function () {
    this.container.remove();
  }

  return Animation;
})
