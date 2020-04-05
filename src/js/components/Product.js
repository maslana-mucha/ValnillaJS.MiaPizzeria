import {select, classNames, templates } from '../settings.js';
import {utils} from '../utils.js';
import {AmountWidget} from './AmountWidget.js';

export class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    // console.log('new Product: ', thisProduct);
  }
  renderInMenu() {
    const thisProduct = this;

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    // console.log('generatedHTML is: ', generatedHTML);
    /* create element DOM using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    // console.log(thisProduct.element);
    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }
  getElements() {
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
    thisProduct.imageWrapper = thisProduct.element.querySelector(
      select.menuProduct.imageWrapper
    );
    thisProduct.AmountWidgetElem = thisProduct.element.querySelector(
      select.menuProduct.amountWidget
    );
  }
  initAccordion() {
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
  initOrderForm() {
    const thisProduct = this;
    // console.log('initOrderForm!');

    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });
  }
  processOrder() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.form);
    // console.log('formData ', formData);
    // console.log('processOrder!');

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
        if (optionSelected) {
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
    /* add price to the priceWrapper */
    thisProduct.priceElem.innerHTML = price;
    console.log('product price is: ', price);
  }
  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
  }
}

export default Product;
