const { expect } = require('chai'),
      ve2 = require('../dist/ve2.js');

function equal(v, x, y) {
    expect(v.x).to.equal(x);
    expect(v.y).to.equal(y);
}

function equalArr(v, arr) {
    expect(v.x).to.equal(arr[0]);
    expect(v.y).to.equal(arr[1]);
}

function equalObj(v, obj) {
    expect(v.x).to.equal(obj.x);
    expect(v.y).to.equal(obj.y);
}

describe('#ve2(...)', () => {
  it('defaults to (0, 0)', () => {
    equal(ve2(), 0, 0);
  });
    
  it('accepts x and y components', () => {
    equal(ve2(0, 0), 0, 0);
    equal(ve2(0, 2), 0, 2);
    equal(ve2(84, 22), 84, 22);
    equal(ve2(-23, 222), -23, 222);
  });

  it('accepts an array', () => {
    equal(ve2([1, 2]), 1, 2);
    equal(ve2([9, 10]), 9, 10);
  });

  it('accepts partial arrays', () => {
    equal(ve2([1]), 1, 0);
    equal(ve2([9]), 9, 0);
    equal(ve2([]), 0, 0);
  });

  it('accepts an object', () => {
    equal(ve2({ x: 12, y: 34 }), 12, 34);
    equal(ve2({ x: 9, y: 4 }), 9, 4);
  });

  it('accepts no input', () => {
    equal(ve2(), 0, 0);
  });

  it('accepts partial objects', () => {
    equal(ve2({ x: 3 }), 3, 0);
    equal(ve2({ y: 23 }), 0, 23);
  });

  it('accepts decimals', () => {
    equal(ve2(0.12, Math.PI), 0.12, Math.PI);
    equal(ve2(12.234, -34.222223), 12.234, -34.222223);
  });
  
  it('accepts angles', () => {
    equal(ve2(Math.PI/2), Math.cos(Math.PI/2), Math.sin(Math.PI/2));
    equal(ve2(-Math.PI/6), Math.cos(-Math.PI/6), Math.sin(-Math.PI/6));
  });
});

describe('#ve2.norm(...)', () => {
    it('has magnitude of 1', () => {
        expect(ve2(234, 1249).norm().mag()).to.equal(1);
        expect(ve2(0.234234, 0.1111).norm().mag()).to.equal(1);
    });

    it('is (0, 0) if input is (0, 0)', () => {
        equal(ve2(0, 0).norm(), 0, 0); 
    });

    it("doesn't modify the given vector", () => {
        const v = ve2(43, 21);
        v.norm();
        equal(v, 43, 21);
    });
});

describe('#ve2.normi(...)', () => {
    it('has magnitude of 1', () => {
        expect(ve2(234, 1249).normi().mag()).to.equal(1);
        expect(ve2(0.234234, 0.1111).normi().mag()).to.equal(1);
    });

    it('is (0, 0) if input is (0, 0)', () => {
        equal(ve2(0, 0).normi(), 0, 0); 
    });

    it("modifies the given vector", () => {
        const v = ve2(43, 21);
        v.normi();
        expect(v.mag()).to.equal(1);
    });
});

