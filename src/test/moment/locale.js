import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';
import each from '../helpers/each';
import indexOf from '../../lib/utils/index-of';

module('locale', {
    setup: function () {
        // TODO: Remove once locales are switched to ES6
        each(
            [
                {
                    name: 'en-gb',
                    data: {},
                },
                {
                    name: 'en-ca',
                    data: {},
                },
                {
                    name: 'es',
                    data: {
                        relativeTime: {
                            past: 'hace %s',
                            s: 'unos segundos',
                            d: 'un día',
                        },
                        months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split(
                            '_'
                        ),
                    },
                },
                {
                    name: 'fr',
                    data: {},
                },
                {
                    name: 'fr-ca',
                    data: {},
                },
                {
                    name: 'it',
                    data: {},
                },
                {
                    name: 'zh-cn',
                    data: {
                        months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
                            '_'
                        ),
                    },
                },
            ],
            function (locale) {
                if (customMoment.locale(locale.name) !== locale.name) {
                    customMoment.defineLocale(locale.name, locale.data);
                }
            }
        );
        customMoment.locale('en');
    },
});

test('library getters and setters', function (assert) {
    var r = customMoment.locale('en');

    assert.equal(r, 'en', 'locale should return en by default');
    assert.equal(customMoment.locale(), 'en', 'locale should return en by default');

    customMoment.locale('fr');
    assert.equal(
        customMoment.locale(),
        'fr',
        'locale should return the changed locale'
    );

    customMoment.locale('en-gb');
    assert.equal(
        customMoment.locale(),
        'en-gb',
        'locale should return the changed locale'
    );

    customMoment.locale('en');
    assert.equal(customMoment.locale(), 'en', 'locale should reset');

    customMoment.locale('does-not-exist');
    assert.equal(customMoment.locale(), 'en', 'locale should reset');

    customMoment.locale('EN');
    assert.equal(customMoment.locale(), 'en', 'Normalize locale key case');

    customMoment.locale('EN_gb');
    assert.equal(customMoment.locale(), 'en-gb', 'Normalize locale key underscore');
});

test('library setter array of locales', function (assert) {
    assert.equal(
        customMoment.locale(['non-existent', 'fr', 'also-non-existent']),
        'fr',
        'passing an array uses the first valid locale'
    );
    assert.equal(
        customMoment.locale(['es', 'fr', 'also-non-existent']),
        'es',
        'passing an array uses the first valid locale'
    );
});

test('library setter locale substrings', function (assert) {
    assert.equal(customMoment.locale('fr-crap'), 'fr', 'use substrings');
    assert.equal(
        customMoment.locale('fr-does-not-exist'),
        'fr',
        'uses deep substrings'
    );
    assert.equal(
        customMoment.locale('fr-CA-does-not-exist'),
        'fr-ca',
        'uses deepest substring'
    );
});

test('library getter locale array and substrings', function (assert) {
    assert.equal(
        customMoment.locale(['en-CH', 'fr']),
        'en',
        'prefer root locale to shallower ones'
    );
    assert.equal(
        customMoment.locale(['en-gb-leeds', 'en-CA']),
        'en-gb',
        'prefer root locale to shallower ones'
    );
    assert.equal(
        customMoment.locale(['en-fake', 'en-CA']),
        'en-ca',
        'prefer alternatives with shared roots'
    );
    assert.equal(
        customMoment.locale(['en-fake', 'en-fake2', 'en-ca']),
        'en-ca',
        'prefer alternatives with shared roots'
    );
    assert.equal(
        customMoment.locale(['fake-CA', 'fake-MX', 'fr']),
        'fr',
        'always find something if possible'
    );
    assert.equal(
        customMoment.locale(['fake-CA', 'fake-MX', 'fr']),
        'fr',
        'always find something if possible'
    );
    assert.equal(
        customMoment.locale(['fake-CA', 'fake-MX', 'fr-fake-fake-fake']),
        'fr',
        'always find something if possible'
    );
    assert.equal(
        customMoment.locale(['en', 'en-CA']),
        'en',
        'prefer earlier if it works'
    );
});

