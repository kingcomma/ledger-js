import identity from "./identity.js"
import { default as formatMonth } from './formattingDate.js';

class Ledger {

  constructor (transactions) {

    if (transactions instanceof Ledger) {
      transactions = transactions.transactions;
    }
    
    this.populate(transactions);

  }

  populate (transactions) {

    // Populate ledger with only the transactions passed to this method

    if (!Array.isArray(transactions))
      transactions = [transactions];

    this.transactions = transactions.map( t => t instanceof Transaction ? t : new Transaction(t) );
    this.originalTransactions = this.transactions.slice(); // create a safe copy
    this.stashedTransactions = [];

    return this;

  }

  addTransactions (incomingTransactions) {
    if (!Array.isArray(incomingTransactions))
      incomingTransactions = [incomingTransactions];

    incomingTransactions.forEach(t => {
      this.transactions.push(t);
      this.originalTransactions.push(t);
    });

    return this;
  }


  //
  //  Getters
  //  -------
  //

  get categories () {
    // Unique list of categories from transactions array
    return this.unique( 'category' );
  }

  get dates () {
    // Unique list of dates from transactions array
    return this.unique( 'date', ( d => d.toString() ), true );
  }

  get months () {

    // Unique list of months from transactions array

    var normalizeDates = d => {

      // Normalizes a date to be 00:00:00 of the first day
      // of the date's month.

      var d = new Date( d.getFullYear(), d.getMonth() ); // clone to avoid changing attribute
      
      // return timestamp since two instances of `Date`
      // never evaluate as identical
      return d.getTime();
    };

    //return this.unique( 'date', normalizeDates ).map( m => new Date(m) );
    return this.unique( 'date', normalizeDates, true );

  }

  get monthsFormatted () {
    // Unique list of months, formatted to YYYY-MM, from transactions array
    return this.months.map( formatMonth );
  }

  get payees () {
    // Unique list of payees from transactions array
    return this.unique( 'payee' );
  }

  get years () {
    // Unique list of years from transactions array
    return this.unique( 'date', d => d.getFullYear() );
  }

  get count () {
    // Number of transactions in current transactions array
    return this.transactions.length;
  }

  get sum () {
    // Sum of transactions in current transactions array
    var summed = this.transactions.reduce( (s, t) => s + t.amount, 0 );

    return Ledger.formatAmount( summed );
  }

  get sumAbsolute () {
    // Sum of absolute value of transactions in current transactions array
    var summed = this.transactions.reduce( (s, t) => s + Math.abs(t.amount), 0 );

    return Ledger.formatAmount( summed );
  }

  get amounts () {
    // Array of all individual amounts

    return this.transactions.map( t => t.amount );
  }


  //
  //  Static
  //  ------
  //

  static sum ( transactions ) {
    // Calculate sum of arbitrary transactions list
    return Ledger.formatAmount( transactions.reduce( (s, t) => s + t.amount, 0 ) );
  }

  static formatAmount ( amount ) {
    // Sums should always be numbers to two decimals
    return +amount.toFixed(2)
  }

  static formatMonth ( date ) {
    // Format Date to YYYY-MM
    return date.getFullYear()
           + '-'
           + (date.getMonth() < 9 ? '0' : '')
           + (date.getMonth()+1);
  }

  static daysAgo ( count ) {
    return new Date( Date.now() - (1000*60*60*24*count) );
  }

