"use strict";
var objcounter = 0;
function Vector(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.allclose = function(other){
		if(!(other instanceof Vector)) {
			throw new Error("Argument error: Cannot compare Vector to no-vector.");
		}
		else {
			if(this.x == other.x && this.y == other.y && this.z == other.y) {
				return true;
			}
			else {
				return false;
			}
		}
	}
	this.add = function(other) {
		if(!(other instanceof Vector)) {
			throw new Error("Argument error: Cannot add vector to non-vector.");
		}
		else{
			return new Vector(this.x+other.x,this.y+other.y,this.z+other.z);
		}
	}
	this.mul = function(num) {
		return new Vector(num*this.x,num*this.y,num*this.z);
	}
	this.norm = function() {
		/* Norm of a vector */
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	}
	this.normalize = function() {
		/* Normalize this vector, i.e. change its length to one preserving direction. */
		var norm = this.norm()
		if(norm == 0) {
			throw new Error("Inputted vector is zero vector; cannot normalize");
		}
		else {
			return new Vector(this.x/norm, this.y/norm, this.z/norm);
		}
	}
	this.dot = function(other) {
		/* Dot product this . other */
		if(!(other instanceof Vector)) {
			throw new Error("Argument error: Cannot take dot product.")
		}
		return this.x*other.x+this.y*other.y+this.z*other.z;
	}
	this.cross = function(other) {
		/* Cross product this x other */
		if(!(other instanceof Vector)) {
			throw new Error("Argument error: Cannot take cross product.")
		}
		return new Vector(this.y*other.z-this.z*other.y,this.x*other.z-this.z*other.z,this.x*other.y-this.y*other.x);
	}
	this.toString = function(){
		return "Vector("+this.x.toFixed(3)+","+this.y.toFixed(3)+","+this.z.toFixed(3)+")";
	}
}

function Point(pos) {
	//pos must be type Vector
	if(!(pos instanceof Vector)) {
		throw new Error("Argument error: Point(...) 'pos' argument should be Vector.")
	}
	else {
		this.pos = pos
	}
	this.goify = function(){
		return {
			name:"point",
			mode:"markers",
			type:"scatter3d",
			x:[this.pos.x],
			y:[this.pos.y],
			z:[this.pos.z]
		}
	};
	this.toString = function() {
		return "Point(pos="+this.pos+")";
	}
	this.id = objcounter++;
	console.log(this)
}

function Line(dir,off) {
	// type checks
	if(!(dir instanceof Vector)) {
		throw new Error("Argument error: Line(...) 'dir' argument should be Vector.");
	}
	else {
		this.dir = dir.normalize();
	}
	if(!(off instanceof Vector)) {
		throw new Error("Argument error: Line(...) 'off' argument should be Vector.");
	}
	else {
		var dot = off.dot(this.dir);
		var vec = this.dir.mul(dot);
		var vecneg = vec.mul(-1);
		this.off = off.add(vecneg);
	}
	this.goify = function(){
		return {
			type:"scatter3d",
			mode: "lines",
			name:"line",
			line: {
				width: 10
			},
			x:[this.off.x, this.off.x + this.dir.x],
			y:[this.off.y, this.off.y + this.dir.y],
			z:[this.off.z, this.off.z + this.dir.z]
		}
	}
	this.toString = function() {
		return "Line(dir="+this.dir+",off="+this.off+")";
	}
	this.id = objcounter++;
}

