const test = require('tap').test;
const {Transaction, formatMonth} = require('../');

test("transaction date formatting", function(t) {

    let sampleDate = new Date('2020/03/15'),
        transaction = new Transaction({date: sampleDate});
        

    t.test("formatted month is correct year and month", function(t) {
        t.equal(transaction.monthFormatted, '2020-03');
        t.end();
    });

    t.test("formatted month is correct length", function(t) {
    	t.equal(transaction.monthFormatted.length, 7);

    	transaction.date = new Date('2019-01');
    	t.equal(transaction.monthFormatted.length, 7);

    	transaction.date = new Date('2019-12-05');
    	t.equal(transaction.monthFormatted.length, 7);

    	transaction.date = '410-08-24';
    	t.equal(transaction.monthFormatted.length, 7);
        t.equal(transaction.monthFormatted, '0410-08');

        transaction.date = transaction.date.setFullYear(-410);
        t.equal(transaction.monthFormatted.length, 8);
        t.equal(transaction.monthFormatted, '-0410-08');

    	t.end();
    })

    t.end();
});