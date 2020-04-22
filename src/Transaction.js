import { default as formatNumber, formatParse } from './formatting.js';
import { default as formatMonth } from './formattingDate.js';

class Transaction {

  constructor (model) {

    if (model instanceof Transaction) {
      this.attributes = model.attributes;
    } else {
      this.attributes = model || new Map();
    }

    // set attributes
    Object.keys( this.attributes ).forEach( key => {
      this[key] = model[key];
    });

  }

  //
  //  Operable Attributes
  //  -------------------
  //

  set date ( date ) {
    if (date instanceof Date)
      return this.attributes.date = date;

    if (typeof date === 'string' ) {
      if (date.trim() === '') {
        throw new Error('Dates passed as strings must not be empty.');
      }
      else if (isNaN(Date.parse(date))) {
        throw new Error('Could not convert date into a valid Date object.');
      }
    }

    // Can normalize time to 0s if passed as YYYY/MM/DD
    return this.attributes.date = new Date(date);
  }

  get dayOfWeek () {
    return this.date === undefined ? undefined : this.date.getDay();
  }

  get date () {
    return this.attributes.date;
  }

  get utc () {
    return this.date === undefined ? undefined : this.date.getTime();
  }

  get month () {
    return this.date === undefined ? undefined : this.date.getMonth() + 1;
  }

  get monthFormatted () {
    return formatMonth(this.date);
  }

  get year () {
    return this.date === undefined ? undefined : this.date.getFullYear();
  }

  //

  set amount ( amount ) {
    if (typeof amount === 'string' && amount.trim() === '') {
      throw new Error('Amount passed as strings must be non-empty and number-like.');
    }
    else if (isNaN(amount) || typeof amount === 'boolean') {
      throw new Error('Amount must be number-like.')
    }

    return this.attributes.amount = Transaction.parseAmount(amount);
  }

  get amount () {
    return this.attributes.amount;
  }

  get amountAbsolute () {
    return Math.abs(this.amount);
  }

  get amountFormatted () {
    if (this.amount === undefined)
      return;

    return formatNumber(this.attributes.amount, this.attributes.format);
  }

  //

  set format (format) {
    this.attributes.format = formatParse(format);
  }

  get format () {
    return this.attributes.format;
  }


  //
  //  Static Methods
  //  --------------
  //

  static parseAmount ( amount ) {
    return +Number(amount).toFixed(2);
  }

}

export default Transaction