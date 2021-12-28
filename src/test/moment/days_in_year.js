import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';

module('days in year');

// https://github.com/custom_moment/custom_moment/issues/3717
test('YYYYDDD should not parse DDD=000', function (assert) {
    assert.equal(customMoment(7000000, customMoment.ISO_8601, true).isValid(), false);
    assert.equal(customMoment('7000000', customMoment.ISO_8601, true).isValid(), false);
    assert.equal(customMoment(7000000, customMoment.ISO_8601, false).isValid(), false);
});
