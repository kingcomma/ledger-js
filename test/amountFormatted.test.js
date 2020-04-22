const test = require('tap').test;
const {Transaction, formatParse, formatNumber} = require('../');


test("amount formatting", function(t) {
    let transaction = new Transaction({});

    t.test("pretty amount is undefined if amount is NaN", function(t) {
        t.equal(transaction.amountFormatted, undefined);
        t.end();
    });

    t.test("set format", function(t) {
        let format = '$,.',
            parsed = {
                prefix: '$',
                seperator: ',',
                decimal: '.',
                suffix: ''
            };

        transaction.format = '%^*!';

        t.notEqual(transaction.format, format);

        transaction.format = format;
        t.same(transaction.format, parsed);

        t.end();
    });

    t.test("formatted amount matches passed format", function(t) {
    	transaction.amount = 5.31;
    	transaction.format = '$,.';
    	
    	t.equal(transaction.amountFormatted, '$5.31');
    	t.end();
    });

    t.test("formatted amount includes decimal for integer amounts", function(t) {
    	transaction.amount = 5;
    	transaction.format = '$,.';

    	t.equal(transaction.amountFormatted, '$5.00');
    	t.end();
    });

    t.test("thousands groupings", function(t) {
    	transaction.amount = 5000;
    	transaction.format = '$,.';

    	t.equal(transaction.amountFormatted, '$5,000.00');

    	transaction.amount = 5000000;
    	t.equal(transaction.amountFormatted, '$5,000,000.00');
    	
    	t.end();
    });

    t.test("default formatting is $,.", function(t) {
    	transaction.amount = 5;
    	transaction.format = '';

    	t.equal(transaction.amountFormatted, '$5.00');

    	t.equal(formatNumber(transaction.amount, undefined), '$5.00');

    	t.end();
    });

    t.end();
});
