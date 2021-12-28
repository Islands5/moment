import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';

module('min max');

test('min', function (assert) {
    var now = customMoment(),
        future = now.clone().add(1, 'month'),
        past = now.clone().subtract(1, 'month'),
        invalid = customMoment.invalid();

    assert.equal(customMoment.min(now, future, past), past, 'min(now, future, past)');
    assert.equal(customMoment.min(future, now, past), past, 'min(future, now, past)');
    assert.equal(customMoment.min(future, past, now), past, 'min(future, past, now)');
    assert.equal(customMoment.min(past, future, now), past, 'min(past, future, now)');
    assert.equal(customMoment.min(now, past), past, 'min(now, past)');
    assert.equal(customMoment.min(past, now), past, 'min(past, now)');
    assert.equal(customMoment.min(now), now, 'min(now, past)');

    assert.equal(
        customMoment.min([now, future, past]),
        past,
        'min([now, future, past])'
    );
    assert.equal(customMoment.min([now, past]), past, 'min(now, past)');
    assert.equal(customMoment.min([now]), now, 'min(now)');

    assert.equal(customMoment.min([now, invalid]), invalid, 'min(now, invalid)');
    assert.equal(customMoment.min([invalid, now]), invalid, 'min(invalid, now)');
});

test('max', function (assert) {
    var now = customMoment(),
        future = now.clone().add(1, 'month'),
        past = now.clone().subtract(1, 'month'),
        invalid = customMoment.invalid();

    assert.equal(
        customMoment.max(now, future, past),
        future,
        'max(now, future, past)'
    );
    assert.equal(
        customMoment.max(future, now, past),
        future,
        'max(future, now, past)'
    );
    assert.equal(
        customMoment.max(future, past, now),
        future,
        'max(future, past, now)'
    );
    assert.equal(
        customMoment.max(past, future, now),
        future,
        'max(past, future, now)'
    );
    assert.equal(customMoment.max(now, past), now, 'max(now, past)');
    assert.equal(customMoment.max(past, now), now, 'max(past, now)');
    assert.equal(customMoment.max(now), now, 'max(now, past)');

    assert.equal(
        customMoment.max([now, future, past]),
        future,
        'max([now, future, past])'
    );
    assert.equal(customMoment.max([now, past]), now, 'max(now, past)');
    assert.equal(customMoment.max([now]), now, 'max(now)');

    assert.equal(customMoment.max([now, invalid]), invalid, 'max(now, invalid)');
    assert.equal(customMoment.max([invalid, now]), invalid, 'max(invalid, now)');
});