test('library ensure inheritance', function (assert) {
    customMoment.locale('made-up', {
        // I put them out of order
        months: 'February_March_April_May_June_July_August_September_October_November_December_January'.split(
            '_'
        ),
        // the rest of the properties should be inherited.
    });

    assert.equal(
        customMoment([2012, 5, 6]).format('MMMM'),
        'July',
        'Override some of the configs'
    );
    assert.equal(
        customMoment([2012, 5, 6]).format('MMM'),
        'Jun',
        'But not all of them'
    );
});

test('library ensure inheritance LT L LL LLL LLLL', function (assert) {
    var locale = 'test-inherit-lt';

    customMoment.defineLocale(locale, {
        longDateFormat: {
            LT: '-[LT]-',
            L: '-[L]-',
            LL: '-[LL]-',
            LLL: '-[LLL]-',
            LLLL: '-[LLLL]-',
        },
        calendar: {
            sameDay: '[sameDay] LT',
            nextDay: '[nextDay] L',
            nextWeek: '[nextWeek] LL',
            lastDay: '[lastDay] LLL',
            lastWeek: '[lastWeek] LLLL',
            sameElse: 'L',
        },
    });

    customMoment.locale('es');

    assert.equal(
        customMoment().locale(locale).calendar(),
        'sameDay -LT-',
        'Should use instance locale in LT formatting'
    );
    assert.equal(
        customMoment().add(1, 'days').locale(locale).calendar(),
        'nextDay -L-',
        'Should use instance locale in L formatting'
    );
    assert.equal(
        customMoment().add(-1, 'days').locale(locale).calendar(),
        'lastDay -LLL-',
        'Should use instance locale in LL formatting'
    );
    assert.equal(
        customMoment().add(4, 'days').locale(locale).calendar(),
        'nextWeek -LL-',
        'Should use instance locale in LLL formatting'
    );
    assert.equal(
        customMoment().add(-4, 'days').locale(locale).calendar(),
        'lastWeek -LLLL-',
        'Should use instance locale in LLLL formatting'
    );
});

test('library localeData', function (assert) {
    customMoment.locale('en');

    var jan = customMoment([2000, 0]);

    assert.equal(
        customMoment.localeData().months(jan),
        'January',
        'no arguments returns global'
    );
    assert.equal(
        customMoment.localeData('zh-cn').months(jan),
        '一月',
        'a string returns the locale based on key'
    );
    assert.equal(
        customMoment.localeData(customMoment().locale('es')).months(jan),
        'enero',
        "if you pass in a moment it uses the moment's locale"
    );
});

test('library deprecations', function (assert) {
    test.expectedDeprecations('moment.lang');
    customMoment.lang('dude', { months: ['Movember'] });
    assert.equal(customMoment.locale(), 'dude', 'setting the lang sets the locale');
    assert.equal(customMoment.lang(), customMoment.locale());
    assert.equal(
        customMoment.langData(),
        customMoment.localeData(),
        'langData is localeData'
    );
    customMoment.defineLocale('dude', null);
});

test('defineLocale', function (assert) {
    customMoment.locale('en');
    customMoment.defineLocale('dude', { months: ['Movember'] });
    assert.equal(customMoment().locale(), 'dude', 'defineLocale also sets it');
    assert.equal(
        customMoment().locale('dude').locale(),
        'dude',
        'defineLocale defines a locale'
    );
    customMoment.defineLocale('dude', null);
});

test('locales', function (assert) {
    customMoment.defineLocale('dude', { months: ['Movember'] });
    assert.equal(
        true,
        !!~indexOf.call(customMoment.locales(), 'dude'),
        'locales returns an array of defined locales'
    );
    assert.equal(
        true,
        !!~indexOf.call(customMoment.locales(), 'en'),
        'locales should always include english'
    );
    customMoment.defineLocale('dude', null);
});

