"""point.py"""
from vector import Vector

class Point:
    """Point class to make returns from intersections more reasonable.
    @author Nick
    @since 25.07.17"""
    def __init__(self,position):
        self.pos = Vector(position)
        
    def getXYZ(self, layout=None):
        """Generate x,y,z data based on the layout box. Returns tuple (x,y,z).
        @author Nick Metelski
        @since 27.07.17"""
        pos = self.pos.vec
        return [pos[0]], [pos[1]], [pos[2]]
    
    def goify(self, layout=None):
        """Transform a point into graphics object (go).
        @author Nick Metelski
        @since 25.07.17"""
        x, y, z = self.getXYZ(layout)
        pt = {
            'type': 'scatter3d',
            'mode': 'markers',
            'x': x,
            'y': y,
            'z': z
        }
        return pt
