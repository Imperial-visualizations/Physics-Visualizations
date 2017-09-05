"use strict";
// Tells the browser to enter String Mode. read more on https://johnresig.com/blog/ecmascript-5-strict-mode-json-and-more/
var objcounter = 0;

// Defining Vector class.
function Vector(x,y,z) {
	/*Cartesian coordinates vector, defining basic vector operations (dot product, cross product etc.)*/
	this.x = x;
	this.y = y;
	this.z = z;
	this.isEqualTo = function(other){
		/*Use this to compare two vectors if they are equal. */
		if(!(other instanceof Vector)) {
			throw new Error("Argument error: Cannot compare Vector to no-vector.");
		}
		else {
			if(Math.abs(this.x-other.x)<1e-6 && Math.abs(this.y-other.y)<1e-6 && Math.abs(this.z-other.z)<1e-6) {
				return true;
			}
			else {
				return false;
			}
		}
	}
	this.add = function(other) {
		/*Add *this* Vector to *other* Vector.*/
		if(!(other instanceof Vector)) {
			throw new Error("Argument error: Cannot add vector to non-vector.");
		}
		else{
			return new Vector(this.x+other.x,this.y+other.y,this.z+other.z);
		}
	}
	this.mul = function(num) {
		/* Multiply a vector by a constant. Also, negate the vector by *this.mul(-1)*.*/
		return new Vector(num*this.x,num*this.y,num*this.z);
	}
	this.norm = function() {
		/* Norm of a vector */
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	}
	this.normalize = function() {
		/* Normalize this vector, i.e. change its length to one, preserving direction. */
		var norm = this.norm()
		if(norm == 0) {
			throw new Error("Inputted vector is zero vector; cannot normalize");
		}
		else {
			return new Vector(this.x/norm, this.y/norm, this.z/norm);
		}
	}
	this.dot = function(other) {
		/* Dot product *this* . *other* */
		if(!(other instanceof Vector)) {
			throw new Error("Argument error: Cannot take dot product with non-Vector.")
		}
		return this.x*other.x + this.y*other.y + this.z*other.z;
	}
	this.cross = function(other) {
		/* Cross product *this* x *other* */
		if(!(other instanceof Vector)) {
			throw new Error("Argument error: Cannot take cross product with non-Vector.")
		}
		return new Vector(this.y*other.z-this.z*other.y, this.z*other.x-this.x*other.z, this.x*other.y-this.y*other.x);
	}
	this.toString = function() {
		return "Vector("+this.x.toFixed(3)+","+this.y.toFixed(3)+","+this.z.toFixed(3)+")";
	}
}
const ZERO_VECTOR = new Vector(0.0,0.0,0.0); //Zero vector for later usew


// Defining classes for point, line, and plane.
function Point(pos) {
	this.assignPos = function(pos) {
		/* Points are defined by their position *pos* in 3d. */
		if(!(pos instanceof Vector)) {
			throw new Error("Argument error: Point(...) 'pos' argument should be Vector.");
		}
		else {
			this.pos = pos;
			this.usrPos = pos;
		}
	}
	this.assignPos(pos);
	this.goify = function(layout) {
		if(layout!=undefined) {
			/* Cast this Point object to Plotly graphic object. */
			if(pos.x < layout.scene.xaxis.range[0] || pos.x > layout.scene.xaxis.range[1] || pos.y < layout.scene.yaxis.range[0] || pos.y > layout.scene.yaxis.range[1] || pos.z < layout.scene.zaxis.range[0] || pos.z > layout.scene.zaxis.range[1]) {
				// trying to display Point out of canvas
				// TODO maybe some dynamic alignment of layout in that case?
				// for now: do nothing
			}
		}
		return {
			name:this.toString(),
			mode:"markers",
			type:"scatter3d",
			x:[this.pos.x],
			y:[this.pos.y],
			z:[this.pos.z],
			plotId: this.plotId //for internal use, to keep track of what is what
		}
	}
	this.toString = function() {
		if(this.hasOwnProperty('name')) {
			return this.type.charAt(0).toUpperCase() + this.type.slice(1) + " "+this.name;
		}
		else {
			return "Point(pos="+this.pos+")";
		}
	}
	this.describe = function() {
		//obsolete, but will be kept here
		var ans = this.toString() + " is a Point.\n" + "Its position vector is: " + this.pos.toString() + "\n";
		return ans;
	}
	this.id = (objcounter++) + "point"; //assign id
	this.plotId = this.id; //assign plotId for use in fast-plotter.js
	console.log("New Alg Object: ", this); //notify when created
	this.type = "point";
}