test('library convenience', function (assert) {
    customMoment.locale('something', { week: { dow: 3 } });
    customMoment.locale('something');
    assert.equal(
        customMoment.locale(),
        'something',
        'locale can be used to create the locale too'
    );
    customMoment.defineLocale('something', null);
});

test('firstDayOfWeek firstDayOfYear locale getters', function (assert) {
    customMoment.locale('something', { week: { dow: 3, doy: 4 } });
    customMoment.locale('something');
    assert.equal(customMoment.localeData().firstDayOfWeek(), 3, 'firstDayOfWeek');
    assert.equal(customMoment.localeData().firstDayOfYear(), 4, 'firstDayOfYear');
    customMoment.defineLocale('something', null);
});

test('instance locale method', function (assert) {
    customMoment.locale('en');

    assert.equal(
        customMoment([2012, 5, 6]).format('MMMM'),
        'June',
        'Normally default to global'
    );
    assert.equal(
        customMoment([2012, 5, 6]).locale('es').format('MMMM'),
        'junio',
        'Use the instance specific locale'
    );
    assert.equal(
        customMoment([2012, 5, 6]).format('MMMM'),
        'June',
        'Using an instance specific locale does not affect other moments'
    );
});

test('instance locale method with array', function (assert) {
    var m = customMoment().locale(['non-existent', 'fr', 'also-non-existent']);
    assert.equal(
        m.locale(),
        'fr',
        'passing an array uses the first valid locale'
    );
    m = customMoment().locale(['es', 'fr', 'also-non-existent']);
    assert.equal(
        m.locale(),
        'es',
        'passing an array uses the first valid locale'
    );
});

test('instance getter locale substrings', function (assert) {
    var m = customMoment();

    m.locale('fr-crap');
    assert.equal(m.locale(), 'fr', 'use substrings');

    m.locale('fr-does-not-exist');
    assert.equal(m.locale(), 'fr', 'uses deep substrings');
});

test('instance locale persists with manipulation', function (assert) {
    customMoment.locale('en');

    assert.equal(
        customMoment([2012, 5, 6]).locale('es').add({ days: 1 }).format('MMMM'),
        'junio',
        'With addition'
    );
    assert.equal(
        customMoment([2012, 5, 6]).locale('es').day(0).format('MMMM'),
        'junio',
        'With day getter'
    );
    assert.equal(
        customMoment([2012, 5, 6]).locale('es').endOf('day').format('MMMM'),
        'junio',
        'With endOf'
    );
});

test('instance locale persists with cloning', function (assert) {
    customMoment.locale('en');

    var a = customMoment([2012, 5, 6]).locale('es'),
        b = a.clone();

    assert.equal(b.format('MMMM'), 'junio', 'using customMoment.fn.clone()');
    assert.equal(b.format('MMMM'), 'junio', 'using customMoment()');
});

test('duration locale method', function (assert) {
    customMoment.locale('en');

    assert.equal(
        customMoment.duration({ seconds: 44 }).humanize(),
        'a few seconds',
        'Normally default to global'
    );
    assert.equal(
        customMoment.duration({ seconds: 44 }).locale('es').humanize(),
        'unos segundos',
        'Use the instance specific locale'
    );
    assert.equal(
        customMoment.duration({ seconds: 44 }).humanize(),
        'a few seconds',
        'Using an instance specific locale does not affect other durations'
    );
});

test('duration locale persists with cloning', function (assert) {
    customMoment.locale('en');

    var a = customMoment.duration({ seconds: 44 }).locale('es'),
        b = customMoment.duration(a);

    assert.equal(b.humanize(), 'unos segundos', 'using customMoment.duration()');
});

test("changing the global locale doesn't affect existing duration instances", function (assert) {
    var mom = customMoment.duration();
    customMoment.locale('fr');
    assert.equal('en', mom.locale());
});

