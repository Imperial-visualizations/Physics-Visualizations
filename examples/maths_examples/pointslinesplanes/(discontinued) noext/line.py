#from org.transcrypt.stubs.browser import __pragma__
from vector import Vector

class Line:
    """Line class for intersections simulation
    @author Nick Metelski
    @since 25.07.17"""
    
    def __init__(self, vec, offset):
        self.vec = Vector(vec).normalize() #normalize direction vector
        self.offset = Vector(offset)
        #minimize the offset to be minimum distance
        #__pragma__('opov')
        self.offset = self.offset - self.vec * self.offset.dot(self.vec)
        #__pragma__('noopov')
        
    def getXYZ(self, layout=None):
        """Generate x,y,z data based on the layout box. Returns tuple (x,y,z).
        @author Nick Metelski
        @since 26.07.17"""
        #TODO import data from layout
        param = [0,1]
        vec = self.vec.vec
        off = self.offset.vec
        x = [off[0]+t*vec[0] for t in param] #generate xpoints
        y = [off[1]+t*vec[1] for t in param] #for y points
        z = [off[2]+t*vec[2] for t in param] #for z points
        return x, y, z

    def goify(self,layout=None):
        """Export the line into graphics dictionary.
        @author Nick Metelski
        @since 26.07.17"""
        x, y, z = self.getXYZ(layout)
        line = {
            'mode': "lines",
            'x': list(x),
            'y': list(y),
            'z': list(z),
            'line': dict(
                color=('rgb(205, 12, 24)'),
                width=10)
        }
        return line
