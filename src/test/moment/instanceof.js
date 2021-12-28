import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';
import moment from '../../moment';

module('instanceof');

test('instanceof', function (assert) {
    var extend = function (a, b) {
        var i;
        for (i in b) {
            a[i] = b[i];
        }
        return a;
    };

    assert.equal(customMoment() instanceof moment, true, 'simple moment object');
    assert.equal(
        extend({}, customMoment()) instanceof moment,
        false,
        'extended moment object'
    );
    assert.equal(customMoment(null) instanceof moment, true, 'invalid moment object');

    assert.equal(
        new Date() instanceof moment,
        false,
        'date object is not moment object'
    );
    assert.equal(
        Object instanceof moment,
        false,
        'Object is not moment object'
    );
    assert.equal('foo' instanceof moment, false, 'string is not moment object');
    assert.equal(1 instanceof moment, false, 'number is not moment object');
    assert.equal(NaN instanceof moment, false, 'NaN is not moment object');
    assert.equal(null instanceof moment, false, 'null is not moment object');
    assert.equal(
        undefined instanceof moment,
        false,
        'undefined is not moment object'
    );
});