test('duration deprecations', function (assert) {
    test.expectedDeprecations('moment().lang()');
    assert.equal(
        customMoment.duration().lang(),
        customMoment.duration().localeData(),
        'duration.lang is the same as duration.localeData'
    );
});

test('from and fromNow with invalid date', function (assert) {
    assert.equal(
        customMoment(NaN).from(),
        'Invalid date',
        'customMoment.from with invalid moment'
    );
    assert.equal(
        customMoment(NaN).fromNow(),
        'Invalid date',
        'customMoment.fromNow with invalid moment'
    );
});

test('from relative time future', function (assert) {
    var start = customMoment([2007, 1, 28]);

    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ s: 44 })),
        'in a few seconds',
        '44 seconds = a few seconds'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ s: 45 })),
        'in a minute',
        '45 seconds = a minute'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ s: 89 })),
        'in a minute',
        '89 seconds = a minute'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ s: 90 })),
        'in 2 minutes',
        '90 seconds = 2 minutes'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ m: 44 })),
        'in 44 minutes',
        '44 minutes = 44 minutes'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ m: 45 })),
        'in an hour',
        '45 minutes = an hour'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ m: 89 })),
        'in an hour',
        '89 minutes = an hour'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ m: 90 })),
        'in 2 hours',
        '90 minutes = 2 hours'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ h: 5 })),
        'in 5 hours',
        '5 hours = 5 hours'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ h: 21 })),
        'in 21 hours',
        '21 hours = 21 hours'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ h: 22 })),
        'in a day',
        '22 hours = a day'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ h: 35 })),
        'in a day',
        '35 hours = a day'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ h: 36 })),
        'in 2 days',
        '36 hours = 2 days'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 1 })),
        'in a day',
        '1 day = a day'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 5 })),
        'in 5 days',
        '5 days = 5 days'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 25 })),
        'in 25 days',
        '25 days = 25 days'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 26 })),
        'in a month',
        '26 days = a month'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 30 })),
        'in a month',
        '30 days = a month'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 45 })),
        'in a month',
        '45 days = a month'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 47 })),
        'in 2 months',
        '47 days = 2 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 74 })),
        'in 2 months',
        '74 days = 2 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 78 })),
        'in 3 months',
        '78 days = 3 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ M: 1 })),
        'in a month',
        '1 month = a month'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ M: 5 })),
        'in 5 months',
        '5 months = 5 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 315 })),
        'in 10 months',
        '315 days = 10 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 344 })),
        'in a year',
        '344 days = a year'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 345 })),
        'in a year',
        '345 days = a year'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ d: 548 })),
        'in 2 years',
        '548 days = in 2 years'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ y: 1 })),
        'in a year',
        '1 year = a year'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).subtract({ y: 5 })),
        'in 5 years',
        '5 years = 5 years'
    );
});

