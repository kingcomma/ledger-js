const test = require('tap').test;
const {Transaction} = require('../');

test("basic amount", function(t) {

    t.test("same amount is returned as passed", function(t) {
        let amount = 7.78,
            transaction = new Transaction({amount: amount});

        t.equal(transaction.amount, amount);
        t.end();
    });

    t.test("string amounts parsed correctly", function(t) {
        let amount = "55.22",
            transaction = new Transaction({amount: amount});

        t.equal(transaction.amount, 55.22);
        t.end();
    });

    t.test("amount absolute", function(t) {
        let amount = -1021.12,
            transaction = new Transaction({amount: amount});

        t.equal(transaction.amount, amount);
        t.notEqual(transaction.amountAbsolute, amount);
        t.equal(transaction.amountAbsolute, Math.abs(amount));

        t.end();
    });

    t.test("empty amount string", function(t) {
        t.throws(function() {
            new Transaction({amount:''});
        });

        t.throws(function() {
            new Transaction({amount: '        '});
        });

        t.end();
    });

    t.test("boolean-ish amount value", function(t) {
        t.throws(function() {
            new Transaction({amount: true});
        });
        t.equal((new Transaction({amount: 0})).amount, 0);
        t.end();
    });

    t.test("rounds to two decimal places", function(t) {
        let transaction = new Transaction({amount: 56.125});

        t.equal(transaction.amount, 56.13);

        transaction.amount = 56.124;
        t.equal(transaction.amount, 56.12);

        t.end();
    });

    t.end();
});