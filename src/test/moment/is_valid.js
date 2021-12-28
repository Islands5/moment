import { module, test } from '../qunit';
import each from '../helpers/each';
import {customMoment} from '../../custom_moment';

module('is valid');

test('array bad month', function (assert) {
    assert.equal(customMoment([2010, -1]).isValid(), false, 'month -1 invalid');
    assert.equal(customMoment([2100, 12]).isValid(), false, 'month 12 invalid');
});

test('array good month', function (assert) {
    for (var i = 0; i < 12; i++) {
        assert.equal(customMoment([2010, i]).isValid(), true, 'month ' + i);
        assert.equal(customMoment.utc([2010, i]).isValid(), true, 'month ' + i);
    }
});

test('Feb 29 0000 is valid', function (assert) {
    // https://github.com/custom_moment/custom_moment/issues/3358
    assert.ok(
        customMoment({ year: 0, month: 1, date: 29 }).isValid(),
        'Feb 29 0000 must be valid'
    );
    assert.ok(
        customMoment({ year: 0, month: 1, date: 28 }).add(1, 'd').isValid(),
        'Feb 28 0000 + 1 day must be valid'
    );
});

test('array bad date', function (assert) {
    var tests = [
        customMoment([2010, 0, 0]),
        customMoment([2100, 0, 32]),
        customMoment.utc([2010, 0, 0]),
        customMoment.utc([2100, 0, 32]),
    ];

    each(tests, function (m) {
        assert.equal(m.isValid(), false);
    });
});

test('h/hh with hour > 12', function (assert) {
    assert.ok(
        customMoment('06/20/2014 11:51 PM', 'MM/DD/YYYY hh:mm A', true).isValid(),
        '11 for hh'
    );
    assert.ok(
        customMoment('06/20/2014 11:51 AM', 'MM/DD/YYYY hh:mm A', true).isValid(),
        '11 for hh'
    );
    assert.ok(
        customMoment('06/20/2014 23:51 PM', 'MM/DD/YYYY hh:mm A').isValid(),
        'non-strict validity 23 for hh'
    );
    assert.ok(
        customMoment('06/20/2014 23:51 PM', 'MM/DD/YYYY hh:mm A').parsingFlags()
            .bigHour,
        'non-strict bigHour 23 for hh'
    );
    assert.ok(
        !customMoment('06/20/2014 23:51 PM', 'MM/DD/YYYY hh:mm A', true).isValid(),
        'validity 23 for hh'
    );
    assert.ok(
        customMoment('06/20/2014 23:51 PM', 'MM/DD/YYYY hh:mm A', true).parsingFlags()
            .bigHour,
        'bigHour 23 for hh'
    );
});

test('array bad date leap year', function (assert) {
    assert.equal(customMoment([2010, 1, 29]).isValid(), false, '2010 feb 29');
    assert.equal(customMoment([2100, 1, 29]).isValid(), false, '2100 feb 29');
    assert.equal(customMoment([2008, 1, 30]).isValid(), false, '2008 feb 30');
    assert.equal(customMoment([2000, 1, 30]).isValid(), false, '2000 feb 30');

    assert.equal(customMoment.utc([2010, 1, 29]).isValid(), false, 'utc 2010 feb 29');
    assert.equal(customMoment.utc([2100, 1, 29]).isValid(), false, 'utc 2100 feb 29');
    assert.equal(customMoment.utc([2008, 1, 30]).isValid(), false, 'utc 2008 feb 30');
    assert.equal(customMoment.utc([2000, 1, 30]).isValid(), false, 'utc 2000 feb 30');
});