test('from relative time past', function (assert) {
    var start = customMoment([2007, 1, 28]);

    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ s: 44 })),
        'a few seconds ago',
        '44 seconds = a few seconds'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ s: 45 })),
        'a minute ago',
        '45 seconds = a minute'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ s: 89 })),
        'a minute ago',
        '89 seconds = a minute'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ s: 90 })),
        '2 minutes ago',
        '90 seconds = 2 minutes'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ m: 44 })),
        '44 minutes ago',
        '44 minutes = 44 minutes'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ m: 45 })),
        'an hour ago',
        '45 minutes = an hour'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ m: 89 })),
        'an hour ago',
        '89 minutes = an hour'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ m: 90 })),
        '2 hours ago',
        '90 minutes = 2 hours'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ h: 5 })),
        '5 hours ago',
        '5 hours = 5 hours'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ h: 21 })),
        '21 hours ago',
        '21 hours = 21 hours'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ h: 22 })),
        'a day ago',
        '22 hours = a day'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ h: 35 })),
        'a day ago',
        '35 hours = a day'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ h: 36 })),
        '2 days ago',
        '36 hours = 2 days'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 1 })),
        'a day ago',
        '1 day = a day'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 5 })),
        '5 days ago',
        '5 days = 5 days'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 25 })),
        '25 days ago',
        '25 days = 25 days'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 26 })),
        'a month ago',
        '26 days = a month'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 30 })),
        'a month ago',
        '30 days = a month'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 43 })),
        'a month ago',
        '43 days = a month'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 46 })),
        '2 months ago',
        '46 days = 2 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 74 })),
        '2 months ago',
        '75 days = 2 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 76 })),
        '3 months ago',
        '76 days = 3 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ M: 1 })),
        'a month ago',
        '1 month = a month'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ M: 5 })),
        '5 months ago',
        '5 months = 5 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 315 })),
        '10 months ago',
        '315 days = 10 months'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 344 })),
        'a year ago',
        '344 days = a year'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 345 })),
        'a year ago',
        '345 days = a year'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ d: 548 })),
        '2 years ago',
        '548 days = 2 years'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ y: 1 })),
        'a year ago',
        '1 year = a year'
    );
    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ y: 5 })),
        '5 years ago',
        '5 years = 5 years'
    );
});

test('instance locale used with from', function (assert) {
    customMoment.locale('en');

    var a = customMoment([2012, 5, 6]).locale('es'),
        b = customMoment([2012, 5, 7]);

    assert.equal(a.from(b), 'hace un día', 'preserve locale of first moment');
    assert.equal(
        b.from(a),
        'in a day',
        'do not preserve locale of second moment'
    );
});

test('instance localeData', function (assert) {
    customMoment.defineLocale('dude', { week: { dow: 3 } });
    assert.equal(customMoment().locale('dude').localeData()._week.dow, 3);
    customMoment.defineLocale('dude', null);
});

test('month name callback function', function (assert) {
    function fakeReplace(m, format) {
        if (/test/.test(format)) {
            return 'test';
        }
        if (m.date() === 1) {
            return 'date';
        }
        return 'default';
    }

    customMoment.locale('made-up-2', {
        months: fakeReplace,
        monthsShort: fakeReplace,
        weekdays: fakeReplace,
        weekdaysShort: fakeReplace,
        weekdaysMin: fakeReplace,
    });

    assert.equal(
        customMoment().format('[test] dd ddd dddd MMM MMMM'),
        'test test test test test test',
        'format month name function should be able to access the format string'
    );
    assert.equal(
        customMoment([2011, 0, 1]).format('dd ddd dddd MMM MMMM'),
        'date date date date date',
        'format month name function should be able to access the moment object'
    );
    assert.equal(
        customMoment([2011, 0, 2]).format('dd ddd dddd MMM MMMM'),
        'default default default default default',
        'format month name function should be able to access the moment object'
    );
});

test('changing parts of a locale config', function (assert) {
    test.expectedDeprecations('defineLocaleOverride');

    customMoment.locale('partial-lang', {
        months: 'a b c d e f g h i j k l'.split(' '),
    });

    assert.equal(
        customMoment([2011, 0, 1]).format('MMMM'),
        'a',
        'should be able to set locale values when creating the localeuage'
    );

    customMoment.locale('partial-lang', {
        monthsShort: 'A B C D E F G H I J K L'.split(' '),
    });

    assert.equal(
        customMoment([2011, 0, 1]).format('MMMM MMM'),
        'a A',
        'should be able to set locale values after creating the localeuage'
    );

    customMoment.defineLocale('partial-lang', null);
});

test('start/endOf week feature for first-day-is-monday locales', function (assert) {
    customMoment.locale('monday-lang', {
        week: {
            dow: 1, // Monday is the first day of the week
        },
    });

    customMoment.locale('monday-lang');
    assert.equal(
        customMoment([2013, 0, 1]).startOf('week').day(),
        1,
        'for locale monday-lang first day of the week should be monday'
    );
    assert.equal(
        customMoment([2013, 0, 1]).endOf('week').day(),
        0,
        'for locale monday-lang last day of the week should be sunday'
    );
    customMoment.defineLocale('monday-lang', null);
});

