import {select} from '../settings.js';

export class AmountWidget {
  constructor(element){
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();

    console.log('AmountWidget: ', thisWidget);
    console.log('element: ', element);
  }
  getElements(element){
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  setValue(value){
    const thisWidget = this;

    const newValue = parseInt(value);

    /* TODO: add validation */

    thisWidget.value = newValue;
    thisWidget.input.value = thisWidget.value;
  }
  initActions(){
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function(){
      this.Widget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
}