test('string + formats bad date', function (assert) {
    assert.equal(
        customMoment('2020-00-00', []).isValid(),
        false,
        'invalid on empty array'
    );
    assert.equal(
        customMoment('2020-00-00', ['YYYY-MM-DD', 'DD-MM-YYYY']).isValid(),
        false,
        'invalid on all in array'
    );
    assert.equal(
        customMoment('2020-00-00', ['DD-MM-YYYY', 'YYYY-MM-DD']).isValid(),
        false,
        'invalid on all in array'
    );
    assert.equal(
        customMoment('2020-01-01', ['YYYY-MM-DD', 'DD-MM-YYYY']).isValid(),
        true,
        'valid on first'
    );
    assert.equal(
        customMoment('2020-01-01', ['DD-MM-YYYY', 'YYYY-MM-DD']).isValid(),
        true,
        'valid on last'
    );
    assert.equal(
        customMoment('2020-01-01', ['YYYY-MM-DD', 'YYYY-DD-MM']).isValid(),
        true,
        'valid on both'
    );
    assert.equal(
        customMoment('2020-13-01', ['YYYY-MM-DD', 'YYYY-DD-MM']).isValid(),
        true,
        'valid on last'
    );

    assert.equal(
        customMoment('12-13-2012', ['DD-MM-YYYY', 'YYYY-MM-DD']).isValid(),
        false,
        'month rollover'
    );
    assert.equal(
        customMoment('12-13-2012', ['DD-MM-YYYY', 'DD-MM-YYYY']).isValid(),
        false,
        'month rollover'
    );
    assert.equal(
        customMoment('38-12-2012', ['DD-MM-YYYY']).isValid(),
        false,
        'day rollover'
    );
});

test('string nonsensical with format', function (assert) {
    assert.equal(
        customMoment('fail', 'MM-DD-YYYY').isValid(),
        false,
        "string 'fail' with format 'MM-DD-YYYY'"
    );
    assert.equal(
        customMoment('xx-xx-2001', 'DD-MM-YYY').isValid(),
        true,
        "string 'xx-xx-2001' with format 'MM-DD-YYYY'"
    );
});

test('string with bad month name', function (assert) {
    assert.equal(
        customMoment('01-Nam-2012', 'DD-MMM-YYYY').isValid(),
        false,
        "'Nam' is an invalid month"
    );
    assert.equal(
        customMoment('01-Aug-2012', 'DD-MMM-YYYY').isValid(),
        true,
        "'Aug' is a valid month"
    );
});

test('string with spaceless format', function (assert) {
    assert.equal(
        customMoment('10Sep2001', 'DDMMMYYYY').isValid(),
        true,
        'Parsing 10Sep2001 should result in a valid date'
    );
});

test('invalid string iso 8601', function (assert) {
    var tests = [
            '2010-00-00',
            '2010-01-00',
            '2010-01-40',
            '2010-01-01T24:01', // 24:00:00 is actually valid
            '2010-01-01T23:60',
            '2010-01-01T23:59:60',
        ],
        i;

    for (i = 0; i < tests.length; i++) {
        assert.equal(
            customMoment(tests[i], customMoment.ISO_8601).isValid(),
            false,
            tests[i] + ' should be invalid'
        );
        assert.equal(
            customMoment.utc(tests[i], customMoment.ISO_8601).isValid(),
            false,
            tests[i] + ' should be invalid'
        );
    }
});

test('invalid string iso 8601 + timezone', function (assert) {
    var tests = [
            '2010-00-00T+00:00',
            '2010-01-00T+00:00',
            '2010-01-40T+00:00',
            '2010-01-40T24:01+00:00',
            '2010-01-40T23:60+00:00',
            '2010-01-40T23:59:60+00:00',
            '2010-01-40T23:59:59.9999+00:00',
            '2010-01-40T23:59:59,9999+00:00',
        ],
        i;

    for (i = 0; i < tests.length; i++) {
        assert.equal(
            customMoment(tests[i], customMoment.ISO_8601).isValid(),
            false,
            tests[i] + ' should be invalid'
        );
        assert.equal(
            customMoment.utc(tests[i], customMoment.ISO_8601).isValid(),
            false,
            tests[i] + ' should be invalid'
        );
    }
});

test('valid string iso 8601 - not strict', function (assert) {
    var tests = [
            '2010-01-30 00:00:00,000Z',
            '20100101',
            '20100130',
            '20100130T23+00:00',
            '20100130T2359+0000',
            '20100130T235959+0000',
            '20100130T235959,999+0000',
            '20100130T235959,999-0700',
            '20100130T000000,000+0700',
            '20100130 000000,000Z',
        ],
        i;

    for (i = 0; i < tests.length; i++) {
        assert.equal(
            customMoment(tests[i]).isValid(),
            true,
            tests[i] + ' should be valid in normal'
        );
        assert.equal(
            customMoment.utc(tests[i]).isValid(),
            true,
            tests[i] + ' should be valid in normal'
        );
    }
});

