import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';

var symbolMap = {
        1: '!',
        2: '@',
        3: '#',
        4: '$',
        5: '%',
        6: '^',
        7: '&',
        8: '*',
        9: '(',
        0: ')',
    },
    numberMap = {
        '!': '1',
        '@': '2',
        '#': '3',
        $: '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
    };

module('preparse and postformat', {
    setup: function () {
        customMoment.locale('symbol', {
            preparse: function (string) {
                return string.replace(/[!@#$%\^&*()]/g, function (match) {
                    return numberMap[match];
                });
            },

            postformat: function (string) {
                return string.replace(/\d/g, function (match) {
                    return symbolMap[match];
                });
            },
        });
    },
    teardown: function () {
        customMoment.defineLocale('symbol', null);
    },
});

test('transform', function (assert) {
    assert.equal(
        customMoment.utc('@)!@-)*-@&', 'YYYY-MM-DD').unix(),
        1346025600,
        'preparse string + format'
    );
    assert.equal(
        customMoment.utc('@)!@-)*-@&').unix(),
        1346025600,
        'preparse ISO8601 string'
    );
    assert.equal(
        customMoment.unix(1346025600).utc().format('YYYY-MM-DD'),
        '@)!@-)*-@&',
        'postformat'
    );
});

test('transform from', function (assert) {
    var start = customMoment([2007, 1, 28]);

    assert.equal(
        start.from(customMoment([2007, 1, 28]).add({ s: 90 }), true),
        '@ minutes',
        'postformat should work on customMoment.fn.from'
    );
    assert.equal(
        customMoment().add(6, 'd').fromNow(true),
        '^ days',
        'postformat should work on customMoment.fn.fromNow'
    );
    assert.equal(
        customMoment.duration(10, 'h').humanize(),
        '!) hours',
        'postformat should work on customMoment.duration.fn.humanize'
    );
});

test('calendar day', function (assert) {
    var a = customMoment().hours(12).minutes(0).seconds(0);

    assert.equal(
        customMoment(a).calendar(),
        'Today at !@:)) PM',
        'today at the same time'
    );
    assert.equal(
        customMoment(a).add({ m: 25 }).calendar(),
        'Today at !@:@% PM',
        'Now plus 25 min'
    );
    assert.equal(
        customMoment(a).add({ h: 1 }).calendar(),
        'Today at !:)) PM',
        'Now plus 1 hour'
    );
    assert.equal(
        customMoment(a).add({ d: 1 }).calendar(),
        'Tomorrow at !@:)) PM',
        'tomorrow at the same time'
    );
    assert.equal(
        customMoment(a).subtract({ h: 1 }).calendar(),
        'Today at !!:)) AM',
        'Now minus 1 hour'
    );
    assert.equal(
        customMoment(a).subtract({ d: 1 }).calendar(),
        'Yesterday at !@:)) PM',
        'yesterday at the same time'
    );
});