function Line(dir,off) {
	/* Lines are defined by direction vector and offset vector. */
	// keep track of original user input
	this.assignDir = function(dir) {
		this.usrDir=dir;
		if(!(dir instanceof Vector)) {
			throw new Error("Argument error: Line(...) 'dir' argument should be Vector.");
		}
		else {
			// normalize direction vector
			this.dir = dir.normalize();
		}
	}
	this.assignOff = function(off){
		this.usrOff=off;
		if(!(off instanceof Vector)) {
			throw new Error("Argument error: Line(...) 'off' argument should be Vector.");
		}
		else {
			// offset is changed to such that is the closest to origin
			this.off = off.add((this.dir.mul(off.dot(this.dir))).mul(-1));
		}
	}
	this.assignDir(dir);
	this.assignOff(off);
	this.goify = function(layout){
		var xyz = {x: [], y: [], z: []};
		// dynamically generate data depending on layout
		var param_top; //parameters from which to which data will be generated
		var param_bot;
		if(layout != undefined) {
			if(this.dir.x == 0) {
				//check that the line goes in x dir
				xyz.x = [this.off.x, this.off.x];
				if(this.dir.y == 0) {
					//check that the line goes in y dir
					xyz.y = [this.off.y, this.off.y];
					if(this.dir.z == 0) {
						//check that the line goes in z dir
						xyz.z = [this.off.z, this.off.z];
					}
					else {
						param_top = (layout.scene.zaxis.range[1] - this.off.z)/this.dir.z
						param_bot = (layout.scene.zaxis.range[0] - this.off.z)/this.dir.z
					}
				}
				else {
					param_top = (layout.scene.yaxis.range[1] - this.off.y)/this.dir.y
					param_bot = (layout.scene.yaxis.range[0] - this.off.y)/this.dir.y
				}
			}
			else {
				param_top = (layout.scene.xaxis.range[1] - this.off.x)/this.dir.x
				param_bot = (layout.scene.xaxis.range[0] - this.off.x)/this.dir.x
			}
		}
		else {
			//default to (0,1) as parameters for the line in case layout undefined
			param_top=1;
			param_bot=0;
		}
		xyz.x = [this.off.x + this.dir.x*param_bot, this.off.x + this.dir.x*param_top];
		xyz.y = [this.off.y + this.dir.y*param_bot, this.off.y + this.dir.y*param_top];
		xyz.z = [this.off.z + this.dir.z*param_bot, this.off.z + this.dir.z*param_top];

		return {
			name: this.toString(),
			type:"scatter3d",
			mode: "lines",
			line: {
				width: 10
			},
			x:xyz.x,
			y:xyz.y,
			z:xyz.z,
			plotId: this.plotId
		}
	}
	this.toString = function() {
		if(this.hasOwnProperty('name')) {
			return this.type.charAt(0).toUpperCase() + this.type.slice(1) + " "+this.name;
		}
		else {
			//use usrDir and usrOff
			return "Line(dir="+this.usrDir+",off="+this.usrOff+")";
		}
	}
	this.describe = function() {
		var ans = this.toString() + " is a Line.\n"
		+ "Its direction vector is: " + this.usrDir.toString() + ".\n"
		+ "Its offset vector is: " + this.usrOff.toString() + ".\n";
		return ans;
	}
	this.id = (objcounter++) + "line";
	this.plotId = this.id; //assign plotId for use in fast-plotter.js
	console.log("New Alg Object: ", this); //notify of new object creation
	this.type = "line";
}

