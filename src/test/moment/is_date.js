import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';

module('is date');

test('isDate recognizes Date objects', function (assert) {
    assert.ok(customMoment.isDate(new Date()), 'no args (now)');
    assert.ok(customMoment.isDate(new Date([2014, 2, 15])), 'array args');
    assert.ok(customMoment.isDate(new Date('2014-03-15')), 'string args');
    assert.ok(
        customMoment.isDate(new Date('does NOT look like a date')),
        'invalid date'
    );
});

test('isDate rejects non-Date objects', function (assert) {
    assert.ok(!customMoment.isDate(), 'nothing');
    assert.ok(!customMoment.isDate(undefined), 'undefined');
    assert.ok(!customMoment.isDate(null), 'string args');
    assert.ok(!customMoment.isDate(42), 'number');
    assert.ok(!customMoment.isDate('2014-03-15'), 'string');
    assert.ok(!customMoment.isDate([2014, 2, 15]), 'array');
    assert.ok(!customMoment.isDate({ year: 2014, month: 2, day: 15 }), 'object');
    assert.ok(
        !customMoment.isDate({
            toString: function () {
                return '[object Date]';
            },
        }),
        'lying object'
    );
});
