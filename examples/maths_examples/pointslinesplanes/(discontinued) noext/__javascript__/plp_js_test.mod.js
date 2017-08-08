	(function () {
		var line = {};
		var plane = {};
		var point = {};
		var point_test = function () {
			__nest__ (point, '', __init__ (__world__.point));
			var x = __call__ (float, null, __call__ (document.getElementById, document, 'point_x').value);
			var y = __call__ (float, null, __call__ (document.getElementById, document, 'point_y').value);
			var z = __call__ (float, null, __call__ (document.getElementById, document, 'point_z').value);
			var pt = __call__ (point.Point, point, list ([x, y, z]));
			__call__ (document.getElementById, document, 'point_pos').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'Position', pt.pos);
			__call__ (document.getElementById, document, 'point_getXYZ').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'getXYZ()', __call__ (pt.getXYZ, pt));
			__call__ (document.getElementById, document, 'point_goify').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'goify()', __call__ (pt.goify, pt));
			__call__ (Plotly.plot, Plotly, 'scatter3d', __call__ (pt.goify, pt));
		};
		var line_test = function () {
			__nest__ (line, '', __init__ (__world__.line));
			var vx = __call__ (float, null, __call__ (document.getElementById, document, 'line_dir_x').value);
			var vy = __call__ (float, null, __call__ (document.getElementById, document, 'line_dir_y').value);
			var vz = __call__ (float, null, __call__ (document.getElementById, document, 'line_dir_z').value);
			var ox = __call__ (float, null, __call__ (document.getElementById, document, 'line_off_x').value);
			var oy = __call__ (float, null, __call__ (document.getElementById, document, 'line_off_y').value);
			var oz = __call__ (float, null, __call__ (document.getElementById, document, 'line_off_z').value);
			var lin = __call__ (line.Line, line, list ([vx, vy, vz]), list ([ox, oy, oz]));
			__call__ (document.getElementById, document, 'line_dir').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'Direction', lin.vec);
			__call__ (document.getElementById, document, 'line_off').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'Offset', lin.offset);
			__call__ (document.getElementById, document, 'line_getXYZ').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'getXYZ()', __call__ (lin.getXYZ, lin));
			__call__ (document.getElementById, document, 'line_goify').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'goify()', __call__ (lin.goify, lin));
		};
		var plane_test = function () {
			__nest__ (plane, '', __init__ (__world__.plane));
			var nx = __call__ (float, null, __call__ (document.getElementById, document, 'plane_n_x').value);
			var ny = __call__ (float, null, __call__ (document.getElementById, document, 'plane_n_y').value);
			var nz = __call__ (float, null, __call__ (document.getElementById, document, 'plane_n_z').value);
			var ox = __call__ (float, null, __call__ (document.getElementById, document, 'plane_off_x').value);
			var oy = __call__ (float, null, __call__ (document.getElementById, document, 'plane_off_y').value);
			var oz = __call__ (float, null, __call__ (document.getElementById, document, 'plane_off_z').value);
			var pl = __call__ (plane.Plane, plane, list ([nx, ny, nz]), list ([ox, oy, oz]));
			__call__ (document.getElementById, document, 'plane_normal').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'Normal', pl.normal);
			__call__ (document.getElementById, document, 'plane_off').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'Offset', pl.offset);
			__call__ (document.getElementById, document, 'plane_getXYZ').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'getXYZ()', __call__ (pl.getXYZ, pl));
			__call__ (document.getElementById, document, 'plane_goify').innerHTML = __call__ ('{}: {}'.format, '{}: {}', 'goify()', __call__ (pl.goify, pl));
		};
		__pragma__ ('<use>' +
			'line' +
			'plane' +
			'point' +
		'</use>')
		__pragma__ ('<all>')
			__all__.line_test = line_test;
			__all__.plane_test = plane_test;
			__all__.point_test = point_test;
		__pragma__ ('</all>')
	}) ();
