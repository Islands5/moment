import { test } from '../qunit';
import eachOwnProp from './each-own-prop';
import {customMoment} from '../../custom_moment';

export function defineCommonLocaleTests(locale, options) {
    test('lenient day of month ordinal parsing', function (assert) {
        var i, ordinalStr, testMoment;
        for (i = 1; i <= 31; ++i) {
            ordinalStr = customMoment([2014, 0, i]).format('YYYY MM Do');
            testMoment = customMoment(ordinalStr, 'YYYY MM Do');
            assert.equal(
                testcustomMoment.year(),
                2014,
                'lenient day of month ordinal parsing ' + i + ' year check'
            );
            assert.equal(
                testcustomMoment.month(),
                0,
                'lenient day of month ordinal parsing ' + i + ' month check'
            );
            assert.equal(
                testcustomMoment.date(),
                i,
                'lenient day of month ordinal parsing ' + i + ' date check'
            );
        }
    });

    test('lenient day of month ordinal parsing of number', function (assert) {
        var i, testMoment;
        for (i = 1; i <= 31; ++i) {
            testMoment = customMoment('2014 01 ' + i, 'YYYY MM Do');
            assert.equal(
                testcustomMoment.year(),
                2014,
                'lenient day of month ordinal parsing of number ' +
                    i +
                    ' year check'
            );
            assert.equal(
                testcustomMoment.month(),
                0,
                'lenient day of month ordinal parsing of number ' +
                    i +
                    ' month check'
            );
            assert.equal(
                testcustomMoment.date(),
                i,
                'lenient day of month ordinal parsing of number ' +
                    i +
                    ' date check'
            );
        }
    });

    test('strict day of month ordinal parsing', function (assert) {
        var i, ordinalStr, testMoment;
        for (i = 1; i <= 31; ++i) {
            ordinalStr = customMoment([2014, 0, i]).format('YYYY MM Do');
            testMoment = customMoment(ordinalStr, 'YYYY MM Do', true);
            assert.ok(
                testcustomMoment.isValid(),
                'strict day of month ordinal parsing ' + i
            );
        }
    });

    test('meridiem invariant', function (assert) {
        var h, m, t1, t2;
        for (h = 0; h < 24; ++h) {
            for (m = 0; m < 60; m += 15) {
                t1 = customMoment.utc([2000, 0, 1, h, m]);
                t2 = customMoment.utc(t1.format('A h:mm'), 'A h:mm');
                assert.equal(
                    t2.format('HH:mm'),
                    t1.format('HH:mm'),
                    'meridiem at ' + t1.format('HH:mm')
                );
            }
        }
    });

    test('date format correctness', function (assert) {
        var data = customMoment.localeData()._longDateFormat;
        eachOwnProp(data, function (srchToken) {
            // Check each format string to make sure it does not contain any
            // tokens that need to be expanded.
            eachOwnProp(data, function (baseToken) {
                // strip escaped sequences
                var format = data[baseToken].replace(/(\[[^\]]*\])/g, '');
                assert.equal(
                    false,
                    !!~format.indexOf(srchToken),
                    'contains ' + srchToken + ' in ' + baseToken
                );
            });
        });
    });

    test('month parsing correctness', function (assert) {
        var i, m;

        if (locale === 'tr') {
            // I can't fix it :(
            assert.expect(0);
            return;
        }
        function tester(format) {
            var r;
            r = customMoment(m.format(format), format);
            assert.equal(r.month(), m.month(), 'month ' + i + ' fmt ' + format);
            if (locale !== 'ka') {
                r = customMoment(m.format(format).toLocaleUpperCase(), format);
                assert.equal(
                    r.month(),
                    m.month(),
                    'month ' + i + ' fmt ' + format + ' upper'
                );
            }
            r = customMoment(m.format(format).toLocaleLowerCase(), format);
            assert.equal(
                r.month(),
                m.month(),
                'month ' + i + ' fmt ' + format + ' lower'
            );

            r = customMoment(m.format(format), format, true);
            assert.equal(
                r.month(),
                m.month(),
                'month ' + i + ' fmt ' + format + ' strict'
            );
            if (locale !== 'ka') {
                r = customMoment(m.format(format).toLocaleUpperCase(), format, true);
                assert.equal(
                    r.month(),
                    m.month(),
                    'month ' + i + ' fmt ' + format + ' upper strict'
                );
            }
            r = customMoment(m.format(format).toLocaleLowerCase(), format, true);
            assert.equal(
                r.month(),
                m.month(),
                'month ' + i + ' fmt ' + format + ' lower strict'
            );
        }

        for (i = 0; i < 12; ++i) {
            m = customMoment([2015, i, 15, 18]);
            tester('MMM');
            tester('MMM.');
            tester('MMMM');
            tester('MMMM.');
        }
    });

    test('weekday parsing correctness', function (assert) {
        var i, m;

        if (
            locale === 'tr' ||
            locale === 'az' ||
            locale === 'ro' ||
            locale === 'mt' ||
            locale === 'ga'
        ) {
            // tr, az: There is a lower-case letter (ı), that converted to
            // upper then lower changes to i
            // ro: there is the letter ț which behaves weird under IE8
            // mt: letter Ħ
            // ga: month with spaces
            assert.expect(0);
            return;
        }
        function tester(format) {
            var r,
                baseMsg =
                    'weekday ' +
                    m.weekday() +
                    ' fmt ' +
                    format +
                    ' ' +
                    m.toISOString();
            r = customMoment(m.format(format), format);
            assert.equal(r.weekday(), m.weekday(), baseMsg);
            if (locale !== 'ka') {
                r = customMoment(m.format(format).toLocaleUpperCase(), format);
                assert.equal(r.weekday(), m.weekday(), baseMsg + ' upper');
            }
            r = customMoment(m.format(format).toLocaleLowerCase(), format);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' lower');
            r = customMoment(m.format(format), format, true);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' strict');
            if (locale !== 'ka') {
                r = customMoment(m.format(format).toLocaleUpperCase(), format, true);
                assert.equal(
                    r.weekday(),
                    m.weekday(),
                    baseMsg + ' upper strict'
                );
            }
            r = customMoment(m.format(format).toLocaleLowerCase(), format, true);
            assert.equal(r.weekday(), m.weekday(), baseMsg + ' lower strict');
        }

        for (i = 0; i < 7; ++i) {
            m = customMoment.utc([2015, 0, i + 1, 18]);
            tester('dd');
            tester('ddd');
            tester('dddd');
        }
    });

    test('valid localeData', function (assert) {
        assert.equal(
            customMoment().localeData().months().length,
            12,
            'months should return 12 months'
        );
        assert.equal(
            customMoment().localeData().monthsShort().length,
            12,
            'monthsShort should return 12 months'
        );
        assert.equal(
            customMoment().localeData().weekdays().length,
            7,
            'weekdays should return 7 days'
        );
        assert.equal(
            customMoment().localeData().weekdaysShort().length,
            7,
            'weekdaysShort should return 7 days'
        );
        assert.equal(
            customMoment().localeData().weekdaysMin().length,
            7,
            'monthsShort should return 7 days'
        );
    });

    test('localeData weekdays can localeSort', function (assert) {
        var weekdays = customMoment().localeData().weekdays(),
            weekdaysShort = customMoment().localeData().weekdaysShort(),
            weekdaysMin = customMoment().localeData().weekdaysMin(),
            shift = customMoment().localeData()._week.dow;
        assert.deepEqual(
            customMoment().localeData().weekdays(true),
            weekdays.slice(shift, 7).concat(weekdays.slice(0, shift)),
            'weekdays should localeSort'
        );
        assert.deepEqual(
            customMoment().localeData().weekdaysShort(true),
            weekdaysShort.slice(shift, 7).concat(weekdaysShort.slice(0, shift)),
            'weekdaysShort should localeSort'
        );
        assert.deepEqual(
            customMoment().localeData().weekdaysMin(true),
            weekdaysMin.slice(shift, 7).concat(weekdaysMin.slice(0, shift)),
            'weekdaysMin should localeSort'
        );
    });
}