test('valid string iso 8601 + timezone', function (assert) {
    var tests = [
            '2010-01-01',
            '2010-01-30',
            '2010-01-30T23+00:00',
            '2010-01-30T23:59+00:00',
            '2010-01-30T23:59:59+00:00',
            '2010-01-30T23:59:59.999+00:00',
            '2010-01-30T23:59:59.999-07:00',
            '2010-01-30T00:00:00.000+07:00',
            '2010-01-30T23:59:59.999-07',
            '2010-01-30T00:00:00.000+07',
            '2010-01-30 00:00:00.000Z',
        ],
        i;

    for (i = 0; i < tests.length; i++) {
        assert.equal(
            customMoment(tests[i]).isValid(),
            true,
            tests[i] + ' should be valid in normal'
        );
        assert.equal(
            customMoment.utc(tests[i]).isValid(),
            true,
            tests[i] + ' should be valid in normal'
        );
        assert.equal(
            customMoment(tests[i], customMoment.ISO_8601, true).isValid(),
            true,
            tests[i] + ' should be valid in strict'
        );
        assert.equal(
            customMoment.utc(tests[i], customMoment.ISO_8601, true).isValid(),
            true,
            tests[i] + ' should be valid in strict'
        );
    }
});

test('invalidAt', function (assert) {
    assert.equal(
        customMoment([2000, 12]).invalidAt(),
        1,
        'month 12 is invalid: 0-11'
    );
    assert.equal(
        customMoment([2000, 1, 30]).invalidAt(),
        2,
        '30 is not a valid february day'
    );
    assert.equal(
        customMoment([2000, 1, 29, 25]).invalidAt(),
        3,
        '25 is invalid hour'
    );
    assert.equal(
        customMoment([2000, 1, 29, 24, 1]).invalidAt(),
        3,
        '24:01 is invalid hour'
    );
    assert.equal(
        customMoment([2000, 1, 29, 23, 60]).invalidAt(),
        4,
        '60 is invalid minute'
    );
    assert.equal(
        customMoment([2000, 1, 29, 23, 59, 60]).invalidAt(),
        5,
        '60 is invalid second'
    );
    assert.equal(
        customMoment([2000, 1, 29, 23, 59, 59, 1000]).invalidAt(),
        6,
        '1000 is invalid millisecond'
    );
    assert.equal(
        customMoment([2000, 1, 29, 23, 59, 59, 999]).invalidAt(),
        -1,
        '-1 if everything is fine'
    );
});

test('valid Unix timestamp', function (assert) {
    assert.equal(customMoment(1371065286, 'X').isValid(), true, 'number integer');
    assert.equal(customMoment(1379066897.0, 'X').isValid(), true, 'number whole 1dp');
    assert.equal(customMoment(1379066897.7, 'X').isValid(), true, 'number 1dp');
    assert.equal(customMoment(1379066897.0, 'X').isValid(), true, 'number whole 2dp');
    assert.equal(customMoment(1379066897.07, 'X').isValid(), true, 'number 2dp');
    assert.equal(customMoment(1379066897.17, 'X').isValid(), true, 'number 2dp');
    assert.equal(customMoment(1379066897.0, 'X').isValid(), true, 'number whole 3dp');
    assert.equal(customMoment(1379066897.007, 'X').isValid(), true, 'number 3dp');
    assert.equal(customMoment(1379066897.017, 'X').isValid(), true, 'number 3dp');
    assert.equal(customMoment(1379066897.157, 'X').isValid(), true, 'number 3dp');
    assert.equal(customMoment('1371065286', 'X').isValid(), true, 'string integer');
    assert.equal(
        customMoment('1379066897.', 'X').isValid(),
        true,
        'string trailing .'
    );
    assert.equal(
        customMoment('1379066897.0', 'X').isValid(),
        true,
        'string whole 1dp'
    );
    assert.equal(customMoment('1379066897.7', 'X').isValid(), true, 'string 1dp');
    assert.equal(
        customMoment('1379066897.00', 'X').isValid(),
        true,
        'string whole 2dp'
    );
    assert.equal(customMoment('1379066897.07', 'X').isValid(), true, 'string 2dp');
    assert.equal(customMoment('1379066897.17', 'X').isValid(), true, 'string 2dp');
    assert.equal(
        customMoment('1379066897.000', 'X').isValid(),
        true,
        'string whole 3dp'
    );
    assert.equal(customMoment('1379066897.007', 'X').isValid(), true, 'string 3dp');
    assert.equal(customMoment('1379066897.017', 'X').isValid(), true, 'string 3dp');
    assert.equal(customMoment('1379066897.157', 'X').isValid(), true, 'string 3dp');
});

