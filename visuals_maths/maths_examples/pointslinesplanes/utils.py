"""utils.py"""
import numpy as np
def mesh2d(xlim, ylim, n=5):
    """Create 2d mesh in sepecifies x and y axes limits, with number of points for every dimension separate."""
    if isinstance(n, int):
        xx = np.linspace(xlim[0],xlim[1],n)
        yy = np.linspace(ylim[0],ylim[1],n)
    elif isinstance(n, list):
        xx = np.linspace(xlim[0],xlim[1],n[0])
        yy = np.linspace(ylim[0],ylim[1],n[1])
    else:
        raise ValueError("Wrong number of points parameter")
    return np.meshgrid(xx, yy)

def normalize(v):
    """Normalizes a 3d vector v, returns a 3d vector."""
    magnitude = np.sqrt(v[0]**2+v[1]**2+v[2]**2)
    if magnitude==0:
        raise ValueError("Zero vector cannot be normalized.")
    else:
        return v/magnitude
