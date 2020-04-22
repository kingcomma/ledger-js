const test = require('tap').test;
const {Transaction} = require('../');

test("basic transaction creation", function(t) {

    t.test("idempotence", function(t) {
        let t0 = new Transaction({amount: 5, date: Date.now() }),
            t1 = new Transaction(t0);

        t.equal(t0.attributes, t1.attributes);

        t.end();
    });

    t.test("no model", function(t) {
        t.true((new Transaction()) instanceof Transaction);
        t.end();
    });

    t.end();
});