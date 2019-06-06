<div align="center">
    <img src="../img/ve2.png" width="200px"></img>
</div>

ve2 is a 2D vector library for Javascript. This library seeks to join the useful features  I've seen in multiple 2D vector libraries into a single library.

For example, one useful feature this library has is automatic detection of invalid vectors that can result from setting coordinates to `NaN` or division by zero, which was inspired by [this library](https://github.com/tmpvar/vec2.js).

Another inspired feature is to be able to specify operations with vectors and scalars using the same Javascript function.
This means if you want to add 3 to `x` and `y` of a vector you can do: `ve2(1, 2).add(3)`. And if you want to add one vector to another you can do: `ve2(1, 2).add(vec(3, 4))`. 
Notice how one function `.add(...)` was used for both vector and scalar operations. Less functions to memorize!

One more unique feature is how accepting the function calls are of their arguments. For example, `ve2(...)` (a function that creates a new vector) can take
two numbers as arguments, an array, another object, another ve2, or a single number (as an angle) as arguments. Most functions accept data in whatever form it is in.
This can help if you have an existing project that uses arrays, but you'd like some of the functions of this library. You can just pass `.add(...)` an array and be on your way.

This library does not attempt to be the most efficient
2D vector implementation in Javascript. However, it is fast enough for most use cases (such as physics for 60 FPS 2D games).

<canvas id="example" width="400" height="200" style="margin: auto auto; display: block; float: right;"></canvas>
<script>
 var canvas = document.getElementById('example'),
     ctx = canvas.getContext('2d'),
     mouse = ve2(0, 0),
     origin = ve2(canvas.width/2, canvas.height/2);

 window.onmousemove = function (e) {
     mouse = ve2(e).sub(canvas.getBoundingClientRect());
 };
 
 ctx.strokeStyle = '#5dc600';
 ctx.lineWidth = 1;

 function loop() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);

     function make(rads, mag) {
         return ve2.fromAngle(rads + mouse.sub(origin).dir(), mag).add(origin);
     }
     
     ctx.beginPath();
     ctx.moveTo(origin.x, origin.y);

     var m = make(0, 100);
     ctx.lineTo(m.x, m.y);
     var l = make(Math.PI/24, 75);
     ctx.lineTo(l.x, l.y);
     var r = make(-Math.PI/24, 75);
     ctx.moveTo(m.x, m.y);
     ctx.lineTo(r.x, r.y);     
     
     ctx.stroke();
     ctx.closePath();
     
     requestAnimationFrame(loop);
 }
 requestAnimationFrame(loop);
</script>
