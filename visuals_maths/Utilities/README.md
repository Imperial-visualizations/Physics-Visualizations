# Quick Starter Guide: __utils__.js including the new Arrow object and Quiver function

1. Include the [__utils__.js](./__utils__.js) file in your working directory and include it as a script in your head section (avoid using function names which are listed below).
2. Begin coding!

## Functionality of the module

### Coordinate system conversions

> ```javascript
> sp2c(r, theta, phi)
> ```
> Input: 
> * r (float)
> * theta (float)
> * phi (float)
>
> Converts spherical polar coordinates to 3D cartesian coordinates. 
>
> Returns:
> * Array length 3, format [x,y,z]

> ```javascript
> c2sp(x, y, z)
> ```
> Input: 
> * x (float)
> * y (float)
> * z (float)
>
> Converts 3D cartesian coordinates to spherical polar coordinates.
>
> Returns:
> * Array length 3, format [r,theta,phi] (theta - polar)

> ```javascript
> p2c(rho, phi)
> ```
> Input:
> * rho (float)
> * phi (float)
> 
> Converts 2D polar coordinates to 2D cartesian coordinates.
>
> Returns:
> * Array length 2, format [x,y]

> ```javascript
> c2p(x, y) 
> ```
> Input:
> * x (float)
> * y (float)
>
> Converts 2D cartesian coordinates to 2D polar coordinates.
>
> Returns: 
> * Array length 2, format [rho,phi]

### Arrow object
#### Reference
There are Arrow2D and Arrow3D object, they are very similar and pretty much exactly the same to use.

> ```javascript
> Arrow2D(u, v, offset=[0,0], width=5, color='rgb(0,0,0)', showlegend=false, ratio=1)
> ```
> Input: 
> *	u, v:  x, y components of velocity.
> *	offset (default origin): Array length 2 indicating offset of arrow.
> *	width: Float which indicates width of arrow lines drawn.
> *	color (default black): Colour of the arrow lines. 
> *	showlegend (default false): Boolean which indicates whether legends of arrows will be shown. 
> *	ratio (default 1): Float which indicates scale of arrow plotted against actual size.


> ```javascript
> Arrow3D(u, v, w, offset=[0,0,0], width=5, color='rgb(0,0,0)', showlegend=false, ratio=1)
> ```
> Input: 
> *	u, v:  x, y components of velocity.
> *	offset (default origin): Array length 2 indicating offset of arrow
> *	width: Float which indicates width of arrow lines drawn
> *	color (default black): Colour of the arrow lines 
> *	showlegend (default false): Boolean which indicates whether legends of arrows will be shown 
	
#### Usage example
If you want to create and use just a few arrows then it will be easier to create individual arrows and plot.
```javascript
// This would create and plot an arrow in a div with id ‘graph’
var my_arrow = new Arrow3D(1, 1, 1, [0,0,0], 4, 'rgb(0,0,0)', true, 0.5)
trace = [my_arrow.data.shaft, my_arrow.data.wings]

// This is how you give your arrows names
my_arrow.data.shaft.name = "Aaron"

// Make sure showlegend is true in layout
layout = {showlegend: true}

Plotly.plot('graph', trace, layout)
```

### HowTo: Quiver function
1. In your main JS file define a function which takes in 2/3 arguments ((x,y,z) or (x,y)) depending on the number of dimensions you are working in. Ensure it returns an array or length 2 or 3 which will be your vector field at the point (x,y,z) or (x,y). This will be your vector field function.
2. Create arrays X, Y and Z which contain x, y and z values where you would like to place your vector field. (or just X,Y for 2D)
3. Use genPoints3D(X, Y, Z)/genPoints2D(X,Y) to generate an array and store it in a variable such as ‘points’.
4. Use genVel3D(X, Y, Z, your_vector_field_func)/genVel2D(X,Y, vectorField2D, your_vector_field_func) to generate an array and store it in a variable such as ‘vecs’. **MAKE SURE THE FUNCTION IS PASSED WITHOUT BRACKETS AT THE END. THIS ENSURES THE FUNCTION WILL ONLY FIRE WHEN TOLD TO.**

5. Use getQuiver2D(points, vecs, width, color, ratio)
/getQuiver3D(points, vecs, width, color, ratio) to return the arrows as a trace to be plotted. 

6. Pick a layout and plot.

An example of the use of a Quiver function is in the utilities folder in [test_script.js](./test_script.js) which can be booted up with the [utils_test.html](./utils_test.html).