function testOp(label, op) {
  const exec = (v, ...args) => v[label](...args);
  const execi = (v, ...args) => v[`${label}i`](...args);
  
  function test(exec) {
    it('apply operation on each x/y component given input vector', () => {
      equal(exec(ve2(1, 1), ve2(2, 2)), op(1, 2), op(1, 2));
      equal(exec(ve2(1, 1), ve2(3, 2)), op(1, 3), op(1, 2));
      equal(exec(ve2(0, 1.23), ve2(23.11, 94.3)), op(0, 23.11), op(1.23, 94.3));
    });
    
    it('apply operation on each x/y component given two scalars', () => {
      equal(exec(ve2(3, 4), 6, 7), op(3, 6), op(4, 7));
      equal(exec(ve2(Math.PI/5, Math.PI/9), 2.333, 0.231), op(Math.PI/5, 2.333), op(Math.PI/9, 0.231));
    });

    it('apply operation on each x/y component given one scalar', () => {
      equal(exec(ve2(42, 35), 13), op(42, 13), op(35, 13));
      equal(exec(ve2(0.333, Math.PI), 0.44), op(0.333, 0.44), op(Math.PI, 0.44));
    });
    
    it('apply operation on each x/y component given an array', () => {
      equal(exec(ve2(23.1, 94.3202), [34.09, 34444.2]), op(23.1, 34.09), op(94.3202, 34444.2));
    });
  }
  
  describe(`#ve2.${label}(...)`, () => {
    test(exec);
    it("doesn't modify the given vector", () => {
      const v = ve2(23.4, 95.3);
      exec(v, Math.PI*34, 49);
      equal(v, 23.4, 95.3);
    });
    
  });

  describe(`#ve2.${label}i(...)`, () =>  {
    test(execi);
    it("modifies the given vector", () => {
      const v = ve2(23.4, 95.3);
      execi(v, Math.PI*34, 49);
      equal(v, op(23.4, Math.PI*34), op(95.3, 49));
    });
  });
}

testOp('add', (x, y) => x + y);
testOp('sub', (x, y) => x - y);
testOp('mul', (x, y) => x * y);
testOp('div', (x, y) => x / y);
testOp('min', (x, y) => Math.min(x, y));
testOp('max', (x, y) => Math.max(x, y));

describe('#ve2.dot(...)', () => {
  it('returns the correct result', () => {
    expect(ve2(1, 2).dot(3, 4)).to.equal(11);
    expect(ve2(0, 0).dot(231.22, 34.2)).to.equal(0);
    expect(ve2(34.24, 53.56).dot(1204.2, 3422.4582)).to.equal(224538.669192);
  });

  it('accepts a ve2', () => {
    expect(ve2(12, 3).dot(ve2(4, 5))).to.equal(63);
  });

  it('accepts x/y components', () => {
    expect(ve2(12, 3).dot(4, 5)).to.equal(63);
  });

  it('accepts an array', () => {
    expect(ve2(12, 3).dot([4, 5])).to.equal(63);
  });
  
  it('accepts an object', () => {
    expect(ve2(12, 3).dot({ x:4, y:5 })).to.equal(63);
  });
});

describe('#ve2.toArray(...)', () => {
  it('returns an array with the x component (index 0) and y component (index 1)', () => {
    equalArr(ve2(1, 2), [1, 2]);
    equalArr(ve2([4, 2]), [4, 2]);
  });
});

describe('#ve2.swap()', () => {
    it('returns a new ve2 with y component equal to x component and x component equal to y component', () => {
      equalObj(ve2(1, 2).swap(), ve2(2, 1));
      equalObj(ve2(Math.PI, 93.22).swap(), ve2(93.22, Math.PI));
    });

  it("doesn't modify given vector", () => {
    const v = ve2(23, 5);
    v.swap();
    equal(v, 23, 5);
  });
});

describe('#ve2.clone()', () => {
  it('returns a vector with the same x and y components', () => {
    let v = ve2(12, 34);
    equalObj(v, v.clone());
    v = ve2(Math.PI/23);
    equalObj(v, v.clone());
  });

  it('returns a new object', () => {
    let v1 = ve2(99, 33),
        v2 = v1.clone();
    
    v1.swapi();

    // swapi only changes v1, and not v2 because v2 is a new object
    equal(v1, 33, 99);
    equal(v2, 99, 33);
  });
});

describe('#ve2.swapi()', () => {
  it('modifies vector to make y component equal to x component and x component equal to y component', () => {
    let v = ve2(1, 2);
    v.swapi();
    equalObj(v, ve2(2, 1));
    
    v = ve2(Math.PI, 93.22);
    v.swapi();
    equalObj(v, ve2(93.22, Math.PI));
  });

  it("modifies the given vector", () => {
    const v = ve2(23, 5);
    v.swapi();
    equal(v, 5, 23);
  });
});

