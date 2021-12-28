import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';
import moment from '../../moment';

module('is moment');

test('is moment object', function (assert) {
    var MyObj = function () {},
        extend = function (a, b) {
            var i;
            for (i in b) {
                a[i] = b[i];
            }
            return a;
        };
    MyObj.prototype.toDate = function () {
        return new Date();
    };

    assert.ok(customMoment.isMoment(customMoment()), 'simple moment object');
    assert.ok(customMoment.isMoment(customMoment(null)), 'invalid moment object');
    assert.ok(
        customMoment.isMoment(extend({}, customMoment())),
        'externally cloned moments are moments'
    );
    assert.ok(
        customMoment.isMoment(extend({}, customMoment.utc())),
        'externally cloned utc moments are moments'
    );

    assert.ok(!customMoment.isMoment(new MyObj()), 'myObj is not moment object');
    assert.ok(!customMoment.isMoment(moment), 'moment function is not moment object');
    assert.ok(!customMoment.isMoment(new Date()), 'date object is not moment object');
    assert.ok(!customMoment.isMoment(Object), 'Object is not moment object');
    assert.ok(!customMoment.isMoment('foo'), 'string is not moment object');
    assert.ok(!customMoment.isMoment(1), 'number is not moment object');
    assert.ok(!customMoment.isMoment(NaN), 'NaN is not moment object');
    assert.ok(!customMoment.isMoment(null), 'null is not moment object');
    assert.ok(!customMoment.isMoment(undefined), 'undefined is not moment object');
});

test('is moment with hacked hasOwnProperty', function (assert) {
    var obj = {};
    // HACK to suppress linter warning about bad property name
    obj['hasOwnMoney'.replace('Money', 'Property')] = function () {
        return true;
    };

    assert.ok(
        !customMoment.isMoment(obj),
        'isMoment works even if passed object has a wrong hasOwnProperty implementation (ie8)'
    );
});
