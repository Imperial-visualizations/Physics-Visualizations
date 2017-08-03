	__nest__ (
		__all__,
		'plane', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var Vector = __init__ (__world__.vector).Vector;
					var Plane = __class__ ('Plane', [object], {
						get __init__ () {return __get__ (this, function (self, normal, offset) {
							self.normal = Vector (normal).normalize ();
							self.offset = Vector (offset);
							self.offset = __mul__ (__call__ (self.offset.dot, self.offset, self.normal), self.normal);
						});},
						get getXYZ () {return __get__ (this, function (self, layout) {
							if (typeof layout == 'undefined' || (layout != null && layout .hasOwnProperty ("__kwargtrans__"))) {;
								var layout = null;
							};
							var mesh2d = function (xlim, ylim) {
								var xx = list ([list ([xlim [0], xlim [1]]), list ([xlim [0], xlim [1]])]);
								var yy = list ([list ([ylim [0], ylim [0]]), list ([ylim [1], ylim [1]])]);
								return tuple ([xx, yy]);
							};
							var calc = function (x, y, z, normal, offset) {
								var unknown = ((normal.dot (offset) - normal.vec [0] * x) - normal.vec [1] * y) - normal.vec [2] * z;
								return unknown;
							};
							var xlim = list ([-(1), 1]);
							var ylim = list ([-(1), 1]);
							var zlim = list ([-(1), 1]);
							var n = self.normal;
							var off = self.offset;
							if (n.vec [2] == 0) {
								if (n.vec [1] == 0) {
									if (n.vec [0] == 0) {
										var __except0__ = ValueError ('Normal vector is zero vector.');
										__except0__.__cause__ = null;
										throw __except0__;
									}
									else {
										var __left0__ = mesh2d (ylim, zlim);
										var yy = __left0__ [0];
										var zz = __left0__ [1];
										var xx = list ([list ([null, null]), list ([null, null])]);
										var __iterable0__ = list ([0, 1]);
										for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
											var i = __iterable0__ [__index0__];
											var __iterable1__ = list ([0, 1]);
											for (var __index1__ = 0; __index1__ < __iterable1__.length; __index1__++) {
												var j = __iterable1__ [__index1__];
												xx [i] [j] = calc (0, yy [i] [j], zz [i] [j], n, off);
											}
										}
									}
								}
								else {
									var __left0__ = mesh2d (xlim, zlim);
									var xx = __left0__ [0];
									var zz = __left0__ [1];
									var yy = list ([list ([null, null]), list ([null, null])]);
									var __iterable0__ = list ([0, 1]);
									for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
										var i = __iterable0__ [__index0__];
										var __iterable1__ = list ([0, 1]);
										for (var __index1__ = 0; __index1__ < __iterable1__.length; __index1__++) {
											var j = __iterable1__ [__index1__];
											yy [i] [j] = calc (xx [i] [j], 0, zz [i] [j], n, off);
										}
									}
								}
							}
							else {
								var __left0__ = mesh2d (xlim, ylim);
								var xx = __left0__ [0];
								var yy = __left0__ [1];
								var zz = list ([list ([null, null]), list ([null, null])]);
								var __iterable0__ = list ([0, 1]);
								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
									var i = __iterable0__ [__index0__];
									var __iterable1__ = list ([0, 1]);
									for (var __index1__ = 0; __index1__ < __iterable1__.length; __index1__++) {
										var j = __iterable1__ [__index1__];
										zz [i] [j] = calc (xx [i] [j], yy [i] [j], 0, n, off);
									}
								}
							}
							return tuple ([xx, yy, zz]);
						});},
						get goify () {return __get__ (this, function (self, layout) {
							if (typeof layout == 'undefined' || (layout != null && layout .hasOwnProperty ("__kwargtrans__"))) {;
								var layout = null;
							};
							var __left0__ = self.getXYZ (layout);
							var xx = __left0__ [0];
							var yy = __left0__ [1];
							var zz = __left0__ [2];
							var surf = dict (__kwargtrans__ ({py_metatype: 'surface', x: xx, y: yy, z: zz}));
							return surf;
						});}
					});
					__pragma__ ('<use>' +
						'vector' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Plane = Plane;
						__all__.Vector = Vector;
					__pragma__ ('</all>')
				}
			}
		}
	);