function Plane(normal,off) {
	/* Planes are defined by a normal and any point lying on it. */
	// keep track of user input
	this.assignNormal = function(normal) {
		this.usrNormal = normal;
		if(!(normal instanceof Vector)) {
			throw new Error("Argument error: Plane(...) 'normal' argument should be Vector.");
		}
		else {
			// normalize the normal vector
			this.normal = normal.normalize();
		}
	}
	this.assignOff = function(off) {
		this.usrOff = off;
		if(!(off instanceof Vector)) {
			throw new Error("Argument error: Plane(...) 'off' argument should be Vector.");
		}
		else {
			// select the closest one to the origin
			this.off = this.normal.mul(off.dot(this.normal));
		}
	}
	this.assignNormal(normal);
	this.assignOff(off);
	this.XYZ = function(layout) {
		// a couple utils functions
		function mesh2d(xlim, ylim) {
			var xx = [[xlim[0],xlim[1]],[xlim[0],xlim[1]]];
			var yy = [[ylim[0],ylim[0]],[ylim[1],ylim[1]]];
			return [xx,yy];
		}
		function calc(x, y, z, normal, offset) {
			var ans = normal.dot(offset) - normal.x*x - normal.y*y - normal.z*z;
			return ans
		}
		if(layout!=undefined) {
			var xlim = layout.scene.xaxis.range;
			var ylim = layout.scene.yaxis.range;
			var zlim = layout.scene.zaxis.range;
		}
		else {
			//default values
			var xlim = [-1,1];
			var ylim = [-1,1];
			var zlim = [-1,1];
		}
		//rename things for convenience
		var n = this.normal;
		var off = this.off;
		if(n.z == 0) {
			if(n.y == 0) {
				if(n.x == 0) {
					// this won't happen as normal vector must be normalized (so non-zero)
					// but throw an error anyway
					throw new Error("Normal vector is zero vector.")
				}
				else {
					console.log("plane goify: no z or y direction in normal vector")
					//cannot generate z or y but can x, try generating x for yz mesh
					var mesh = mesh2d(ylim,zlim)
					var yy = mesh[0];
					var zz = mesh[1];
					var xx = [[0,0],[0,0]];
					xx[0][0] = calc(0, yy[0][0], zz[0][0], n, off)/n.x;
					xx[0][1] = calc(0, yy[0][1], zz[0][1], n, off)/n.x;
					xx[1][0] = calc(0, yy[1][0], zz[1][0], n, off)/n.x;
					xx[1][1] = calc(0, yy[1][1], zz[1][1], n, off)/n.x;
				}
			}
			else {
				console.log("plane goify: no z direction in normal vector")
				//cannot generate z but can y, try generating y for xz mesh
				var mesh = mesh2d(xlim,zlim)
				var xx = mesh[0];
				var zz = mesh[1];
				var yy = [[0,0],[0,0]]
				yy[0][0] = calc(xx[0][0], 0, zz[0][0], n, off)/n.y;
				yy[0][1] = calc(xx[0][1], 0, zz[0][1], n, off)/n.y;
				yy[1][0] = calc(xx[1][0], 0, zz[1][0], n, off)/n.y;
				yy[1][1] = calc(xx[1][1], 0, zz[1][1], n, off)/n.y;
			}
		}
		else {
			console.log("plane goify: z generation (usual case)")
			//try generating z
			var mesh = mesh2d(xlim,ylim)
			var xx = mesh[0];
			var yy = mesh[1];
			var zz = [[0,0],[0,0]]
			zz[0][0] = calc(xx[0][0], yy[0][0], 0, n, off)/n.z;
			zz[0][1] = calc(xx[0][1], yy[0][1], 0, n, off)/n.z;
			zz[1][0] = calc(xx[1][0], yy[1][0], 0, n, off)/n.z;
			zz[1][1] = calc(xx[1][1], yy[1][1], 0, n, off)/n.z;
		}
		return {x: xx, y: yy, z: zz};
	}

	this.goify = function(layout) {
		var xyz = this.XYZ(layout);
		return {
			name:this.toString(),
			type:"surface",
			showscale:false,
			x:xyz.x,
			y:xyz.y,
			z:xyz.z,
			plotId: this.plotId
		}
	}
	this.toString = function() {
		if(this.hasOwnProperty('name')) {
			return this.type.charAt(0).toUpperCase() + this.type.slice(1) + " "+this.name;
		}
		else {
			return "Plane(normal="+this.usrNormal+",off="+this.usrOff+")";
		}
	}
	this.describe = function() {
		//obbsolete, but will be kept here
		var ans = this.toString() + " is a Plane.\n"
		+ "Its normal vector is: " + this.usrNormal.toString() + ".\n"
		+ "Its offset vector is: " + this.usrOff.toString() + ".\n";
		return ans;
	}
	this.id = (objcounter++)+"plane";
	this.plotId = this.id; //assign plotId for use in fast-plotter.js
	console.log("New Alg Object: ", this);
	this.type = "plane";
}


