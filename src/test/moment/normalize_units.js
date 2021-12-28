import { module, test } from '../qunit';
import {customMoment} from '../../custom_moment';

module('normalize units');

test('normalize units', function (assert) {
    var fullKeys = [
            'year',
            'quarter',
            'month',
            'isoWeek',
            'week',
            'day',
            'hour',
            'minute',
            'second',
            'millisecond',
            'date',
            'dayOfYear',
            'weekday',
            'isoWeekday',
            'weekYear',
            'isoWeekYear',
        ],
        aliases = [
            'y',
            'Q',
            'M',
            'W',
            'w',
            'd',
            'h',
            'm',
            's',
            'ms',
            'D',
            'DDD',
            'e',
            'E',
            'gg',
            'GG',
        ],
        length = fullKeys.length,
        fullKey,
        fullKeyCaps,
        fullKeyPlural,
        fullKeyCapsPlural,
        alias,
        index;

    for (index = 0; index < length; index += 1) {
        fullKey = fullKeys[index];
        fullKeyCaps = fullKey.toUpperCase();
        fullKeyPlural = fullKey + 's';
        fullKeyCapsPlural = fullKeyCaps + 's';
        alias = aliases[index];
        assert.equal(
            customMoment.normalizeUnits(fullKey),
            fullKey,
            'Testing full key ' + fullKey
        );
        assert.equal(
            customMoment.normalizeUnits(fullKeyCaps),
            fullKey,
            'Testing full key capitalised ' + fullKey
        );
        assert.equal(
            customMoment.normalizeUnits(fullKeyPlural),
            fullKey,
            'Testing full key plural ' + fullKey
        );
        assert.equal(
            customMoment.normalizeUnits(fullKeyCapsPlural),
            fullKey,
            'Testing full key capitalised and plural ' + fullKey
        );
        assert.equal(
            customMoment.normalizeUnits(alias),
            fullKey,
            'Testing alias ' + fullKey
        );
    }
});
