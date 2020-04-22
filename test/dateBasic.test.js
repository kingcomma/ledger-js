const test = require('tap').test;
const {Transaction} = require('../');

test("transaction date", function(t) {

    let transaction = new Transaction({}),
        sampleDate = new Date('2020/03/15');

    t.test("unspecified date returns as undefined", function(t) {
        t.equal(transaction.date, undefined);
        t.end();
    });

    t.test("date shortcuts return undefined for undefined date", function(t) {
        t.equal(transaction.dayOfWeek, undefined);
        t.equal(transaction.month, undefined);
        t.equal(transaction.year, undefined);
        t.equal(transaction.utc, undefined);
        t.end();
    });

    t.test("month returns 1-index month", function(t) {
        transaction = new Transaction({date: sampleDate});

        t.equal(transaction.month, 3);
        t.end();
    });

    t.test("year returns numeric year", function(t) {
        transaction = new Transaction({date: sampleDate});

        t.equal(transaction.year, 2020);
        t.end();
    });

    t.test("utc", function(t) {
        let now = Date.now();

        transaction = new Transaction({date: now});

        t.equal(transaction.utc, now);
        t.type(transaction.utc, 'number');

        t.end();
    });

    t.test("dayOfWeek returns correct day", function(t) {
        let monday = new Date('2008/09/01'),
            tuesday = new Date('2008/09/02'),
            wednesday = new Date('2008/09/03'),
            thursday = new Date('2008/09/04'),
            friday = new Date('2008/09/05'),
            saturday = new Date('2008/09/06'),
            sunday = new Date('2008/09/07'),
            transaction = new Transaction();

        transaction.date = monday;
        t.equal(transaction.dayOfWeek, 1);

        transaction.date = tuesday;
        t.equal(transaction.dayOfWeek, 2);

        transaction.date = wednesday;
        t.equal(transaction.dayOfWeek, 3);

        t.end();
    });

    t.end();
});