// Defining Customized Error Types
function NoIntersectionError(message){
	this.message = message;
}
NoIntersectionError.prototype = new Error();

function NotImplementedError(message){
	this.message = message;
}
NotImplementedError.prototype = new Error();

// Calculate intersections between 2 objects.
function intersect(obj1, obj2) {
	var ans;
	//plane-plane
	if(obj1 instanceof Plane && obj2 instanceof Plane) {
		ans = _plane_plane_intersect(obj1,obj2);
	}
	//plane-line
	else if(obj1 instanceof Plane && obj2 instanceof Line) {
		ans = _plane_line_intersect(obj1,obj2);
	}
	else if(obj1 instanceof Line && obj2 instanceof Plane) {
		ans = _plane_line_intersect(obj2,obj1);
	}
	//plane-point
	else if(obj1 instanceof Plane && obj2 instanceof Point) {
		ans = _plane_point_intersect(obj1,obj2);
	}
	else if(obj1 instanceof Point && obj2 instanceof Plane) {
		ans = _plane_point_intersect(obj2,obj1);
	}
	//line-line
	else if(obj1 instanceof Line && obj2 instanceof Line) {
		ans = _line_line_intersect(obj1,obj2);
	}
	//line-point
	else if(obj1 instanceof Line && obj2 instanceof Point) {
		ans = _line_point_intersect(obj1,obj2);
	}
	else if(obj1 instanceof Point && obj2 instanceof Line) {
		ans = _line_point_intersect(obj2,obj1);
	}
	//pointpoint
	else if(obj1 instanceof Point && obj2 instanceof Point) {
		ans = _point_point_intersect(obj1,obj2);
	}
	else {
		throw new TypeError("Argument error: intersect can only take Point, Line and Plane arguments.");
	}
	ans.name = obj1.name+" & "+obj2.name;
	return ans;
}

function intersectList(algObjsArray) {
	// Intersect many elements together.
	console.log("new new version intersectList called");
	try {
		var isec = intersect(algObjsArray[0],algObjsArray[1]);
	}
	catch(err) {
		console.log(err)
		throw err;
	}
	if(algObjsArray.length > 2) {
		for(var idx=1;idx<algObjsArray.length;idx++) {
			for(var other=idx+1;other<algObjsArray.length;other++) {
				try {
					isec = intersect(isec,algObjsArray[other]);
					isec.name += " & "+algObjsArray[other].name;
				}
				catch(err) {
					console.log(err)
					throw err;
				}
			}
		}
	}
	isec.name = "("+isec.name+")"
	return isec;
}

function _point_point_intersect(obj1, obj2) {
	if(!(obj1 instanceof Point) || !(obj2 instanceof Point)) {
		throw new TypeError("Argument error: _point_point_intersect can only take arguments of type Point.")
	}
	else {
		//renaming variables
		var pos1 = obj1.pos;
		var pos2 = obj2.pos;
		if(pos1.isEqualTo(pos2)) {
			// Point of intersection found
			return new Point(new Vector(pos1.x,pos1.y,pos1.z));
		}
		else {
			//no intersection, sorry
			throw new NoIntersectionError("Points do not intersect.")
		}
	}
}

