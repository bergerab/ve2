function getName(any) {
    if (typeof any === 'object') {
        return any.constructor ? any.constructor.name : typeof any;
    } else {
        return typeof any;
    }
}

function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
}