function Plane(normal,off) {
	if(!(normal instanceof Vector)) {
		throw new Error("Argument error: Plane(...) 'normal' argument should be Vector.");
	}
	else {
		this.normal = normal.normalize();
	}
	if(!(off instanceof Vector)) {
		throw new Error("Argument error: Plane(...) 'off' argument should be Vector.");
	}
	else {
		this.off = off;
	}

	this.XYZ = function() {
		function mesh2d(xlim, ylim) {
			var xx = [[xlim[0],xlim[1]],[xlim[0],xlim[1]]];
			var yy = [[ylim[0],ylim[0]],[ylim[1],ylim[1]]];
			return [xx,yy];
		}
		function calc(x, y, z, normal, offset) {
			var ans = normal.dot(offset) - normal.x*x - normal.y*y - normal.z*z;
			return ans
		}
		var xlim = [-1,1];
		var ylim = [-1,1];
		var zlim = [-1,1];
		var n = this.normal;
		var off = this.off;
		if(n.z == 0) {
			if(n.y == 0) {
				if(n.x == 0) {
					throw new Error("Normal vector is zero vector.")
					}
				else {
					//cannot generate z or y but can x, try generating x for yz mesh
					var mesh = mesh2d(ylim,zlim)
					var yy = mesh[0];
					var zz = mesh[1];
					var xx = [[0,0],[0,0]];
					xx[0][0] = calc(0, yy[0][0], zz[0][0], n, off);
					xx[0][1] = calc(0, yy[0][1], zz[0][1], n, off);
					xx[1][0] = calc(0, yy[1][0], zz[1][0], n, off);
					xx[1][1] = calc(0, yy[1][1], zz[1][1], n, off);
				}
			}
			else {
				//cannot generate z but can y, try generating y for xz mesh
				var mesh = mesh2d(xlim,zlim)
				var xx = mesh[0];
				var zz = mesh[1];
				var yy = [[0,0],[0,0]]
				yy[0][0] = calc(xx[0][0], 0, zz[0][0], n, off);
				yy[0][1] = calc(xx[0][1], 0, zz[0][1], n, off);
				yy[1][0] = calc(xx[1][0], 0, zz[1][0], n, off);
				yy[1][1] = calc(xx[1][1], 0, zz[1][1], n, off);
			}
		}
		else {
			//try generating z
			var mesh = mesh2d(xlim,ylim)
			var xx = mesh[0];
			var yy = mesh[1];
			var zz = [[0,0],[0,0]]
			zz[0][0] = calc(xx[0][0], yy[0][0], 0, n, off);
			zz[0][1] = calc(xx[0][1], yy[0][0], 0, n, off);
			zz[1][0] = calc(xx[1][0], yy[0][0], 0, n, off);
			zz[1][1] = calc(xx[1][1], yy[0][0], 0, n, off);
		}
		return {x: xx, y: yy, z: zz};
	}

	this.goify = function() {
		var xyz = this.XYZ();
		return {
			type:"surface",
			x:xyz.x,
			y:xyz.y,
			z:xyz.z
		}
	}
	this.toString = function() {
		return "Plane(normal="+this.normal+",off="+this.off+")";
	}
	this.id = objcounter++;
}

function intersect(obj1, obj2) {
	//plane-plane
	if(obj1 instanceof Plane && obj2 instanceof Plane) {
		return _plane_plane_intersect(obj1,obj2);
	}
	//pointpoint
	if(obj1 instanceof Plane && obj2 instanceof Plane) {
		return _point_point_intersect(obj1,obj2);
	}
}

function _point_point_intersect(obj1, obj2) {
	if(!(obj1 instanceof Point) || !(obj2 instanceof Point)) {
		throw new Error("Argument error: _point_point_intesect can only take arguments of type Point.")
	}
	else {
		if(obj1.x == obj2.x && obj1.y == obj2.y && obj1.z == obj2.z) {
			return new Point({x: obj1.x,y: obj1.y,z: obj1.z});
		}
		else {
			throw Error("Points do not intersect.")
		}
	}
}

function _point_line_intersect(obj1, obj2) {
	if(!(obj1 instanceof Point) || !(obj2 instanceof Line)) {
		throw new Error("Argument error: _point_point_intesect can only take arguments of type Point.")
	}
	else {
		var point = obj1;
		var line = obj2;
		var off_diff = point.pos.add( line.off.mul(-1) );
		var cross = line.dir.cross(off_diff);
		if(cross.allclose(new Vector(0,0,0))) {
			return new Point(line.off);
		}
		else {
			throw new Error("Point does not intersect Line.")
		}
	}
}

function _line_line_intersect(obj1, obj2) {
	if(!(obj1 instanceof Line) || !(obj2 instanceof Line)) {
		throw new Error("Argument error: _point_point_intesect can only take arguments of type Point.")
	}
	else {
		var line1 = obj1;
		var line2 = obj2;
		var cross = line1.dir.cross(line2.dir); //this is normalized
		if(cross.allclose(new Vector(0,0,0))) {
			//lines parallel
			try {
				intersect(line2, new Point(line1.offset)); //this will throw if they are not identical
				return new Line(line1.dir,line1.off);
			}
			catch(err) {
				throw new Error("Line and Line are parallel, not identical.")
			}
		}
		//TODO here
	}
}
