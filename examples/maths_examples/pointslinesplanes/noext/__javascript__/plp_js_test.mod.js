	(function () {
		var line = {};
		var plane = {};
		var point = {};
		var point_test = function () {
			__nest__ (point, '', __init__ (__world__.point));
			var x = float (document.getElementById ('point_x').value);
			var y = float (document.getElementById ('point_y').value);
			var z = float (document.getElementById ('point_z').value);
			var pt = point.Point (list ([x, y, z]));
			document.getElementById ('point_pos').innerHTML = '{}: {}'.format ('Position', pt.pos);
			document.getElementById ('point_getXYZ').innerHTML = '{}: {}'.format ('getXYZ()', pt.getXYZ ());
			document.getElementById ('point_goify').innerHTML = '{}: {}'.format ('goify()', pt.goify ());
		};
		var line_test = function () {
			__nest__ (line, '', __init__ (__world__.line));
			var vx = float (document.getElementById ('line_dir_x').value);
			var vy = float (document.getElementById ('line_dir_y').value);
			var vz = float (document.getElementById ('line_dir_z').value);
			var ox = float (document.getElementById ('line_off_x').value);
			var oy = float (document.getElementById ('line_off_y').value);
			var oz = float (document.getElementById ('line_off_z').value);
			var lin = line.Line (list ([vx, vy, vz]), list ([ox, oy, oz]));
			document.getElementById ('line_dir').innerHTML = '{}: {}'.format ('Direction', lin.vec);
			document.getElementById ('line_off').innerHTML = '{}: {}'.format ('Offset', lin.offset);
			document.getElementById ('line_getXYZ').innerHTML = '{}: {}'.format ('getXYZ()', lin.getXYZ ());
			document.getElementById ('line_goify').innerHTML = '{}: {}'.format ('goify()', lin.goify ());
		};
		var plane_test = function () {
			__nest__ (plane, '', __init__ (__world__.plane));
			var nx = float (document.getElementById ('plane_n_x').value);
			var ny = float (document.getElementById ('plane_n_y').value);
			var nz = float (document.getElementById ('plane_n_z').value);
			var ox = float (document.getElementById ('plane_off_x').value);
			var oy = float (document.getElementById ('plane_off_y').value);
			var oz = float (document.getElementById ('plane_off_z').value);
			var pl = plane.Plane (list ([nx, ny, nz]), list ([ox, oy, oz]));
			document.getElementById ('plane_normal').innerHTML = '{}: {}'.format ('Normal', pl.normal);
			document.getElementById ('plane_off').innerHTML = '{}: {}'.format ('Offset', pl.offset);
			document.getElementById ('plane_getXYZ').innerHTML = '{}: {}'.format ('getXYZ()', pl.getXYZ ());
			document.getElementById ('plane_goify').innerHTML = '{}: {}'.format ('goify()', pl.goify ());
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