test('meridiem parsing', function (assert) {
    customMoment.locale('meridiem-parsing', {
        meridiemParse: /[bd]/i,
        isPM: function (input) {
            return input === 'b';
        },
    });

    customMoment.locale('meridiem-parsing');
    assert.equal(
        customMoment('2012-01-01 3b', 'YYYY-MM-DD ha').hour(),
        15,
        'Custom parsing of meridiem should work'
    );
    assert.equal(
        customMoment('2012-01-01 3d', 'YYYY-MM-DD ha').hour(),
        3,
        'Custom parsing of meridiem should work'
    );
    customMoment.defineLocale('meridiem-parsing', null);
});

test('invalid date formatting', function (assert) {
    customMoment.locale('has-invalid', {
        invalidDate: 'KHAAAAAAAAAAAN!',
    });

    assert.equal(customMoment.invalid().format(), 'KHAAAAAAAAAAAN!');
    assert.equal(customMoment.invalid().format('YYYY-MM-DD'), 'KHAAAAAAAAAAAN!');
    customMoment.defineLocale('has-invalid', null);
});

test('return locale name', function (assert) {
    var registered = customMoment.locale('return-this', {});

    assert.equal(registered, 'return-this', 'returns the locale configured');
    customMoment.defineLocale('return-this', null);
});

test("changing the global locale doesn't affect existing instances", function (assert) {
    var mom = customMoment();
    customMoment.locale('fr');
    assert.equal('en', mom.locale());
});

test('setting a language on instance returns the original moment for chaining', function (assert) {
    test.expectedDeprecations('moment().lang()');
    var mom = customMoment();

    assert.equal(
        mom.lang('fr'),
        mom,
        'setting the language (lang) returns the original moment for chaining'
    );
    assert.equal(
        mom.locale('it'),
        mom,
        'setting the language (locale) returns the original moment for chaining'
    );
});

test('lang(key) changes the language of the instance', function (assert) {
    test.expectedDeprecations('moment().lang()');
    var m = customMoment().month(0);
    m.lang('fr');
    assert.equal(m.locale(), 'fr', 'm.lang(key) changes instance locale');
});

test('moment#locale(false) resets to global locale', function (assert) {
    var m = customMoment();

    customMoment.locale('fr');
    m.locale('it');

    assert.equal(customMoment.locale(), 'fr', 'global locale is it');
    assert.equal(m.locale(), 'it', 'instance locale is it');
    m.locale(false);
    assert.equal(m.locale(), 'fr', 'instance locale reset to global locale');
});

test("customMoment().locale with missing key doesn't change locale", function (assert) {
    assert.equal(
        customMoment().locale('boo').localeData(),
        customMoment.localeData(),
        'preserve global locale in case of bad locale id'
    );
});

test("customMoment().lang with missing key doesn't change locale", function (assert) {
    test.expectedDeprecations('moment().lang()');
    assert.equal(
        customMoment().lang('boo').localeData(),
        customMoment.localeData(),
        'preserve global locale in case of bad locale id'
    );
});

test('when in strict mode with inexact parsing, treat periods in short weekdays literally, not as the regex-period', function (assert) {
    customMoment.defineLocale('periods-in-short-weekdays', {
        weekdays: 'Monday_Tuesday_Wednesday_Thursday_Friday_Saturday_Sunday'.split(
            '_'
        ),
        weekdaysShort: 'mon_t...s_wed_thurs_fri_sat_sun'.split('_'),
        weekdaysParseExact: false,
    });

    customMoment().locale('periods-in-short-weekdays');
    assert.equal(customMoment('thurs', 'ddd', true).format('dddd'), 'Thursday');
});

