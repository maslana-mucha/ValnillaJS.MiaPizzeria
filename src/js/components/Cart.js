import {select, classNames, templates} from '../settings.js';
import { utils } from '../utils.js';

export class Cart {
  constructor(element){
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();

    console.log('new cart: ', thisCart);
  }
  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    // console.log(thisCart.dom.wrapper);
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    // console.log('toggle trigger is: ', thisCart.dom.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
  }
  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
  }
  add(menuProduct){
    const thisCart = this;

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    //console.log('generatedHTML is: ', generatedHTML);
    /* create element DOM using utils.createElementFromHTML */
    thisCart.element = utils.createDOMFromHTML(generatedHTML);
    //console.log(thisCart.element);
    /* add element to cart */
    thisCart.dom.productList.appendChild(thisCart.element);


    console.log('adding product', menuProduct);
  }
}
