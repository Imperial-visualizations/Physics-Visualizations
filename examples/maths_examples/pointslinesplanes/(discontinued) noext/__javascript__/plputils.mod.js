	__nest__ (
		__all__,
		'plputils', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var close = function (a, b, threshold) {
						if (typeof threshold == 'undefined' || (threshold != null && threshold .hasOwnProperty ("__kwargtrans__"))) {;
							var threshold = 1e-06;
						};
						var N = len (a);
						var ans = list ([]);
						if (N != len (b)) {
							var __except0__ = ValueError ('Dimensions mismatch');
							__except0__.__cause__ = null;
							throw __except0__;
						}
						for (var idx = 0; idx < N; idx++) {
							ans.append (numbersclose (a [idx], b [idx], threshold));
						}
						return ans;
					};
					var numbersclose = function (a, b, threshold) {
						if (typeof threshold == 'undefined' || (threshold != null && threshold .hasOwnProperty ("__kwargtrans__"))) {;
							var threshold = 1e-06;
						};
						return abs (a - b) < threshold;
					};
					__pragma__ ('<all>')
						__all__.close = close;
						__all__.numbersclose = numbersclose;
					__pragma__ ('</all>')
				}
			}
		}
	);
