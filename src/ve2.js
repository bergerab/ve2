const { getName, clamp } = require('./util');

const ve2 = (a1, a2) => new Vec2(a1, a2);
ve2.zero = () => new Vec2();
ve2.fromAngle = (rads, mag=1) => new Vec2(rads).mul(mag);

class Vec2 {
    set x(val) {
        checkInvariant(val);
        this._x = val;
    }

    set y(val) {
        checkInvariant(val);
        this._y = val;
    }

    get x() {
        return this._x;
    }

    get _0() {
        return this.x;
    }

    get y() {
        return this._y;
    }

    get _1() {
        return this.y;
    }
    
    constructor(a1, a2) {
        this._x = 0;
        this._y = 0;
        
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

    dist(a1, a2) {
        const v = ve2(a1, a2);
        return this.sub(v).mag();
    }

    dot(a1, a2) {
        const v = ve2(a1, a2);
        return this.x*v.x + this.y*v.y;
    }
    
    dir() {
        return Math.atan2(this.y, this.x);
    }

    equals(a1, a2) {
        const v = ve2(a1, a2);
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
    if (Array.isArray(a1)) {
        if (a1.length > 1) {
            return [a1[0], a1[1]];
        } else if (a1.length === 1) {
            return [a1[0], 0];
        } else {
            return [0, 0];
        }
    } else if (typeof a1 === 'object') {
        if (a1.x !== undefined && typeof a1.x !== 'number') {
            throw new Error('Object given to ve2 has an invalid x field. It should be a number or undefined (to indicate 0).');
        }
        if (a1.y !== undefined && typeof a1.y !== 'number') {
            throw new Error('Object given to ve2 has an invalid y field. It should be a number or undefined (to indicate 0).');
        }
        return [defaultTo(a1.x, 0), defaultTo(a1.y, 0)];

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
    } else if (a1 === undefined && a2 === undefined) {
        return [0, 0];
    } else {
        throw new Error(`Cannot convert given argument to vector. Received value of type ${getName(a1)}.`);
    }
}

function defaultTo(testVal, defaultVal) {
    if (testVal === undefined) {
        return defaultVal;
    }
    return testVal;
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
        throw new InvariantViolationError(`x and y components must be numeric (found value of type: ${typeof x}).`);
    } else if (Number.isNaN(x)) {
        throw new InvariantViolationError(`x and y components cannot be NaN`);
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
    if (mag === 0) {
        this.x = 0;
        this.y = 0;
        return this;
    }
    
    this.x = this.x/mag;
    this.y = this.y/mag;
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
    return this;
});

addFunc('clampY', function(min, max) {
    this.y = clamp(this.y, min, max);
    return this;
});

addFunc('clampX', function(min, max) {
    this.x = clamp(this.x, min, max);
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
    let makeMessage = hole => `Denominator for division cannot be ${hole}.`;
    if (Number.isNaN(b)) {
        throw new InvariantViolationError(makeMessage('NaN'));
    } else if (b === 0) {
        throw new InvariantViolationError(makeMessage('zero'));                
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
addFuncMap('sqrt', x => {
    if (x < 0) {
        throw new InvariantViolationError("Cannot take sqrt of a negative number");
    }
    return Math.sqrt(x);
});
addFuncMap('abs', Math.abs);
addFuncMap('neg', x => -x);

class InvariantViolationError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = ve2;
