import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';

module('leap year');

test('leap year', function (assert) {
    assert.equal(customMoment([2010, 0, 1]).isLeapYear(), false, '2010');
    assert.equal(customMoment([2100, 0, 1]).isLeapYear(), false, '2100');
    assert.equal(customMoment([2008, 0, 1]).isLeapYear(), true, '2008');
    assert.equal(customMoment([2000, 0, 1]).isLeapYear(), true, '2000');
});