describe('#ve2.toArray', () => {
  it('returns an array with the x component (index 0) and y component (index 1)', () => {
    equalArr(ve2(1, 2), [1, 2]);
    equalArr(ve2([4, 2]), [4, 2]);
  });
});

describe('#ve2.dist(...)', () => {
  it('returns the euclidean distance between two vectors', () => {
    expect(ve2().dist(2, 0)).to.equal(2);
    expect(ve2().dist(0, 10)).to.equal(10);
    expect(ve2(0, 3).dist(0, 10)).to.equal(7);
    expect(ve2().dist(1, 1)).to.equal(Math.sqrt(2));
    expect(ve2().dist(20, 20)).to.equal(Math.sqrt(20*20 + 20*20));
    expect(ve2().dist(-13.2, -23.4)).to.equal(Math.sqrt(-13.2*-13.2 + -23.4*-23.4));
    expect(ve2().dist(-13.2, 23.4)).to.equal(Math.sqrt(-13.2*-13.2 + 23.4*23.4));
    expect(ve2(-23, 4).dist(34, -211)).to.equal(Math.sqrt(Math.pow(-23 - 34, 2) + Math.pow(4 + 211, 2)));
  });
});

describe('#ve2.fromAngle', () => {
  it('returns same value as ve2(<angle>)', () => {
    equalObj(ve2(Math.PI/6), ve2.fromAngle(Math.PI/6));
    equalObj(ve2(-Math.PI/128), ve2.fromAngle(-Math.PI/128));
  });

  it('multiplies vector by second parameter', () => {
    equalObj(ve2(-Math.PI/128).mul(123), ve2.fromAngle(-Math.PI/128, 123));
  });
});

describe('#ve2.toString', () => {
  it('returns string representation', () => {
    expect(ve2(1, 2).toString()).to.equal(`(1, 2)`);
    expect(ve2(1.23456, -23).toString()).to.equal(`(1.23456, -23)`);        
  });
});

describe('#ve2.equals', () => {
  it('compares x and y components', () => {
    expect(ve2(1, 2).equals(ve2(1, 2))).to.equal(true);
    expect(ve2(Math.PI, Math.PI*23.43).equals(ve2(Math.PI, Math.PI*23.43))).to.equal(true);
    expect(ve2(3, 2).equals(ve2(2, 3))).to.equal(false);
    expect(ve2(1, 2).equals(ve2(1, 3))).to.equal(false);
    expect(ve2(1, 2).equals(ve2(1, 2))).to.equal(true);                                
  });
  
  it('accepts array as argument', () => {
    expect(ve2(23, 54).equals([23, 54])).to.equal(true);
  });
});

describe('#ve2._0 and #ve2._1', () => {
  it('is the same as #ve2.x and #ve2.y', () => {
    let v = ve2(23, 54);
    expect(v.x).to.equal(v._0);
    expect(v.y).to.equal(v._1);
    
    v.swapi();
    expect(v.x).to.equal(v._0);
    expect(v.y).to.equal(v._1);        
  });
});

describe('#ve2.mag()', () => {
  it('returns the magnitude of the vector', () => {
    // magnitude is the same as euclidean distance from the origin
    expect(ve2(23, 43.2).mag()).to.equal(ve2().dist(ve2(23, 43.2)));
    
    expect(ve2(0, 10).mag()).to.equal(10);
    expect(ve2(-10, 0).mag()).to.equal(10);

    expect(ve2(0, -23).mag()).to.equal(23);
    expect(ve2(0, 21).mag()).to.equal(21);
    
    expect(ve2(1, 1).mag()).to.equal(Math.sqrt(2));
    expect(ve2(23, 54.3).mag()).to.equal(Math.sqrt(23*23 + 54.3*54.3));
  });
});

describe('#ve2.dir()', () => {
  it('returns the direction of the vector', () => {
    expect(ve2(10, 10).dir()).to.equal(Math.PI/4);
    expect(ve2(0, 0.2).dir()).to.equal(Math.PI/2);
    expect(ve2(-0.2, 0.2).dir()).to.equal((3*Math.PI)/4);        
  });
});

