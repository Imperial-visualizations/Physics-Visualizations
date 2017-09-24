	__nest__ (
		__all__,
		'line', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var Vector = __init__ (__world__.vector).Vector;
					var Line = __class__ ('Line', [object], {
						get __init__ () {return __get__ (this, function (self, vec, offset) {
							self.vec = Vector (vec).normalize ();
							self.offset = Vector (offset);
							self.offset = __sub__ (self.offset, __mul__ (self.vec, __call__ (self.offset.dot, self.offset, self.vec)));
						});},
						get getXYZ () {return __get__ (this, function (self, layout) {
							if (typeof layout == 'undefined' || (layout != null && layout .hasOwnProperty ("__kwargtrans__"))) {;
								var layout = null;
							};
							var param = list ([0, 1]);
							var vec = self.vec.vec;
							var off = self.offset.vec;
							var x = function () {
								var __accu0__ = [];
								var __iterable0__ = param;
								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
									var t = __iterable0__ [__index0__];
									__accu0__.append (off [0] + t * vec [0]);
								}
								return __accu0__;
							} ();
							var y = function () {
								var __accu0__ = [];
								var __iterable0__ = param;
								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
									var t = __iterable0__ [__index0__];
									__accu0__.append (off [1] + t * vec [1]);
								}
								return __accu0__;
							} ();
							var z = function () {
								var __accu0__ = [];
								var __iterable0__ = param;
								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
									var t = __iterable0__ [__index0__];
									__accu0__.append (off [2] + t * vec [2]);
								}
								return __accu0__;
							} ();
							return tuple ([x, y, z]);
						});},
						get goify () {return __get__ (this, function (self, layout) {
							if (typeof layout == 'undefined' || (layout != null && layout .hasOwnProperty ("__kwargtrans__"))) {;
								var layout = null;
							};
							var __left0__ = self.getXYZ (layout);
							var x = __left0__ [0];
							var y = __left0__ [1];
							var z = __left0__ [2];
							var line = dict ({'mode': 'lines', 'x': list (x), 'y': list (y), 'z': list (z), 'line': dict (__kwargtrans__ ({color: 'rgb(205, 12, 24)', width: 10}))});
							return line;
						});}
					});
					__pragma__ ('<use>' +
						'vector' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Line = Line;
						__all__.Vector = Vector;
					__pragma__ ('</all>')
				}
			}
		}
	);
