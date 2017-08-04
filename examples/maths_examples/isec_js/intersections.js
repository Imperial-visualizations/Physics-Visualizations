"use strict";
function Vector(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.add = function(other) {
		if(!(other instanceof Vector)) {
			throw new Error("Argument error: Cannot add vectors.");
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
		return "Vector("+this.x+","+this.y+","+this.z+")";
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
}

function Plane(normal,off) {
	this.normal = normal;
	this.off = off;
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
		if(1==1) {
			//TODO here
		}
		else {
			throw Error("Points and Line do not intersect.")
		}
	}
}
