"""
Basic packaged used for linear algebra visualizations for plotly. When importing, import as plp.

This package supplements Point, Line and Plane classes. All of these provide .goify(plotly_layout) methods to export them as go objects for plotly use. These go objects are easily serializable and can be dumped using json.dump(..).

Usage example:
- Use this to import Point, Line and Plane
    from pointslinesplanes import *
- Or this for more fined control:
    import pointslinesplanes as plp

Example:
if __name__ == '__main__':
    line = plp.Line([1,2,3],[2,3,2])
    plane = plp.Plane([1,2,3],[2,2,3])    
    objs = [line, plane]

    #export into graphics objects and plot
    data = [obj.goify() for obj in objs]
    plotly.plot(data)
"""

from .plane import Plane
from .line import Line
from .point import Point

__all__ = ['Point','Line','Plane']
