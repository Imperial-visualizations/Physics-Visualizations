import plotly.graph_objs as go
import numpy as np
from .utils import *

class Line:
    """Line class for intersections simulation
    @author Nick Metelski
    @since 25.07.17"""
    
    def __init__(self, vec, offset):
        self.vec = normalize(np.array(vec)) #normalize direction vector
        self.offset = np.array(offset) #cast to numpy array
        #minimize the offset to be minimum distance
        self.offset = self.offset - (np.dot(self.offset,self.vec) * self.vec)
    
    def getXYZ(self, layout=None):
        """Generate x,y,z data based on the layout box. Returns tuple (x,y,z).
        @author Nick Metelski
        @since 26.07.17"""
        #TODO import data from layout
        t = np.linspace(-10,10,10) #the parameter
        xx = self.offset[0]+t*self.vec[0] #generate xpoints
        yy = self.offset[1]+t*self.vec[1] #for y points
        zz = self.offset[2]+t*self.vec[2] #for z points
        return xx, yy, zz

    def goify(self,layout=None):
        """Export the line into graphics object
        @author Nick Metelski
        @since 26.07.17"""
        xx, yy, zz = self.getXYZ()
        line = go.Scatter3d(
            mode="lines",
            x=list(xx),
            y=list(yy),
            z=list(zz),
            line = dict(
                color = ('rgb(205, 12, 24)'),
                width = 10)
        )
        return line