describe('#ve2.addX(...)', () => {
  it('returns a vector with the x component added to', () => {
    equal(ve2(12, 34).addX(3), 15, 34);
  });
  
  it("doesn't modify the given vector", () => {
    let v = ve2(12, 34);
    v.addX(39);
    equal(v, 12, 34);
  });
});

describe('#ve2.subX(...)', () => {
  it('returns a vector with the x component subtracted from', () => {
    equal(ve2(12, 34).subX(3), 9, 34);
  });
  
  it("doesn't modify the given vector", () => {
    let v = ve2(12, 34);
    v.subX(39);
    equal(v, 12, 34);
  });
});

describe('#ve2.mulX(...)', () => {
  it('returns a vector with the x component multiplied', () => {
    equal(ve2(12, 34).mulX(3), 36, 34);
  });
  
  it("doesn't modify the given vector", () => {
    let v = ve2(99, 34);
    v.mulX(39);
    equal(v, 99, 34);
  });
});

describe('#ve2.divX(...)', () => {
  it('returns a vector with the x component divided', () => {
    equal(ve2(27, 34).divX(3), 9, 34);
  });
  
  it("doesn't modify the given vector", () => {
    let v = ve2(12, 34);
    v.divX(39);
    equal(v, 12, 34);
  });
});

describe('#ve2.snap(...)', () => {
  it('can snap to grid of 10.', () => {
    equal(ve2(12, 34).snap(10), 10, 30);
    equal(ve2(15, 30).snap(10), 20, 30); 
  });

  it('can snap to grid of 2.', () => {
    equal(ve2(12, 34).snap(2), 12, 34);
    equal(ve2(15, 30).snap(2), 16, 30); 
  });

  it('can snap using floor.', () => {
    equal(ve2(12, 34).snap(5, 'floor'), 10, 30);
    equal(ve2(15, 30).snap(5, 'floor'), 15, 30); 
  });

  it('can snap using ceil.', () => {
    equal(ve2(12, 34).snap(5, 'ceil'), 15, 35);
    equal(ve2(15, 30).snap(5, 'ceil'), 15, 30); 
  });

  it('does not accept invalid modes.', () => {
    expect(() => ve2(3, 4).snap(10, 'bad')).to.throw();
    expect(() => ve2(3, 4).snap(10, true)).to.throw();
    expect(() => ve2(3, 4).snap(10, false)).to.throw();
    expect(() => ve2(3, 4).snap(10, 8)).to.throw();
  });
});

describe('#ve2.adj(...)', () => {
  it('can get adjacents when mode is 8.', () => {
    let adjs = ve2(33, 50).adj(1);
    expect(adjs.map(x => x.toArray())).to.deep.equal([
      [32, 49], [33, 49], [34, 49],
      [32, 50],           [34, 50],
      [32, 51], [33, 51], [34, 51],
    ]);
  });

  it('can get adjacents when mode is 4.', () => {
    let adjs = ve2(33, 50).adj(1, 4);
    expect(adjs.map(x => x.toArray())).to.deep.equal([
      [33, 49],
      [32, 50], [34, 50],
      [33, 51],
    ]);
  });

  it('does not accept invalid modes.', () => {
    expect(() => ve2(3, 4).adj(10, 5)).to.throw();
    expect(() => ve2(3, 4).adj(10, 1)).to.throw();
    expect(() => ve2(3, 4).adj(10, true)).to.throw();
    expect(() => ve2(3, 4).adj(10, false)).to.throw();
  });
});

describe('#ve2.negX()', () => {
  it('returns a vector with the x component complimented', () => {
    equal(ve2(12, 34).negX(), -12, 34);
    equal(ve2(-12, 3).negX(), 12, 3);
  });
  
  it("doesn't modify the given vector", () => {
    let v = ve2(12, 34);
    v.negX();
    equal(v, 12, 34);
  });
});

