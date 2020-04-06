import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
//import {AmountWidget} from './components/AmountWidget.js';
import {dataSource} from './data.js';
import {select} from './settings.js';

export const app = {
  initMenu(){
    const thisApp = this;
    //console.log('thisApp.data: ', thisApp.data);

    for(let productData in thisApp.data.products){
      new Product(productData, thisApp.data.products[productData]);
    }
  },
  initData(){
    const thisApp = this;

    thisApp.data = dataSource;
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
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initData();
    thisApp.initMenu();
    thisApp.initCart();
  },
};

app.init();