  static dayName ( dayIndex ) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
            'Thursday', 'Friday', 'Saturday'][dayIndex];
  }


  //
  //  Methods
  //  -------
  //

  editEach ( converter ) {

    this.originalTransactions = this.originalTransactions.map( t => converter(t) );

    return this;

  }

  group ( category ) {
    // Return transactions grouped by an attribute with sums
    var grouped = {};

    this.transactions.forEach( t => {
      if ( grouped[t[category]] ) {
        grouped[t[category]] += t.amount;
      } else {
        grouped[t[category]] = t.amount;
      }
    });

    return grouped;

  }

  unique ( attribute, converter, returnValues ) {

    //
    //  Get an array of unique attributes from the current set of transactions
    //
    //  All attributes are added to a Map. The key of each attribute is the
    //  result of the `converter` function or the attribute itself. The value
    //  is always the attribute itself, allowing this method to return either
    //  the converted value or the value depending on the `returnValues` param.
    //
    //  params:
    //    - `attribute` (String): name of transaction attribute
    //    - `converter` (Function): optional processing function for attribute
    //    - `returnValues` (Boolean): if true, values are returned, otherwise
    //      converted values are returned.
    //
    //  returns: array of unique values
    //

    var unique = new Map(),
        converter = converter || identity,
        counter = 0;

    // use .map() so we don't change existing attributes
    this.transactions.forEach( t => {
      return unique.set( converter( t[attribute] ), t[attribute] )
    });

    return Array.from( returnValues ? unique.values() : unique.keys() );

  }

  reset () {

    //  Reset transaction lists to original list
    
    this.transactions = this.originalTransactions;

    return this;

  }

  stash () {

    //  Rember current transactions allowing them to
    //  be "popped" into the transactions list later

    this.stashedTransactions.push( this.transactions );

    return this;

  }

  pop () {

    //  Pop stashed transactions. If no stashed transactions,
    //  keep current transactions.

    this.transactions = this.stashedTransactions.pop() || this.transactions;

    return this;

  }

  sort ( attribute, direction ) {

    //  A convience wrapper around Array.sort(). Returns this
    //  to keep chaining intact.

    var direction = direction === 'desc' ? -1 : 1;

    this.transactions.sort( (t1, t2) => {
      if ( t1[attribute] > t2[attribute] ) return 1 * direction;
      if ( t1[attribute] < t2[attribute] ) return -1 * direction;
      return 0;
    });

    return this;

  }

  sortFunction ( assessor, direction ) {

    //  A convience wrapper around Array.sort(), but allows sorting based
    //  on the result of an assessor function. Returns this to keep chaining
    //  intact.

    var direction = direction === 'desc' ? -1 : 1;

    this.transactions.sort( (t1, t2) => {
      if ( assessor( t1 ) > assessor( t2 ) ) return 1 * direction;
      if ( assessor( t1 ) < assessor( t2 ) ) return -1 * direction;
      return 0;
    });

    return this;

  }

  reverse () {

    // Reverse order of transactions. Convenience, returns
    // this to keep chaining intact.

    this.transactions.reverse();

    return this;
  }

  first ( count ) {

    //  Convenience function for returning first `count` transactions
    this.transactions = this.transactions.slice( 0, count || 1 );

    return this;

  }

  last ( count ) {

    //  Convenience function for returning last `count` transactions
    this.transactions = this.transactions.slice( -1 * (count || 1) );

    return this;
  }

  print () {

    // Convenience  functiono  for p rinting ouot  readablel ist

    let attrs = [...arguments];

    console.log(attrs);

    this.transactions.forEach( t => {
      let print =[];

      attrs.forEach(a => print.push(t[a]));

      console.log(print);

    });

    return this;

  }


  //
  //  Methods: filtering
  //  ------------------
  //

  filter ( test ) {

    // Convenience wrapper around Array.filter that keeps chaining
    // intact by returning `this`.
  
    this.transactions = this.transactions.filter( t => test( t ) );

    this.notify( 'change', { action: 'filter' } );

    return this;

  }

  only ( attribute, values, converter ) {

    var converter = converter || (a => a),
        values = values instanceof Array ? values : [values];

    this.transactions = this.transactions.filter(
      t => values.includes( converter( t[attribute] ) )
    );

    this.notify( 'change', { action: 'only' } );
    
    return this;


  }

  exclude ( attribute, values, converter ) {

    // Function for excluding transactions with attribute not equal to
    // value (the inverse of `this.filter`). Optionally run value through
    // `converter` function before performing compraison

    var converter = converter || (a => a),
        values = values instanceof Array ? values : [values];

    values.forEach( value => {
      this.transactions = this.transactions.filter(
        t => converter( t[attribute] ) !== value
      )
    });

    this.notify( 'change', { action: 'exclude' } );
    
    return this;
  
  }

  include ( attribute, values, converter ) {

    // Function for mergin transactions with attribute equal to value
    // into existing transactions set. Optionally run value trhough
    // `converter` function before performing comparison
    
    var converter = converter || (a => a),
        values = values instanceof Array ? values : [values];
        include = [];

    values.forEach( value => {
      include.concat(
        this.originalTransactions.filter(
          t => converter( t[attribute] ) === value
        )
      );
    });

    include.forEach( t => {
      if ( !this.transactions.includes( t ) ) {
        this.transactions.push( the );
      }
    });

    this.notify( 'change', { action: 'include' } );

    return this;

  }

  before ( date ) {
    //  Set transactions to those older than `date`
    return this.filter( t => t.date < date );
  }

  after ( date ) {
    //  Set transaction to those newer than 'date'
    return this.filter( t => t.date > date );
  }

  greaterThan ( amount ) {
    //  Set transactions to those greater than `amount`
    return this.filter( t => t.amount > amount );
  }

  lessThan ( amount ) {
    //  Set transactions to those less than `amount`
    return this.filter( t => t.amount < amount );
  }

}

export default Ledger