test('invalid Unix timestamp', function (assert) {
    assert.equal(customMoment(undefined, 'X').isValid(), false, 'undefined');
    assert.equal(customMoment('undefined', 'X').isValid(), false, 'string undefined');
    try {
        assert.equal(customMoment(null, 'X').isValid(), false, 'null');
    } catch (e) {
        assert.ok(true, 'null');
    }

    assert.equal(customMoment('null', 'X').isValid(), false, 'string null');
    assert.equal(customMoment([], 'X').isValid(), false, 'array');
    assert.equal(customMoment('{}', 'X').isValid(), false, 'object');
    try {
        assert.equal(customMoment('', 'X').isValid(), false, 'string empty');
    } catch (e) {
        assert.ok(true, 'string empty');
    }

    assert.equal(customMoment(' ', 'X').isValid(), false, 'string space');
});

test('valid Unix offset milliseconds', function (assert) {
    assert.equal(customMoment(1234567890123, 'x').isValid(), true, 'number integer');
    assert.equal(
        customMoment('1234567890123', 'x').isValid(),
        true,
        'string integer'
    );
});

test('invalid Unix offset milliseconds', function (assert) {
    assert.equal(customMoment(undefined, 'x').isValid(), false, 'undefined');
    assert.equal(customMoment('undefined', 'x').isValid(), false, 'string undefined');
    try {
        assert.equal(customMoment(null, 'x').isValid(), false, 'null');
    } catch (e) {
        assert.ok(true, 'null');
    }

    assert.equal(customMoment('null', 'x').isValid(), false, 'string null');
    assert.equal(customMoment([], 'x').isValid(), false, 'array');
    assert.equal(customMoment('{}', 'x').isValid(), false, 'object');
    try {
        assert.equal(customMoment('', 'x').isValid(), false, 'string empty');
    } catch (e) {
        assert.ok(true, 'string empty');
    }

    assert.equal(customMoment(' ', 'x').isValid(), false, 'string space');
});

test('empty', function (assert) {
    assert.equal(customMoment(null).isValid(), false, 'null');
    assert.equal(customMoment('').isValid(), false, 'empty string');
    assert.equal(customMoment(null, 'YYYY').isValid(), false, 'format + null');
    assert.equal(customMoment('', 'YYYY').isValid(), false, 'format + empty string');
    assert.equal(
        customMoment(' ', 'YYYY').isValid(),
        false,
        'format + empty when trimmed'
    );
});

test('days of the year', function (assert) {
    assert.equal(
        customMoment('2010 300', 'YYYY DDDD').isValid(),
        true,
        'day 300 of year valid'
    );
    assert.equal(
        customMoment('2010 365', 'YYYY DDDD').isValid(),
        true,
        'day 365 of year valid'
    );
    assert.equal(
        customMoment('2010 366', 'YYYY DDDD').isValid(),
        false,
        'day 366 of year invalid'
    );
    assert.equal(
        customMoment('2012 365', 'YYYY DDDD').isValid(),
        true,
        'day 365 of leap year valid'
    );
    assert.equal(
        customMoment('2012 366', 'YYYY DDDD').isValid(),
        true,
        'day 366 of leap year valid'
    );
    assert.equal(
        customMoment('2012 367', 'YYYY DDDD').isValid(),
        false,
        'day 367 of leap year invalid'
    );
});

