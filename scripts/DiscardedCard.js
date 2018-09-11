define([


],function(){

  function DiscardedCard(type, power)
  {
    this.name = type
    this.power = power
    this.template=$('#cardTemplate');
    this.container=$(this.template.html());
  }

  return DiscardedCard
})