describe('#ve2.negXi()', () => {
  it('returns a vector with the x component complimented', () => {
    equal(ve2(12, 34).negXi(), -12, 34);
    equal(ve2(-12, 3).negXi(), 12, 3);
  });

  it("modifies the given vector", () => {
    let v = ve2(12, 34);
    v.negXi();
    equal(v, -12, 34);
  });
});

describe('#ve2.negY()', () => {
  it('returns a vector with the y component complimented', () => {
    equal(ve2(12, -34).negY(), 12, 34);
    equal(ve2(12, 3).negY(), 12, -3);
  });

  it("doesn't modify the given vector", () => {
    let v = ve2(12, 34);
    v.negY();
    equal(v, 12, 34);
  });
});

describe('#ve2.negYi()', () => {
  it('returns a vector with the x component complimented', () => {
    equal(ve2(12, -34).negYi(), 12, 34);
    equal(ve2(12, 3).negYi(), 12, -3);
  });

  it("modifies the given vector", () => {
    let v = ve2(12, 34);
    v.negYi();
    equal(v, 12, -34);
  });
});

describe('#ve2.clampX(...)', () => {
  it('bounds the x component between the given min and max', () => {
    equal(ve2(0.2, 1.2).clampX(0.1, 1.2), 0.2, 1.2);
    equal(ve2(-0.2, 1.2).clampX(0.1, 1.2), 0.1, 1.2);
    equal(ve2(1.2, 1.2).clampX(-0.1, 1.2), 1.2, 1.2);
    equal(ve2(2.2, 1.2).clampX(-0.1, 1.2), 1.2, 1.2);        
  });

  it("doesn't modify the given vector", () => {
    let v = ve2(2, 4);
    v.clampX(1, 3);
    equal(v, 2, 4);
  });
});

describe('#ve2.clampXi(...)', () => {
  it('bounds the x component between the given min and max', () => {
    equal(ve2(0.2, 1.2).clampXi(0.1, 1.2), 0.2, 1.2);
    equal(ve2(-0.2, 1.2).clampXi(0.1, 1.2), 0.1, 1.2);
    equal(ve2(1.2, 1.2).clampXi(-0.1, 1.2), 1.2, 1.2);
    equal(ve2(2.2, 1.2).clampXi(-0.1, 1.2), 1.2, 1.2);        
  });

  it("modifies the given vector", () => {
    let v = ve2(2, 4);
    v.clampXi(0, 1);
    equal(v, 1, 4);
  });
});

describe('#ve2.clampY(...)', () => {
  it('bounds the y component between the given min and max', () => {
    equal(ve2(1.2, 0.2).clampY(0.1, 1.2), 1.2, 0.2);
    equal(ve2(-1.2, -0.2).clampY(0.1, 1.2), -1.2, 0.1);
    equal(ve2(1.2, 1.2).clampY(-0.1, 1.2), 1.2, 1.2);
    equal(ve2(2.2, 2.2).clampY(-0.1, 1.2), 2.2, 1.2);        
  });

  it("doesn't modify the given vector", () => {
    let v = ve2(2, 4);
    v.clampY(1, 3);
    equal(v, 2, 4);
  });
});

describe('#ve2.clampYi(...)', () => {
  it('bounds the y component between the given min and max', () => {
    equal(ve2(1.2, 0.2).clampYi(0.1, 1.2), 1.2, 0.2);
    equal(ve2(-1.2, -0.2).clampYi(0.1, 1.2), -1.2, 0.1);
    equal(ve2(1.2, 1.2).clampYi(-0.1, 1.2), 1.2, 1.2);
    equal(ve2(2.2, 2.2).clampYi(-0.1, 1.2), 2.2, 1.2);        
  });

  it("modifies the given vector", () => {
    let v = ve2(2, 4);
    v.clampYi(0, 1);
    equal(v, 2, 1);
  });
});