test('24:00:00.000 is valid', function (assert) {
    assert.equal(
        customMoment('2014-01-01 24', 'YYYY-MM-DD HH').isValid(),
        true,
        '24 is valid'
    );
    assert.equal(
        customMoment('2014-01-01 24:00', 'YYYY-MM-DD HH:mm').isValid(),
        true,
        '24:00 is valid'
    );
    assert.equal(
        customMoment('2014-01-01 24:01', 'YYYY-MM-DD HH:mm').isValid(),
        false,
        '24:01 is not valid'
    );
});

test('oddball permissiveness', function (assert) {
    // https://github.com/custom_moment/custom_moment/issues/1128
    assert.ok(
        customMoment('2010-10-3199', [
            'MM/DD/YYYY',
            'MM-DD-YYYY',
            'YYYY-MM-DD',
        ]).isValid()
    );

    // https://github.com/custom_moment/custom_moment/issues/1122
    assert.ok(customMoment('3:25', ['h:mma', 'hh:mma', 'H:mm', 'HH:mm']).isValid());
});

test('0 hour is invalid in strict', function (assert) {
    assert.equal(
        customMoment('00:01', 'hh:mm', true).isValid(),
        false,
        '00 hour is invalid in strict'
    );
    assert.equal(
        customMoment('00:01', 'hh:mm').isValid(),
        true,
        '00 hour is valid in normal'
    );
    assert.equal(
        customMoment('0:01', 'h:mm', true).isValid(),
        false,
        '0 hour is invalid in strict'
    );
    assert.equal(
        customMoment('0:01', 'h:mm').isValid(),
        true,
        '0 hour is valid in normal'
    );
});

test('format locale', function (assert) {
    var a = [
            ['uto 15.05.2018', 'dd DD.MM.YYYY', 'bs'],
            ['dt 15.05.2018', 'dd DD.MM.YYYY', 'ca'],
            ['Di 15.05.2018', 'dd DD.MM.YYYY', 'de-dt'],
            ['Di 15.05.2018', 'dd DD.MM.YYYY', 'de'],
            ['mar 15.05.2018', 'dd DD.MM.YYYY', 'es-do'],
            ['mar 15.05.2018', 'dd DD.MM.YYYY', 'es-us'],
            ['Di 15.05.2018', 'dd DD.MM.YYYY', 'es'],
            ['ar 15.05.2018', 'dd DD.MM.YYYY', 'eu'],
            ['mar 15.05.2018', 'dd DD.MM.YYYY', 'fr-ca'],
            ['mar 15.05.2018', 'dd DD.MM.YYYY', 'fr-ch'],
            ['mar 15.05.2018', 'dd DD.MM.YYYY', 'fr'],
            ['ti 15.05.2018', 'dd DD.MM.YYYY', 'fy'],
            ['mar 15.05.2018', 'dd DD.MM.YYYY', 'gl'],
            ['मंगळ 15.05.2018', 'dd DD.MM.YYYY', 'gom-deva'],
            ['Mon 15.05.2018', 'dd DD.MM.YYYY', 'gom-latn'],
            ['uto 15.05.2018', 'dd DD.MM.YYYY', 'hr'],
            ['Dë 15.05.2018', 'dd DD.MM.YYYY', 'lb'],
            ['uto 15.05.2018', 'dd DD.MM.YYYY', 'me'],
            ['ti 15.05.2018', 'dd DD.MM.YYYY', 'nb'],
            ['मङ्गल 15.05.2018', 'dd DD.MM.YYYY', 'ne'],
            ['di 15.05.2018', 'dd DD.MM.YYYY', 'nl-be'],
            ['di 15.05.2018', 'dd DD.MM.YYYY', 'nl'],
            ['ty 15.05.2018', 'dd DD.MM.YYYY', 'nn'],
            ['dm 15.05.2018', 'dd DD.MM.YYYY', 'oc-lnc'],
            ['tor 15.05.2018', 'dd DD.MM.YYYY', 'sl'],
            ['уто 15.05.2018', 'dd DD.MM.YYYY', 'sr-cyrl'],
            ['uto 15.05.2018', 'dd DD.MM.YYYY', 'sr'],
            ['uto 15.05.2018', 'dd DD.MM.YYYY', 'sr'],
        ],
        i;
    for (i = 0; i < a.length; i++) {
        assert.ok(customMoment(a[i][0], a[i][1], a[i][2]).isValid());
    }
});
