import {templates, select} from '../settings.js';
import { AmountWidget } from './AmountWidget.js';

export class Booking {
  constructor(bookingContainer){
    const thisBooking = this;

    thisBooking.render(bookingContainer);
    thisBooking.initWidgets();
    //console.log('Booking!');
  }
  render(bookingContainer){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    //console.log('generatedHTML is: ', generatedHTML);
    thisBooking.dom = {};

    thisBooking.dom.wrapper = bookingContainer;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
  }
  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}
