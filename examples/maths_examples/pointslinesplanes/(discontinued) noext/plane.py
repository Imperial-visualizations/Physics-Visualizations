"""plane.py"""
from org.transcrypt.stubs.browser import __pragma__
from vector import Vector

class Plane:
    """Planes are defined by their normal and offset vector."""
    
    def __init__(self, normal, offset):
        self.normal = Vector(normal).normalize() #normalize normal vector
        self.offset = Vector(offset)
        __pragma__('opov')
        self.offset = self.offset.dot(self.normal)*self.normal
        __pragma__('noopov')
        
    def getXYZ(self, layout=None):
        """Generate x,y,z data based on the layout box. Returns tuple (x,y,z).
        @author Nick Metelski
        @since 25.07.17"""
        def mesh2d(xlim, ylim):
            xx = [[xlim[0],xlim[1]],
                  [xlim[0],xlim[1]]]
            yy = [[ylim[0],ylim[0]],
                  [ylim[1],ylim[1]]]
            return xx,yy
        def calc(x, y, z, normal, offset):
            unknown = normal.dot(offset) - normal.vec[0]*x - normal.vec[1]*y - normal.vec[2]*z
            return unknown
            
        xlim = [-1,1]
        ylim = [-1,1]
        zlim = [-1,1]
        n = self.normal
        off = self.offset
        
        if n.vec[2] == 0:
            if n.vec[1] == 0:
                if n.vec[0] == 0:
                    raise ValueError("Normal vector is zero vector.")
                else:
                    #cannot generate z or y but can x, try generating x for yz mesh
                    yy, zz = mesh2d(ylim, zlim)
                    xx = [[None,None],[None,None]]
                    for i in [0,1]:
                        for j in [0,1]:
                            xx[i][j] = calc(0, yy[i][j], zz[i][j], n, off)
            else:
                #cannot generate z but can y, try generating y for xz mesh
                xx, zz = mesh2d(xlim, zlim)
                yy = [[None,None],[None,None]]
                for i in [0,1]:
                    for j in [0,1]:
                        yy[i][j] = calc(xx[i][j], 0, zz[i][j], n, off)
        else:
            #try generating z
            xx, yy = mesh2d(xlim, ylim)
            zz = [[None,None],[None,None]]
            for i in [0,1]:
                for j in [0,1]:
                    zz[i][j] = calc(xx[i][j], yy[i][j], 0, n, off)
        return xx, yy, zz
        
    def goify(self, layout=None):
        """Export the plane into graphics object.
        @author Nick Metelski
        @since 25.07.17"""
        xx,yy,zz = self.getXYZ(layout)
        surf = dict(
            type='surface',
            x=xx,
            y=yy,
            z=zz
        )
        return surf
