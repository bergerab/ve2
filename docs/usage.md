Here is an overview of all the functions that can be used with ve2:

<div id="usage-table">

| Function                                 | Use                                                                                                                                                  |
| ---------                                | -----------                                                                                                                                          |
| `ve2(...)`                               | Creates a new 2D vector from x/y coordinate, an array, object (that has "x" and "y"), or an angle (in radians).                                      |
| `ve2.dist(..., ...)`                     | Returns the euclidean distance between two vectors                                                                                                   |
| `ve2.zero()`                             | Creates a new 2D vector with coordinate x=0 and y=0                                                                                                  |
| `ve2.fromAngle(radians [, magnitude=1])` | Creates a new 2D vector with the given direction (in radians) and magnitude.                                                                         |
| `.clone()`                               | Create a new 2D vector with the same coordinate as the receiver.                                                                                     |
| `.mag()`                                 | Returns the magnitude of the vector.                                                                                                                 |
| `.dir()`                                 | Returns the direction of the vector.                                                                                                                 |
| `.dist(v)`                               | Returns the euclidean distance between the receiver and the given vector.                                                                            |
| `.dot(v)`                                | Returns the dot product of the receiver and the given vector.                                                                                        |
| `.equals(v)`                             | Returns true if the coordinate of v equal the coordinate of the receiver otherwise false.                                                            |
| `.toString()`                            | Returns a string representation of the vector.                                                                                                       |
| `.swap()`                                | Creates a new 2D vector with an x coordinate equal to the receiver's y coordinate and y coordinate equal to the receiver's x coordinate.             |
| `.swapi()`                               | In-place version of `.swap()`.                                                                                                                       |
| `.norm()`                                | Creates a new 2D vector with the normalized coordinate of the receiver.                                                                              |
| `.inorm()`                               | In-place version of `.norm()`.                                                                                                                       |
| `.clamp(min, max)`                       | Creates a new 2D vector where the coordinate are the same as the receiver, but are no greater than the given max and are no less than the given min. |
| `.clampi(min, max)`                      | In-place version of `.clamp(min, max)`.                                                                                                              |
| `.clampX(min, max)`                      | Creates a new 2D vector where the x component is the same as the receiver, but is no greater than the given max and are no less than the given min.  |
| `.clampXi(min, max)`                     | In-place version of `.clampX(min, max)`.                                                                                                             |
| `.clampY(min, max)`                      | Creates a new 2D vector where the y component is the same as the receiver, but is no greater than the given max and are no less than the given min.  |
| `.clampYi(min, max)`                     | In-place version of `.clampY(min, max)`.                                                                                                             |
| `.rot(radians)`                          | Creates a new 2D vector with the coordinate of the receiver that have been rotated clockwise with the given angle (in radians).                      |
| `.roti(radians)`                         | In-place version of `.rot(radians)`.                                                                                                                 |
| `.lerp(..., p)`                          | Creates a new 2D vector that is the linear interpolation between the receiver and the given vector                                                   |
| `.lerpi(..., p)`                         | ...                                                                                                                                                  |
| `.negX()`                                | Creates a new 2D vector with the same coordinate as the receiver, except the x coordinat is negated.                                                 |
| `.negXi()`                               | In-place version of `.negX()`.                                                                                                                       |
| `.negY()`                                | Same as `.negX()` but with the Y coordinate                                                                                                          |
| `.negYi()`                               | ...                                                                                                                                                  |
| `.add(...)`                              | Creates a new 2D vector that has the receiver's coordinate added to the given vector.                                                                |
| `.addi(...)`                             | In-place version of `.add(...)`.                                                                                                                     |
| `.sub(...)`                              | ...                                                                                                                                                  |
| `.subi(...)`                             | ...                                                                                                                                                  |
| `.mul(...)`                              | ...                                                                                                                                                  |
| `.muli(...)`                             | ...                                                                                                                                                  |
| `.div(...)`                              | ...                                                                                                                                                  |
| `.divi(...)`                             | ...                                                                                                                                                  |
| `.min(...)`                              | ...                                                                                                                                                  |
| `.mini(...)`                             | ...                                                                                                                                                  |
| `.max(...)`                              | ...                                                                                                                                                  |
| `.maxi(...)`                             | ...                                                                                                                                                  |
| `.round()`                               | Creates a new 2D vector that is the same as the receiver's coordinate but has been rounded.                                                          |
| `.roundi()`                              | In-place version of `.round()`                                                                                                                       |
| `.floor()`                               | ...                                                                                                                                                  |
| `.floori()`                              | ...                                                                                                                                                  |
| `.ceil()`                                | ...                                                                                                                                                  |
| `.ceili()`                               | ...                                                                                                                                                  |
| `.sqrt()`                                | ...                                                                                                                                                  |
| `.sqrti()`                               | ...                                                                                                                                                  |
| `.abs()`                                 | ...                                                                                                                                                  |
| `.absi()`                                | ...                                                                                                                                                  |
| `.neg()`                                 | Creates a new 2D vector with the same coordinate as the receiver but have been negated.                                                              |
| `.negi()`                                | In-place version of `.neg()`                                                                                                                         |

</div>
Many of the uses are left blank indicating that their use is similar to the one above it. For example, `.mul(...)` is just like `.add(...)` in that it accepts a ve2, object, array, scalar, or x/y coordinate, and 
returns a new 2D vector that is the multiplication of the receiver and the argument.

Some uses are repeated because they are slightly different, or may be unclear from the function name.

The dots as arguments (like this: `...`) indicate that the function will take anything that looks like a 2D vector. That could be you passing two arguments (which will be interpreted as `x` and `y` coordinate), or an array (in which case `arr[0]` is `x` and `arr[1]` is `y`), etc... For example: `ve2(1, 2)` and `ve2([1, 2])` and `ve2(ve2(1, 2))` all mean the same thing.
