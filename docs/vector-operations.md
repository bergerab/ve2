The same operations done with scalars can be done with vectors too. This should explain itself:

```js
let v1 = ve2(20, 30),
    v2 = ve2(2, 3),
    sum = v1.add(v2);
```

Most of these functions in ve2 will convert whatever you give it to a vector (such as arrays, objects, etc...):

```js
sum = v1.add([2, 3]);
sum = v1.add({ x:2, y:3 });
sum = v1.add(2, 3);
```

Just like the scalar operations, the interface to `.add` is the same as `.sub`, `.mul`, `.div` and others.
