///// HOW TO USE __utils__.js INCLUDING THE NEW ARROW OBJECT AND QUIVER FUNCTION /////

STEP 1: Include the __utils__.js file in your working directory and include it as a script in your head section (avoid using function names which are listed below).

STEP 2: Begin coding!


///// List of functions and descriptions:

///// COORDINATE SYSTEM CONVERSIONS /////


sp2c(r, theta, phi)
Input: r (float), theta (float), phi (float)
Description: Converts spherical polar coordinates to 3D cartesian coordinates. 
Returns: Array length 3


c2sp(x, y, z)
Input: x (float), y (float), z (float)
Description: Converts 3D cartesian coordinates to spherical polar coordinates.
Returns: Array length 3


p2c(rho, phi)
Input: rho (float), phi (float)
Description: Converts 2D polar coordinates to 2D cartesian coordinates.
Returns: Array length 2


c2p(x, y) 
Input: x (float), y (float)
Description: Converts 2D cartesian coordinates to 2D polar coordinates.
Returns: Array length 2


///// ARROW OBJECT /////

There is an Arrow2D and Arrow3D object, they are very similar and pretty much exactly the same to use.

Arrow2D(u, v, offset=[0,0], width=5, color='rgb(0,0,0)', showlegend=false, ratio=1)
Input: 
	u, v:  x, y components of velocity.
	offset (default origin): Array length 2 indicating offset of arrow.
	width: Float which indicates width of arrow lines drawn.
	color (default black): Colour of the arrow lines. 
	showlegend (default false): Boolean which indicates whether legends of arrows. 			will be shown. 
	ratio (default 1): Float which indicates scale of arrow plotted against actual 			size.


Arrow3D(u, v, w, offset=[0,0,0], width=5, color='rgb(0,0,0)', showlegend=false, ratio=1)
Input: 
	u, v:  x, y components of velocity.
	offset (default origin): Array length 2 indicating offset of arrow
	width: Float which indicates width of arrow lines drawn
	color (default black): Colour of the arrow lines 
	showlegend (default false): Boolean which indicates whether legends of arrows 			will be shown 
	

///// HOW TO USE THE ARROW OBJECT /////

If you want to create and use just a few arrows then it will be easier to create individual arrows and plot.

///// EXAMPLE /////

///// This would create and plot an arrow in a div with id ‘graph’
var my_arrow = new Arrow3D(1, 1, 1, [0,0,0], 4, 'rgb(0,0,0)', true, 0.5)
trace = [my_arrow.data.shaft, my_arrow.data.wings]

// This is how you give your arrows names
my_arrow.data.shaft.name = "Aaron"

// Make sure showlegend is true in layout
layout = {showlegend: true}

Plotly.plot('graph', trace, layout)


///// HOW TO USE THE QUIVER FUNCTION /////

1) In your main JS file define a function which takes in 2/3 arguments ((x,y,z) or (x,y)) depending on the number of dimensions you are working in. Ensure it returns an array or length 2 or 3 which will be your vector field at the point (x,y,z) or (x,y). This will be your vector field function.
 
2) Create arrays X, Y and Z which contain x, y and z values where you would like to place your vector field. (or just X,Y for 2D)

3) Use genPoints3D(X, Y, Z)/genPoints2D(X,Y) to generate an array and store it in a variable such as ‘points’.

4) Use genVel3D(X, Y, Z, your_vector_field_func)/genVel2D(X,Y, vectorField2D, your_vector_field_func) to generate an array and store it in a variable such as ‘vecs’. 

ENSURE THE FUNCTION IS PASSED WITHOUT BRACKETS AT THE END. THIS ENSURES THE FUNCTION WILL ONLY FIRE WHEN TOLD TO.	

5) Use getQuiver2D(points, vecs, width, color, ratio)
/getQuiver3D(points, vecs, width, color, ratio) to return the arrows as a trace to be plotted. 

6) Pick a layout and plot.

AN EXAMPLE OF THE USE OF A QUIVER FUNCTION IS IN THE UTILITIES FOLDER IN test_script.js which can be booted up with the utils_test.html.