function _line_point_intersect(obj1, obj2) {
	if(!(obj1 instanceof Line) || !(obj2 instanceof Point)) {
		throw new TypeError("Argument error: _point_point_intesect can only take arguments of type Point.")
	}
	else {
		//renaming
		var line = obj1;
		var point = obj2;
		//algebra
		/*
		Idea:
		\begin{itemize}
		\item line: $\vec{r}_{l} = \vec{d}_{l} + \vec{v}_{l} t_{l}, t_{l} \in R$
		\item point: $\vec{r}_{p} = \vec{d}_{p}$
		\item intersection condition: $\vec{v}_{l} \times (\vec{d}_{p}-\vec{d}_{l}) = 0$
		\item intersection point: $\vec{r}_{i} = ...$, any point on the line, eg. $\vec{r}_{i} = \vec{d}_{l}$
		\end{itemize}
		*/
		var off_diff = point.pos.add( line.off.mul(-1) );
		var cross = line.dir.cross(off_diff);
		if(cross.isEqualTo(ZERO_VECTOR)) {
			return new Point(new Vector(point.pos.x,point.pos.y,point.pos.z));
		}
		else {
			throw new NoIntersectionError(""+point.toString()+" does not intersect "+line.toString()+".")
		}
	}
}

function _line_line_intersect(obj1, obj2) {
	if(!(obj1 instanceof Line) || !(obj2 instanceof Line)) {
		throw new Error("Argument error: _line_line_intersect can only take arguments of type Point.")
	}
	else {
		/*
		Idea:
		\begin{itemize}
		\item line 1: $\vec{r}_{1} = \vec{d}_{1} + \vec{v}_{1} t_{1}, t_{1} \in R$
		\item line 2: $\vec{r}_{2} = \vec{d}_{2} + \vec{v}_{2} t_{2}, t_{2} \in R$
		\item intersection condition: distance between lines is zero
		\item intersection point: found by vector algebra
		\end{itemize}
		*/
		var line1 = obj1;
		var line2 = obj2;
		var cross = line1.dir.cross(line2.dir); //perpendicular to both lines
		if(cross.isEqualTo(ZERO_VECTOR)) {
			//lines parallel
			try {
				intersect(line2, new Point(line1.off)); //this will throw NoIntersectionError if they are not identical
				return new Line(line1.dir,line1.off);
			}
			catch(err) {
				if(err instanceof NoIntersectionError) {
					throw new NoIntersectionError(""+line1.toString()+" and "+ toString() + " are parallel, not identical.")
				}
				else {
					throw err;
				}
			}
		}
		else {
			//not parallel
			//renaming
			var v1 = line1.dir;
			var v2 = line2.dir;
			var d1 = line1.off;
			var d2 = line2.off;
			var s = d2.add(d1.mul(-1)); //$\vec{s} = \vec{d}_{2} - \vec{d}_{1}$ = sample vector
			var dist = Math.abs(s.dot(cross)); //distance between lines
			//console.log("distance between lines: ", dist)
			if (Math.abs(dist) < 1e-6) {
				if(s.isEqualTo(ZERO_VECTOR)) {
					// Sample is zero, so this must be the intersection
					return new Point(d2);
				}
				//algebra
				var n = (v2.cross(v1)).normalize();
				var l = (s.cross(v1)).norm();
				var l_vec = (v1.cross(n)).mul(l);
				var param = (l*l)/(v2.dot(l_vec));
				return new Point(d2.add(v2.mul(param)));
			}
			else {
				throw new NoIntersectionError(""+line1.toString()+" and "+ line2.toString() + " are skew.")
			}
		}
	}
}

function _plane_point_intersect(obj1, obj2) {
	if(!(obj1 instanceof Plane) || !(obj2 instanceof Point)) {
		throw new TypeError("Argument error: _plane_point_intesect can only take arguments of type Plane and Point.")
	}
	else {
		var plane = obj1;
		var point = obj2;
		var check = plane.normal.dot(point.pos.add(plane.off.mul(-1)))
		if(Math.abs(check)<1e-6) {
			return new Point(new Vector(point.pos.x,point.pos.y,point.pos.z));
		}
		else {
			throw new NoIntersectionError("" + plane.toString() + " and " + point.toString() + " do not intersect.")
		}
	}
}

