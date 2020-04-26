import {select, settings, classNames, templates } from '../settings.js';
import {utils} from '../utils.js';
import {AmountWidget} from './AmountWidget.js';
import {app} from '../app.js';

export class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.initialData = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    //console.log('new Product: ', thisProduct);
  }
  renderInMenu(){
    const thisProduct = this;

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    //console.log('generatedHTML is: ', generatedHTML);
    /* create element DOM using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    // console.log(thisProduct.element);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    //console.log(menuContainer);
    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }
  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(
      select.menuProduct.clickable
    );
    thisProduct.form = thisProduct.element.querySelector(
      select.menuProduct.form
    );
    thisProduct.formInputs = thisProduct.form.querySelectorAll(
      select.all.formInputs
    );
    thisProduct.cartButton = thisProduct.element.querySelector(
      select.menuProduct.cartButton
    );
    thisProduct.priceElem = thisProduct.element.querySelector(
      select.menuProduct.priceElem
    );
    //console.log(thisProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(
      select.menuProduct.imageWrapper
    );
    //console.log('imageWrapper is: ', thisProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(
      select.menuProduct.amountWidget
    );
    //console.log('amountWidgetElem is: ', thisProduct.amountWidgetElem);
    thisProduct.amountWidgetInput = thisProduct.element.querySelector(
      select.widgets.amount.input
    );
    //console.log('amountWidget is: ', thisProduct.amountWidgetInput);
  }
  initAccordion(){
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    const accordionTrigger = thisProduct.accordionTrigger;
    // console.log('accordionTrigger: ', accordionTrigger);
    /* START: add click event listener to trigger */
    accordionTrigger.addEventListener('click', function (event) {
      /* prevent default action for event */
      event.preventDefault();
      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle(
        classNames.menuProduct.wrapperActive
      );
      /* find all active products */
      const activeProducts = document.querySelectorAll(
        classNames.menuProduct.wrapperActive
      );
      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {
        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct != thisProduct.element) {
          /* remove class active for the active product */
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
          /* END: if the active product isn't the element of thisProduct */
        }
      }
    });
  }
  initOrderForm(){
    const thisProduct = this;
    // console.log('initOrderForm!');

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
      thisProduct.returnToDefault();
    });
  }
  processOrder(){
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData ', formData);
    //console.log('processOrder!');

    /* create object params */
    thisProduct.params = {};
    /* define price */
    let price = thisProduct.data.price;
    // console.log('price is: ', price);
    /* START LOOP: for each paramId in thisProduct.data.params */
    for (let paramId in thisProduct.data.params) {
      // console.log(thisProduct.data.params);
      /* save the element in thisProduct.data.params with key paramId as const param */
      const param = thisProduct.data.params[paramId];
      // console.log('param is: ', param);

      /* START LOOP: for each optionId in param.options */
      for (let optionId in param.options) {
        /* save the element in param.options with key optionId as const option */
        const option = param.options[optionId];
        // console.log('option is: ', option);
        /* START IF: check if option selected isn't default and raise the price */
        const optionSelected =
          formData.hasOwnProperty(paramId) &&
          formData[paramId].indexOf(optionId) > -1;
        // console.log('selected option: ', optionSelected);
        if (optionSelected && !option.default) {
          price += option.price;
          //console.log('price increase to: ', price);
          /* check if default option isn't selected lower the price */
        } else if (!optionSelected && option.default) {
          price -= option.price;
          //console.log('price decrease to: ', price);
        }

        const optionImages = thisProduct.imageWrapper.querySelectorAll(
          '.' + paramId + '-' + optionId
        );
        //console.log('option image is: ', optionImages);
        if (optionSelected){
          if (!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          //console.log(option.label);
          for (let activeImage of optionImages) {
            activeImage.classList.add(classNames.menuProduct.imageVisible);
          }
        } else {
          for (let activeImage of optionImages) {
            activeImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
        /* END LOOP: for each option */
      }
      /* END LOOP: for each param */
    }
    // console.log('thisProduct.params: ', thisProduct.params);
    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
    // console.log('product price is: ', price);
  }
  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated',function(){
      thisProduct.processOrder();
    });
  }
  addToCart(){
    const thisProduct = this;
    // console.log('add to cart!');

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    app.cart.add(thisProduct);
  }
  returnToDefault(){
    const thisProduct = this;

    /* generate HTML based on template
    const generatedHTML = templates.menuProduct(thisProduct.initialData);
    //console.log('generatedHTML is: ', generatedHTML);
    /* create element DOM using utils.createElementFromHTML
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    //console.log(thisProduct.element);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    console.log(menuContainer);
    /* add element to menu
    menuContainer.appendChild(thisProduct.element); */


    thisProduct.amountWidget.value = settings.amountWidget.defaultValue;
    //console.log(thisProduct.amountWidget.value);

    const amountWidget = thisProduct.amountWidgetInput;
    amountWidget.value = settings.amountWidget.defaultValue;

    thisProduct.processOrder();
    //console.log(thisProduct.price);
  }
}
