"""point.py"""
import plotly.graph_objs as go
import numpy as np
from .utils import *

class Point:
    """Point class to make returns from intersections more reasonable.
    @author Nick
    @since 25.07.17"""
    def __init__(self,position):
        self.pos = np.array(position)
        
    def getXYZ(self, layout=None):
        """Generate x,y,z data based on the layout box. Returns tuple (x,y,z).
        @author Nick Metelski
        @since 27.07.17"""
        return np.array([self.pos[0]]), np.array([self.pos[1]]), np.array([self.pos[2]])
    
    def goify(self):
        """Transform a point into graphics object (go).
        @author Nick Metelski
        @since 25.07.17"""
        pt = go.Scatter3d(
            mode="markers",
            x=[self.pos[0]],
            y=[self.pos[1]],
            z=[self.pos[2]]
        )
        return pt