describe('#ve2.rot()', () => {
  it('rotates the vector by the given angle', () => {
    equal(ve2(0).rot(Math.PI/2), Math.cos(Math.PI/2), Math.sin(Math.PI/2));
    equal(ve2(Math.PI/2).rot(Math.PI/2), Math.cos(Math.PI), Math.sin(Math.PI));
  });

  it("doesn't modify the given vector", () => {
    let v = ve2(20, 11);
    v.rot(Math.PI/5);
    equal(v, 20, 11);
  });
});

describe('#ve2.roti()', () => {
  it('rotates the vector by the given angle', () => {
    equal(ve2(0).roti(Math.PI/2), Math.cos(Math.PI/2), Math.sin(Math.PI/2));
    equal(ve2(Math.PI/2).roti(Math.PI/2), Math.cos(Math.PI), Math.sin(Math.PI));        
  });

  it('modifies the given vector', () => {
    let v = ve2(Math.PI);
    v.roti(Math.PI/4);
    equal(v, Math.cos(Math.PI + (Math.PI/4)), Math.sin(Math.PI + (Math.PI/4)));
  });
});

describe('#ve2.lerp(...)', () => {
  it('linearly interpolates between the given vector based on the given percent', () => {
    equal(ve2(0, 0).lerp(ve2(2, 2), 0.5), 1, 1);
    equal(ve2(0, 0).lerp(ve2(2, 2), 0.75), 1.5, 1.5);
    equal(ve2(0, 0).lerp(ve2(2, 2), 1), 2, 2);
    equal(ve2(0, 0).lerp(ve2(2, 2), 0), 0, 0);
    equal(ve2(-1, -1).lerp(ve2(2, 2), 0), -1, -1);
  });

  it("doesn't modify the given vector", () => {
    let v = ve2(11, 33);
    v.lerp(ve2(2, 3), 0.3);
    equal(v, 11, 33);
  });
});

describe('#ve2.lerpi(...)', () => {
  it('linearly interpolates between the given vector based on the given percent', () => {
    equal(ve2(0, 0).lerpi(ve2(2, 2), 0.5), 1, 1);
    equal(ve2(0, 0).lerpi(ve2(2, 2), 0.75), 1.5, 1.5);
    equal(ve2(0, 0).lerpi(ve2(2, 2), 1), 2, 2);
    equal(ve2(0, 0).lerpi(ve2(2, 2), 0), 0, 0);
    equal(ve2(-1, -1).lerpi(ve2(2, 2), 0), -1, -1);
  });

  it('modifies the given vector', () => {
    let v = ve2(1, 1);
    v.lerpi(ve2(3, 3), 0.5);
    equal(v, 2, 2);
  });
});

describe('#ve2.clamp(...)', () => {
  it('bounds the x and y components of the given vector between the given min and max', () => {
    equal(ve2(2, 3).clamp(1.4, 2.2), 2, 2.2);
    equal(ve2(2, 3).clamp(2.1, 3.2), 2.1, 3);
    equal(ve2(2, 3).clamp(1, 4), 2, 3);
    equal(ve2(-23, 3).clamp(2, 2), 2, 2);
  });

  it("doesn't modify the given vector", () => {
    let v = ve2(1, 3);
    v.clamp(1.1, 2.2);
    equal(v, 1, 3);
  });
});

describe('#ve2.clampi(...)', () => {
  it('bounds the x and y components of the given vector between the given min and max', () => {
    equal(ve2(2, 3).clampi(1.4, 2.2), 2, 2.2);
    equal(ve2(2, 3).clampi(2.1, 3.2), 2.1, 3);
    equal(ve2(2, 3).clampi(1, 4), 2, 3);
    equal(ve2(-23, 3).clampi(2, 2), 2, 2);
  });

  it('modifies the given vector', () => {
    let v = ve2(1, 3);
    v.clampi(1.1, 2.2);
    equal(v, 1.1, 2.2);
  });
});

