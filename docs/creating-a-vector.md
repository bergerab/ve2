Vectors are created with the `ve2(...)` function. This function takes multiple types of arguments. 

You can make a vector by specifying `x` and `y` coordinates:

```js
const v = ve2(2, 3);
```

You can make one using the first and second items in an array:

```js
const v = ve2([1, 2]);
```

You can give the function an angle (in radians) and it will create the vector based on that too:

```js
const v1 = ve2(Math.PI/6);

// or:

const v2 = ve2.fromAngle(Math.PI/6);
```

You may be in a situation where you have an existing object that has `x` and `y` fields and you want to lift it into a `ve2`:

```js
const point = { x: 1, y: 2 };
const v = ve2(point);
```

In the browser, this is a more common situation than you may think. Consider trying to make a vector object out of a mouse position:

```js
canvas.onmousemove = function (e) {
    const mousePos = ve2(e);
    ...
};
```

The event object has more fields than just `e.x` and `e.y`, but those are just ignored. You can make a `ve2` out of a lot of built-in types `getBoundingRect()` returns an object that is handly to convert to a `ve2` too.

