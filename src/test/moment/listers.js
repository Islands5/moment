import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';

module('listers');

test('default', function (assert) {
    assert.deepEqual(customMoment.months(), [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]);
    assert.deepEqual(customMoment.monthsShort(), [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]);
    assert.deepEqual(customMoment.weekdays(), [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]);
    assert.deepEqual(customMoment.weekdaysShort(), [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
    ]);
    assert.deepEqual(customMoment.weekdaysMin(), [
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
    ]);
});

test('index', function (assert) {
    assert.equal(customMoment.months(0), 'January');
    assert.equal(customMoment.months(2), 'March');
    assert.equal(customMoment.monthsShort(0), 'Jan');
    assert.equal(customMoment.monthsShort(2), 'Mar');
    assert.equal(customMoment.weekdays(0), 'Sunday');
    assert.equal(customMoment.weekdays(2), 'Tuesday');
    assert.equal(customMoment.weekdaysShort(0), 'Sun');
    assert.equal(customMoment.weekdaysShort(2), 'Tue');
    assert.equal(customMoment.weekdaysMin(0), 'Su');
    assert.equal(customMoment.weekdaysMin(2), 'Tu');
});

test('localized', function (assert) {
    var months = 'one_two_three_four_five_six_seven_eight_nine_ten_eleven_twelve'.split(
            '_'
        ),
        monthsShort = 'on_tw_th_fo_fi_si_se_ei_ni_te_el_tw'.split('_'),
        weekdays = 'one_two_three_four_five_six_seven'.split('_'),
        weekdaysShort = 'on_tw_th_fo_fi_si_se'.split('_'),
        weekdaysMin = '1_2_3_4_5_6_7'.split('_'),
        weekdaysLocale = 'four_five_six_seven_one_two_three'.split('_'),
        weekdaysShortLocale = 'fo_fi_si_se_on_tw_th'.split('_'),
        weekdaysMinLocale = '4_5_6_7_1_2_3'.split('_'),
        week = {
            dow: 3,
            doy: 6,
        };

    customMoment.locale('numerologists', {
        months: months,
        monthsShort: monthsShort,
        weekdays: weekdays,
        weekdaysShort: weekdaysShort,
        weekdaysMin: weekdaysMin,
        week: week,
    });

    assert.deepEqual(customMoment.months(), months);
    assert.deepEqual(customMoment.monthsShort(), monthsShort);
    assert.deepEqual(customMoment.weekdays(), weekdays);
    assert.deepEqual(customMoment.weekdaysShort(), weekdaysShort);
    assert.deepEqual(customMoment.weekdaysMin(), weekdaysMin);

    assert.equal(customMoment.months(0), 'one');
    assert.equal(customMoment.monthsShort(0), 'on');
    assert.equal(customMoment.weekdays(0), 'one');
    assert.equal(customMoment.weekdaysShort(0), 'on');
    assert.equal(customMoment.weekdaysMin(0), '1');

    assert.equal(customMoment.months(2), 'three');
    assert.equal(customMoment.monthsShort(2), 'th');
    assert.equal(customMoment.weekdays(2), 'three');
    assert.equal(customMoment.weekdaysShort(2), 'th');
    assert.equal(customMoment.weekdaysMin(2), '3');

    assert.deepEqual(customMoment.weekdays(true), weekdaysLocale);
    assert.deepEqual(customMoment.weekdaysShort(true), weekdaysShortLocale);
    assert.deepEqual(customMoment.weekdaysMin(true), weekdaysMinLocale);

    assert.equal(customMoment.weekdays(true, 0), 'four');
    assert.equal(customMoment.weekdaysShort(true, 0), 'fo');
    assert.equal(customMoment.weekdaysMin(true, 0), '4');

    assert.equal(customMoment.weekdays(false, 2), 'three');
    assert.equal(customMoment.weekdaysShort(false, 2), 'th');
    assert.equal(customMoment.weekdaysMin(false, 2), '3');
});

test('with functions', function (assert) {
    var monthsShort = 'one_two_three_four_five_six_seven_eight_nine_ten_eleven_twelve'.split(
            '_'
        ),
        monthsShortWeird = 'onesy_twosy_threesy_foursy_fivesy_sixsy_sevensy_eightsy_ninesy_tensy_elevensy_twelvesy'.split(
            '_'
        );

    customMoment.locale('difficult', {
        monthsShort: function (m, format) {
            var arr = format.match(/-MMM-/) ? monthsShortWeird : monthsShort;
            return arr[m.month()];
        },
    });

    assert.deepEqual(customMoment.monthsShort(), monthsShort);
    assert.deepEqual(customMoment.monthsShort('MMM'), monthsShort);
    assert.deepEqual(customMoment.monthsShort('-MMM-'), monthsShortWeird);

    assert.deepEqual(customMoment.monthsShort('MMM', 2), 'three');
    assert.deepEqual(customMoment.monthsShort('-MMM-', 2), 'threesy');
    assert.deepEqual(customMoment.monthsShort(2), 'three');
});

test('with locale data', function (assert) {
    var months = 'one_two_three_four_five_six_seven_eight_nine_ten_eleven_twelve'.split(
            '_'
        ),
        monthsShort = 'on_tw_th_fo_fi_si_se_ei_ni_te_el_tw'.split('_'),
        weekdays = 'one_two_three_four_five_six_seven'.split('_'),
        weekdaysShort = 'on_tw_th_fo_fi_si_se'.split('_'),
        weekdaysMin = '1_2_3_4_5_6_7'.split('_'),
        customLocale = customMoment.localeData('numerologists');

    assert.deepEqual(customLocale.months(), months);
    assert.deepEqual(customLocale.monthsShort(), monthsShort);
    assert.deepEqual(customLocale.weekdays(), weekdays);
    assert.deepEqual(customLocale.weekdaysShort(), weekdaysShort);
    assert.deepEqual(customLocale.weekdaysMin(), weekdaysMin);
});
