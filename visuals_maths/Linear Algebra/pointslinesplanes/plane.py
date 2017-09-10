"""plane.py"""
import plotly.graph_objs as go
import numpy as np
from .utils import *

class Plane:
    """Planes are defined by their normal and offset vector."""
    
    def __init__(self, normal, offset):
        self.normal = normalize(np.array(normal)) #normalize normal vector
        self.offset = np.array(offset)
        self.offset = np.dot(self.offset,self.normal)*self.normal
        
    def getXYZ(self, xlim=[-1,1], ylim=[-1,1], zlim=[-1,1], n=2):
        """Generate x,y,z data based on the layout box. Returns tuple (x,y,z).
        @author Nick Metelski
        @since 25.07.17"""
        if self.normal[2] == 0: #check if z is zero, then we have to generate x or y from other meshes
            if self.normal[1] == 0: #check if z and y is zero, then we have to generate x from yz mesh
                if self.normal[0] == 0: 
                    return ValueError("Normal vector is zero vector.")
                else:
                    #cannot generate z but can y, try generating y for xz mesh
                    y, z = mesh2d(ylim, zlim, n)
                    x = (np.dot(self.normal,self.offset)-self.normal[1]*y-self.normal[2]*z)/self.normal[0]
            else:
                #cannot generate z but can y, try generating y for xz mesh
                #self.normal[2] = 0.01 # TODO THIS IS VERY CRUDE
                x, z = mesh2d(xlim, zlim, n)
                y = ((np.dot(self.normal,self.offset)
                          - self.normal[0]*x
                          - self.normal[2]*z)
                              / self.normal[1])
        else:
            #try generating z
            x, y = mesh2d(xlim, ylim, n)
            #Generate plane z-values array
            z = (np.dot(self.normal,self.offset)-self.normal[0]*x-self.normal[1]*y)/self.normal[2]
        return [list(i) for i in x],[list(i) for i in y],[list(i) for i in z]

    def goify(self, layout=None):
        """Export the plane into graphics object.
        @author Nick Metelski
        @since 25.07.17"""
        xx,yy,zz = self.getXYZ()
        surf = go.Surface(
            x=xx,
            y=yy,
            z=zz
        )
        return surf
