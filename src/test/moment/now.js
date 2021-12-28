import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';

module('now');

test('now', function (assert) {
    var startOfTest = new Date().valueOf(),
        momentNowTime = customMoment.now(),
        afterMomentCreationTime = new Date().valueOf();

    assert.ok(
        startOfTest <= momentNowTime,
        'moment now() time should be now, not in the past'
    );
    assert.ok(
        momentNowTime <= afterMomentCreationTime,
        'moment now() time should be now, not in the future'
    );
});

test('now - Date mocked', function (assert) {
    var RealDate = Date,
        customTimeMs = customMoment('2015-01-01T01:30:00.000Z').valueOf();

    function MockDate() {
        return new RealDate(customTimeMs);
    }

    MockDate.now = function () {
        return new MockDate().valueOf();
    };

    MockDate.prototype = RealDate.prototype;

    // eslint-disable-next-line
    Date = MockDate;

    try {
        assert.equal(
            customMoment().valueOf(),
            customTimeMs,
            'moment now() time should use the global Date object'
        );
    } finally {
        // eslint-disable-next-line
        Date = RealDate;
    }
});

test('now - custom value', function (assert) {
    var customTimeStr = '2015-01-01T01:30:00.000Z',
        customTime = customMoment(customTimeStr, customMoment.ISO_8601).valueOf(),
        oldFn = customMoment.now;

    customMoment.now = function () {
        return customTime;
    };

    try {
        assert.equal(
            customMoment().toISOString(),
            customTimeStr,
            'customMoment() constructor should use the function defined by customMoment.now, but it did not'
        );
        assert.equal(
            customMoment.utc().toISOString(),
            customTimeStr,
            'customMoment() constructor should use the function defined by customMoment.now, but it did not'
        );
    } finally {
        customMoment.now = oldFn;
    }
});

test('empty object, empty array', function (assert) {
    function assertIsNow(gen, msg) {
        var before = +new Date(),
            mid = gen(),
            after = +new Date();
        assert.ok(before <= +mid && +mid <= after, 'should be now : ' + msg);
    }
    assertIsNow(function () {
        return customMoment();
    }, 'customMoment()');
    assertIsNow(function () {
        return customMoment([]);
    }, 'customMoment([])');
    assertIsNow(function () {
        return customMoment({});
    }, 'customMoment({})');
    assertIsNow(function () {
        return customMoment.utc();
    }, 'customMoment.utc()');
    assertIsNow(function () {
        return customMoment.utc([]);
    }, 'customMoment.utc([])');
    assertIsNow(function () {
        return customMoment.utc({});
    }, 'customMoment.utc({})');
});
