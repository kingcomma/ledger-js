const test = require('tap').test;
const {Transaction} = require('../');

test("invalid dates", function(t) {

    t.test("empty string", function(t) {
        t.throws(
            function() {
                new Transaction({date: ''});
            }
        );
        t.end();
    });

    t.test("un-date-like string", function(t) {
        t.throws(
            function() {
                new Transaction({date: 'date'})
            }
        );
        t.end();
    });

    t.end();
});