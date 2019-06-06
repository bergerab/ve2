Often times you need to perform some operation such as addition or subtraction on a vector.

```js
const mousePos = ve2(1, 2),
     offsetPos = mousePos.add(10);
```

Above, the scalar `10` has been added to the `x` and `y` components of the vector. There are some times when you just want to add a scalar to one component:

```js
const xOffsetPos = mousePos.add(10, 0),
      yOffsetPos = mousePos.add(0, 10);

```

This is just like adding a vector where the x or y component is `0`. You can also do this with other functions such as `.mul`, `.div` and `.sub`.