function _plane_line_intersect(obj1,obj2) {
	if(!(obj1 instanceof Plane) || !(obj2 instanceof Line)) {
		throw new TypeError("Argument error: _plane_line_intesect can only take arguments of type Plane and Line.")
	}
	else {
		var plane = obj1;
		var line = obj2;
		var check = plane.normal.dot(line.dir);
		if (Math.abs(check) < 1e-6) {
			//plane and line are parallel or overlap
			try {
				//console.log("plane and line - overlap?")
				intersect(new Point(line.off),plane); //this throws NoIntersectionError
				return new Line(line.dir,line.off);
			}
			catch(err) {
				if(err instanceof NoIntersectionError) {
					//console.log("plane and line - no overlap, parallel")
					//do not overlap
					throw new NoIntersectionError(""+plane.toString()+" and " + line.toString() + " are parallel.");
				}
				else {
					console.error(err)
					throw err;
				}
			}
		}
		else {
			//there is an explicit formula for parameter of the line for which intersection is met:
			//$$t = \frac{\vec{n} \cdot (\vec{d_p}-\vec{d_v})}{\vec{n} \cdot \vec{v}}$$,
			//where n is normal to plane, v is line's direction, rp is plane offset, rv is vector offset
			var param = plane.normal.dot(plane.off.add(line.off.mul(-1)))/plane.normal.dot(line.dir);
			return new Point(line.off.add(line.dir.mul(param)));
		}
	}
}
function det(mat) {
	//2x2 matrix determinant
	return mat[0][0]*mat[1][1] - mat[0][1]*mat[1][0];
}
function _plane_plane_intersect(obj1,obj2) {
	if(!(obj1 instanceof Plane) || !(obj2 instanceof Plane)) {
		throw new TypeError("Argument error: _plane_plane_intesect can only take arguments of type Plane and Plane.");
	} else {
		//rename
		var p1 = obj1;
		var p2 = obj2;
		var cross = p2.normal.cross(p1.normal);
		if(cross.isEqualTo(ZERO_VECTOR)) {
			//planes are parallel or overlap
			//if they overlap then the offset of one plane lies on the other
			try {
				var intersection = intersect(new Point(p1.off), p2); //this will throw if no intersection
				return new Plane(p1.normal,p1.off); //planes overlap
			}
			catch(err) {
				if(err instanceof NoIntersectionError) {
					throw new Error("Planes are parallel, do not overlap.");
				}
				else {
					throw err; //generic error; keep as it is
				}
			}
		} else {
			//console.log("plane-plane intersection case")
			//ok, so there is an intersection
			//premise: the line has to intersect at least one of the planes: xy, yz, or xz.

			//we will solve by cramer's rule
			var coeffMatrix_nox = [[p1.normal.y,p1.normal.z],[p2.normal.y,p2.normal.z]];
			var coeffMatrix_noy = [[p1.normal.x,p1.normal.z],[p2.normal.x,p2.normal.z]];
			var coeffMatrix_noz = [[p1.normal.x,p1.normal.y],[p2.normal.x,p2.normal.y]];
			var rhs = [p1.normal.dot(p1.off),p2.normal.dot(p2.off)];
			//try no x
			var determinant = det(coeffMatrix_nox);
			if(determinant != 0 ) {
				//console.log("case no-x")
				var y = det( [[rhs[0],p1.normal.z],[rhs[1],p2.normal.z]] ) / determinant;
				var z = det( [[p1.normal.y,rhs[0]],[p2.normal.y,rhs[1]]] ) / determinant;
				return new Line(cross, new Vector(0,y,z)); //return answer straight away
			} else {
				//no x failed; try no y
				var determinant = det(coeffMatrix_noy);
				if(determinant != 0 ) {
					//console.log("case no-y")
					var x = det( [[rhs[0],p1.normal.z],[rhs[1],p2.normal.z]] ) / determinant;
					var z = det( [[p1.normal.x,rhs[0]],[p2.normal.x,rhs[1]]] ) / determinant;
					return new Line(cross, new Vector(x,0,z)); //return answer
				} else {
					//x and y failed; z must work
					var determinant = det(coeffMatrix_noz);
					if(determinant != 0 ) {
						//console.log("case no-z")
						var x = det( [[rhs[0],p1.normal.y],[rhs[1],p2.normal.y]] ) / determinant;
						var y = det( [[p1.normal.x,rhs[0]],[p2.normal.x,rhs[1]]] ) / determinant;
						return new Line(cross, new Vector(x,y,0)); //return answer
					}
				}
			}
		}
	}
}
