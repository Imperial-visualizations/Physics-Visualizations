"use strict";
function Vector(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.norm = function() {
		/* Norm of a vector */
		return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
	}
	this.dot = function(other) {
		/* Dot product this . other */
		return this.x*other.x+this.y*other.y+this.z*other.z;
	}
	this.cross = function(other) {
		/* Cross product this x other */
		return new Vector(this.y*other.z-this.z*other.y,this.x*other.z-this.z*other.z,this.x*other.y-this.y*other.x);
	}
	this.toString = function(){
		return "Vector("+this.x+","+this.y+","+this.z+")";
	}
}

function Point(pos) {
	//pos of type Vector
	this.x = pos.x;
	this.y = pos.y;
	this.z = pos.z;
}

function Line(dir,off) {
	this.dir = dir;
	this.off = off;
}

function Plane(normal,off) {
	this.normal = normal;
	this.off = off;
}

function calc() {
	var ix = document.getElementById("ix").value
	var iy = document.getElementById("iy").value
	var iz = document.getElementById("iz").value
	var vec1 = new Vector(ix,iy,iz);
	document.getElementById("out1").innerHTML = vec1.toString();
}
