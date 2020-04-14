import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
//import {AmountWidget} from './components/AmountWidget.js';
// import {setting} from './data.js';
import {select, settings} from './settings.js';

export const app = {
  initMenu(){
    const thisApp = this;
    console.log('thisApp.data: ', thisApp.data);

    for(let productData in thisApp.data.products){
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },
  initData(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
  },
  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);

    thisApp.initData();
    //thisApp.initMenu(); //deleting according to AJAX impl
    thisApp.initCart();
  },
};

app.init();
