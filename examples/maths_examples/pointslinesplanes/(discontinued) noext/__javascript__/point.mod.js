	__nest__ (
		__all__,
		'point', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var Vector = __init__ (__world__.vector).Vector;
					var Point = __class__ ('Point', [object], {
						get __init__ () {return __get__ (this, function (self, position) {
							self.pos = Vector (position);
						});},
						get getXYZ () {return __get__ (this, function (self, layout) {
							if (typeof layout == 'undefined' || (layout != null && layout .hasOwnProperty ("__kwargtrans__"))) {;
								var layout = null;
							};
							var pos = self.pos.vec;
							return tuple ([list ([pos [0]]), list ([pos [1]]), list ([pos [2]])]);
						});},
						get goify () {return __get__ (this, function (self, layout) {
							if (typeof layout == 'undefined' || (layout != null && layout .hasOwnProperty ("__kwargtrans__"))) {;
								var layout = null;
							};
							var __left0__ = self.getXYZ (layout);
							var x = __left0__ [0];
							var y = __left0__ [1];
							var z = __left0__ [2];
							var pt = dict ({'type': 'scatter3d', 'mode': 'markers', 'x': x, 'y': y, 'z': z});
							return pt;
						});}
					});
					__pragma__ ('<use>' +
						'vector' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Point = Point;
						__all__.Vector = Vector;
					__pragma__ ('</all>')
				}
			}
		}
	);
