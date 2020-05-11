/* global flatpickr */

import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';
import {select, settings} from '../settings.js';

export class DatePicker extends BaseWidget {
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    //console.log(thisWidget.dom.input);
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    //console.log(thisWidget.minDate);
    thisWidget.maxDate = utils.addDays(
      thisWidget.minDate,
      settings.datePicker.maxDaysInFuture
    );
    //console.log(thisWidget.maxDate);


    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      /*
      disable: [
        function (date) {
          // return true to disable
          return date.getDay() === 1;
        },
      ],
      */
      locale: {
        firstDayOfWeek: 1, // start week on Monday
      },
      onChange: function (dateStr) {
        thisWidget.value = dateStr;
      },
    });
  }
  parseValue(newValue){
    return newValue;
  }
  isValid(){
    return true;
  }
}
