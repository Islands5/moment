/*global QUnit:false*/

import {customMoment} from '../custom_moment';
import { defineCommonLocaleTests } from './helpers/common-locale';
import {
    setupDeprecationHandler,
    teardownDeprecationHandler,
} from './helpers/deprecation-handler';
import { test } from './qunit';

export function localeModule(name, lifecycle) {
    QUnit.module('locale:' + name, {
        beforeEach: function () {
            customMoment.locale(name);
            customMoment.createFromInputFallback = function (config) {
                throw new Error('input not handled by moment: ' + config._i);
            };
            setupDeprecationHandler(test,customMoment, 'locale');
            if (lifecycle && lifecycle.setup) {
                lifecycle.setup();
            }
        },
        afterEach: function () {
            customMoment.locale('en');
            teardownDeprecationHandler(test,customMoment, 'locale');
            if (lifecycle && lifecycle.teardown) {
                lifecycle.teardown();
            }
        },
    });
    defineCommonLocaleTests(name, -1, -1);
}
