import {customMoment} from '../../custom_moment';

export function isNearSpringDST() {
    return (
        customMoment().subtract(1, 'day').utcOffset() !==
        customMoment().add(1, 'day').utcOffset()
    );
}