function testMap(label, map) {
  const func = v => v[label]();
  const inPlaceFunc = v => v[label + 'i']();
  
  describe(`#ve2.${label}()`, () => {
    it('returns a new vector with the correct result', () => {
      equal(func(ve2(2.34, 4.56)), map(2.34), map(4.56));
      equal(func(ve2(-2.34, 4.56)), map(-2.34), map(4.56));
      equal(func(ve2(2.34, -4.56)), map(2.34), map(-4.56));
      equal(func(ve2(-2.34, -4.56)), map(-2.34), map(-4.56));
    });

    it("doesn't modify the given vector", () => {
      let v = ve2(-4, 16);
      func(v);
      equal(v, -4, 16);
    });
  });

  describe(`#ve2.${label}i()`, () => {
    it('returns a new vector with the correct result', () => {
      equal(inPlaceFunc(ve2(2.34, 4.56)), map(2.34), map(4.56));
      equal(inPlaceFunc(ve2(-2.34, 4.56)), map(-2.34), map(4.56));
      equal(inPlaceFunc(ve2(2.34, -4.56)), map(2.34), map(-4.56));
      equal(inPlaceFunc(ve2(-2.34, -4.56)), map(-2.34), map(-4.56));
    });

    it('modifies the given vector', () => {
      let v = ve2(-4, 16);
      inPlaceFunc(v);
      equal(v, map(-4), map(16));
    });
  });
}

testMap('round', x => Math.round(x));
testMap('floor', x => Math.floor(x));
testMap('ceil', x => Math.ceil(x));
testMap('abs', x => Math.abs(x));
testMap('neg', x => -x);

describe('#ve2.sqrt()', () => {
  it('returns a new vector with the correct result', () => {
    
  });
  
  it("doesn't modify the given vector", () => {
    let v = ve2(4, 16);
    v.sqrt();
    equal(v, 4, 16);
  });
});

describe('#ve2.sqrti()', () => {
  it('returns a new vector with the correct result', () => {
    
  });
  
  it('modifies the given vector', () => {
    let v = ve2(4, 16);
    v.sqrti();
    equal(v, 2, 4);
  });
});


describe('#ve2.zero()', () => {
  it('returns (0, 0)', () => {
    expect(ve2.zero(), 0, 0);
  });
});

describe('invariants are held', () => {
  it('dividing by zero throws', () => {
    expect(() => ve2(10, 20).div(0, 10)).to.throw();
    expect(() => ve2(22, 1).div(0)).to.throw();
    expect(() => ve2(2, 1).div(ve2(0, 13))).to.throw();
  });

  it("dividing with zero in numerator doesn't throw", () => {
    equal(ve2(0, 24).div(2), 0, 12);
    equal(ve2(0, 0).div(23, 1.22), 0, 0);
  });

  it("dividing with infinity in numerator doesn't throw", () => {
    equal(ve2(Infinity, 4).div(2), Infinity, 2);
  });

  it('dividing with NaN in numerator throws', () => {
    expect(() => ve2(NaN, 4).div(2)).to.throw();
    expect(() => ve2('weofijwef', 1).div(7)).to.throw();
  });

  it("dividing by positive infinity doesn't throw", () => {
    equal(ve2(3, 4).div(Infinity, 2), 0, 2);
  });

  it("dividing by negative positive infinity doesn't throw", () => {
    equal(ve2(3, 4).div(-Infinity, 2), 0, 2);
  });

  it('dividing by NaN throws', () => {
    expect(() => ve2(3, 4).div(NaN, 3)).to.throw();
    expect(() => ve2(3, 4).div(' owijwef ', 3)).to.throw();
  });

  it('adding with NaN throws', () => {
    expect(() => ve2(4, 2).add(NaN, 1)).to.throw();
    expect(() => ve2(4, 2).add('woeifj', 1)).to.throw();
  });

  it("adding with infinity doesn't throw", () => {
    equal(ve2(Infinity, 3).add(1, 23), Infinity, 26);
    equal(ve2(-Infinity, Infinity).add(2223.34, 559.3), -Infinity, Infinity);
  });
});
