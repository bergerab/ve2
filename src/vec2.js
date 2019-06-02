const { getName, clamp } = require('./util');

const vec2 = (a1, a2) => new Vec2(a1, a2);
vec2.zero = () => new Vec2();
vec2.one = () => new Vec2(1, 1);
vec2.dist = (v1, v2) => {
    v1 = lift(v1);
    v2 = lift(v2);
    return v1.sub(v2).mag();
};
vec2.fromAngle = (rads, mag=1) => new Vec2(rads).mul(mag);

class Vec2 {
    constructor(a1, a2) {
        [this.x, this.y] = normalize(a1, a2);
    }

    toArray() {
        return [this.x, this.y];
    }

    toObject() {
        return { x: this.x, y: this.y };
    }

    mag() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    dist(v) {
        return Vec2.dist(this, v);
    }

    dot(v) {
        v = lift(v);
        return this.x*v.x + this.y*v.y;
    }
    
    dir() {
        return Math.atan2(this.y, this.x);
    }

    equals(v) {
        v = lift(v);
        return this.x === v.x && this.y === v.y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }
}

function fromAngle(rads) {
    return [Math.cos(rads), Math.sin(rads)];
}

function normalize(a1, a2) {
    if (typeof a1 === 'object' && typeof a1.x === 'number' && typeof a1.y === 'number') {
        return [a1.x, a1.y];
    } else if (Array.isArray(a1) && a1.length > 1) {
        return [a1[0], a1[1]];
    } else if (typeof a1 === 'number') {
        if (typeof a2 === 'number') {
            return [a1, a2];
        } else if (a2 === undefined) {
            return fromAngle(a1);
        } else {
            throw new Error(`Cannot convert given arguments to vector. Unknown second argument of type ${typeof a2}.`);
        }
    } else if (a1 instanceof Vec2) {
        return [a1.x, a1.y];
    } else {
        throw new Error(`Cannot convert given argument to vector. Received value of type ${getName(a1)}.`);
    }
}

function lift(a1, a2) {
    if (a1 instanceof Vec2) {
        return a1;
    } else {
        return new Vec2(normalize(a1, a2));
    }
}

function checkInvariant(x) {
    if (typeof x !== 'number') {
        throw new Error(`Invariant violation: x/y coordinates must be numeric (found value of type: ${typeof x}).`);
    } else if (Number.isNaN(x)) {
        throw new Error(`Invariant violation: x/y coordinates cannot be NaN`);
    }
}

function getInPlaceName(name) {
    return name + 'i';
}

function addMakeFunc(name, makeFunc) {
    Vec2.prototype[name] = makeFunc(false);
    Vec2.prototype[getInPlaceName(name)] = makeFunc(true);    
};

const addFunc = (name, funci) => {
    const inPlaceName = getInPlaceName(name);
    const makeFunc = inPlace => inPlace ? funci : function (...args) {
        return this.clone()[inPlaceName](...args);
    };

    addMakeFunc(name, makeFunc);
};

addFunc('swap', function() {
    const temp = this.x;
    this.x = this.y;
    this.y = temp;
    return this;
});

addFunc('norm', function() {
    const mag = this.mag();
    this.x = this.x/mag;
    this.y = this.y/mag;
    checkInvariant(this.x);
    checkInvariant(this.y);
    return this;
});

addFunc('negX', function() {
    this.x = -this.x;
    return this;
});

addFunc('negY', function() {
    this.y = -this.y;
    return this;
});

addFunc('clamp', function(min, max) {
    this.x = clamp(this.x, min, max);
    this.y = clamp(this.y, min, max);
    checkInvariant(this.x);
    checkInvariant(this.y);    
    return this;
});

addFunc('rot', function(rads) {
    const dir = this.dir(),
          mag = this.mag();
    this.x = Math.cos(dir + rads);
    this.y = Math.sin(dir + rads);
    return this.muli(mag);
});

addFunc('lerp', function(a1, a2, p) {
    let v = null;
    if (p === undefined || typeof p !== 'number') {
        v = lift(a1);
        p = a2;
    } else {
        v = lift(a1, a2);
    }
    this.x = this.x + (v.x - this.x) * p;
    this.y = this.y + (v.y - this.y) * p;
    checkInvariant(this.x);
    checkInvariant(this.y);    
    return this;
});

const addOp = (name, op, checkSecondInvariant) => {
    const makeFunc = inPlace => function (a1, a2=a1) {
        let x1 = this.x,
            y1 = this.y,
            [x2, y2] = normalize(a1, a2);

        if (checkSecondInvariant) {
            checkSecondInvariant(x1, x2);
            checkSecondInvariant(y1, y2);
        }
        
        x1 = op(x1, x2);
        y1 = op(y1, y2);

        checkInvariant(x1);
        checkInvariant(y1);        

        if (inPlace) {
            this.x = x1;
            this.y = y1;
            
            return this;
        } else {
            return new Vec2(x1, y1);
        }
    };
    addMakeFunc(name, makeFunc);
};

addOp('add', (a, b) => a + b);
addOp('sub', (a, b) => a - b);
addOp('mul', (a, b) => a * b);
addOp('div', (a, b) => a / b, (a, b) => {
    let makeMessage = hole => `Invariant violation: denominator for division cannot be ${hole}.`;
    if (Number.isNaN(b)) {
        throw new Error(makeMessage('NaN'));
    } else if (b === 0) {
        throw new Error(makeMessage('zero'));                
    } else if (!Number.isFinite(b)) {
        throw new Error(makeMessage('infinite'));        
    }
});
addOp('max', Math.max);
addOp('min', Math.min);

const addFuncMap = (name, funcX, funcY=funcX) => {
    const makeFunc = inPlace => function () {
        if (inPlace) {
            this.x = funcX(this.x);
            this.y = funcY(this.y);
            
            return this;
        } else {
            return new Vec2(funcX(this.x), funcY(this.y));
        }
    };
    addMakeFunc(name, makeFunc);
};

addFuncMap('round', Math.round);
addFuncMap('floor', Math.floor);
addFuncMap('ceil', Math.ceil);
addFuncMap('sqrt', Math.sqrt);
addFuncMap('abs', Math.abs);
addFuncMap('neg', x => -x);

module.exports = vec2;