test('when in strict mode with inexact parsing, treat periods in full weekdays literally, not as the regex-period', function (assert) {
    customMoment.defineLocale('periods-in-full-weekdays', {
        weekdays: 'Monday_T....day_Wednesday_Thursday_Friday_Saturday_Sunday'.split(
            '_'
        ),
        weekdaysShort: 'mon_tues_wed_thurs_fri_sat_sun'.split('_'),
        weekdaysParseExact: false,
    });

    customMoment().locale('periods-in-full-weekdays');
    assert.equal(customMoment('Thursday', 'dddd', true).format('ddd'), 'thurs');
});

test('when in strict mode with inexact parsing, treat periods in min-weekdays literally, not as the regex-period', function (assert) {
    customMoment.defineLocale('periods-in-min-weekdays', {
        weekdays: 'Monday_Tuesday_Wednesday_Thursday_Friday_Saturday_Sunday'.split(
            '_'
        ),
        weekdaysMin: 'mon_t...s_wed_thurs_fri_sat_sun'.split('_'),
        weekdaysParseExact: false,
    });

    customMoment().locale('periods-in-min-weekdays');
    assert.equal(customMoment('thurs', 'dd', true).format('dddd'), 'Thursday');
});

// TODO: Enable this after fixing pl months parse hack hack
// test('monthsParseExact', function (assert) {
//     var locale = 'test-months-parse-exact';

//     customMoment.defineLocale(locale, {
//         monthsParseExact: true,
//         months: 'A_AA_AAA_B_B B_BB  B_C_C-C_C,C2C_D_D+D_D`D*D'.split('_'),
//         monthsShort: 'E_EE_EEE_F_FF_FFF_G_GG_GGG_H_HH_HHH'.split('_')
//     });

//     assert.equal(customMoment('A', 'MMMM', true).month(), 0, 'parse long month 0 with MMMM');
//     assert.equal(customMoment('AA', 'MMMM', true).month(), 1, 'parse long month 1 with MMMM');
//     assert.equal(customMoment('AAA', 'MMMM', true).month(), 2, 'parse long month 2 with MMMM');
//     assert.equal(customMoment('B B', 'MMMM', true).month(), 4, 'parse long month 4 with MMMM');
//     assert.equal(customMoment('BB  B', 'MMMM', true).month(), 5, 'parse long month 5 with MMMM');
//     assert.equal(customMoment('C-C', 'MMMM', true).month(), 7, 'parse long month 7 with MMMM');
//     assert.equal(customMoment('C,C2C', 'MMMM', true).month(), 8, 'parse long month 8 with MMMM');
//     assert.equal(customMoment('D+D', 'MMMM', true).month(), 10, 'parse long month 10 with MMMM');
//     assert.equal(customMoment('D`D*D', 'MMMM', true).month(), 11, 'parse long month 11 with MMMM');

//     assert.equal(customMoment('E', 'MMM', true).month(), 0, 'parse long month 0 with MMM');
//     assert.equal(customMoment('EE', 'MMM', true).month(), 1, 'parse long month 1 with MMM');
//     assert.equal(customMoment('EEE', 'MMM', true).month(), 2, 'parse long month 2 with MMM');

//     assert.equal(customMoment('A', 'MMM').month(), 0, 'non-strict parse long month 0 with MMM');
//     assert.equal(customMoment('AA', 'MMM').month(), 1, 'non-strict parse long month 1 with MMM');
//     assert.equal(customMoment('AAA', 'MMM').month(), 2, 'non-strict parse long month 2 with MMM');
//     assert.equal(customMoment('E', 'MMMM').month(), 0, 'non-strict parse short month 0 with MMMM');
//     assert.equal(customMoment('EE', 'MMMM').month(), 1, 'non-strict parse short month 1 with MMMM');
//     assert.equal(customMoment('EEE', 'MMMM').month(), 2, 'non-strict parse short month 2 with MMMM');
// });
