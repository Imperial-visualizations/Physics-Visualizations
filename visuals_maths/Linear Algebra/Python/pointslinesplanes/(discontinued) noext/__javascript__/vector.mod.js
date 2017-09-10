	__nest__ (
		__all__,
		'vector', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var plputils = {};
					__nest__ (plputils, '', __init__ (__world__.plputils));
					var Vector = __class__ ('Vector', [object], {
						get __init__ () {return __get__ (this, function (self, vec) {
							self.vec = vec;
						});},
						get __add__ () {return __get__ (this, function (self, other) {
							var N = len (self.vec);
							var ans = list ([]);
							if (N != len (other.vec)) {
								var __except0__ = ValueError ('Dimensions mismatch');
								__except0__.__cause__ = null;
								throw __except0__;
							}
							for (var idx = 0; idx < N; idx++) {
								ans.append (self.vec [idx] + other.vec [idx]);
							}
							return Vector (ans);
						});},
						get __sub__ () {return __get__ (this, function (self, other) {
							return self.__add__ (other.__neg__ ());
						});},
						get __neg__ () {return __get__ (this, function (self) {
							var ans = list ([]);
							for (var idx = 0; idx < len (self.vec); idx++) {
								ans.append (-(self.vec [idx]));
							}
							return Vector (ans);
						});},
						get mul () {return __get__ (this, function (self, num) {
							var new_vec = function () {
								var __accu0__ = [];
								var __iterable0__ = self.vec;
								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
									var i = __iterable0__ [__index0__];
									__accu0__.append (num * i);
								}
								return __accu0__;
							} ();
							return Vector (new_vec);
						});},
						get __mul__ () {return __get__ (this, function (self, other) {
							return self.mul (other);
						});},
						get __rmul__ () {return __get__ (this, function (self, other) {
							return self.__mul__ (other);
						});},
						get __repr__ () {return __get__ (this, function (self) {
							return 'Vector: ' + str (self.vec);
						});},
						get dot () {return __get__ (this, function (self, other) {
							var N = len (self.vec);
							var ans = list ([]);
							if (N != len (other.vec)) {
								var __except0__ = ValueError ('Dimensions mismatch');
								__except0__.__cause__ = null;
								throw __except0__;
							}
							for (var idx = 0; idx < N; idx++) {
								ans.append (self.vec [idx] * other.vec [idx]);
							}
							return float (sum (ans));
						});},
						get cross () {return __get__ (this, function (self, other) {
							var a = self.vec;
							var b = other.vec;
							if (len (a) != 3 || len (b) != 3) {
								var __except0__ = ValueError ('Dimensions mismatch: cross product only works in 3d');
								__except0__.__cause__ = null;
								throw __except0__;
							}
							return Vector (list ([a [1] * b [2] - a [2] * b [1], a [0] * b [2] - a [2] * b [0], a [0] * b [1] - a [1] * b [0]]));
						});},
						get normalize () {return __get__ (this, function (self) {
							var magnitude = self.norm ();
							if (plputils.numbersclose (magnitude, 0.0)) {
								var __except0__ = ValueError ('Zero vector cannot be normalized.');
								__except0__.__cause__ = null;
								throw __except0__;
							}
							else {
								return Vector (function () {
									var __accu0__ = [];
									var __iterable0__ = self.vec;
									for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
										var i = __iterable0__ [__index0__];
										__accu0__.append (i / magnitude);
									}
									return __accu0__;
								} ());
							}
						});},
						get norm () {return __get__ (this, function (self) {
							return Math.pow (sum (function () {
								var __accu0__ = [];
								var __iterable0__ = self.vec;
								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
									var i = __iterable0__ [__index0__];
									__accu0__.append (Math.pow (i, 2));
								}
								return __accu0__;
							} ()), 0.5);
						});}
					});
					__pragma__ ('<use>' +
						'plputils' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Vector = Vector;
					__pragma__ ('</all>')
				}
			}
		}
	);
