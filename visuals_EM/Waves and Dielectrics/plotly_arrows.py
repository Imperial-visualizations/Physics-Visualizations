import numpy as np
import plotly.graph_objs as go


def p2c(r, theta, phi):
    """Convert polar unit vector to cartesians"""
    return [r * np.sin(theta) * np.cos(phi),
           r * np.sin(theta) * np.sin(phi),
           r * np.cos(theta)]
    # return [-r * np.cos(theta),
    #         r * np.sin(theta) * np.sin(phi),
    #         r * np.sin(theta) * np.cos(phi)]

class Arrow:
    def __init__(self, theta, out, width=5, color='rgb(0,0,0)'):
        """
        Args:
            theta (float) - radians [0, π]
            out (bool) - True if outgoing, False if incoming (to the origin)
            width (int) - line thickness
            color (hex/rgb) - line color
        """
        self.theta = theta
        self.out = out
        self.width = width
        self.color = color

        wing_length, wing_angle = self._find_wing_coord()

        shaft_xyz = p2c(1., self.theta, 0)
        wings_xyz = [p2c(wing_length, self.theta + wing_angle, 0),
                     p2c(wing_length, self.theta - wing_angle, 0)]

        self.shaft = go.Scatter3d(
            x=[0, shaft_xyz[0]],
            y=[0, shaft_xyz[1]],
            z=[0, shaft_xyz[2]],
            showlegend=False, mode='lines', line={'width': self.width, 'color': self.color}
        )
        self.wings = go.Scatter3d(
            x=[wings_xyz[0][0], shaft_xyz[0] / 2., wings_xyz[1][0]],
            y=[wings_xyz[0][1], shaft_xyz[1] / 2., wings_xyz[1][1]],
            z=[wings_xyz[0][2], shaft_xyz[2] / 2., wings_xyz[1][2]],
            showlegend=False, mode='lines', line={'width': self.width, 'color': self.color}
        )

        self.data = [self.shaft, self.wings]


    def _find_wing_coord(self):
        """Finds polar coordinates of arrowhead wing ends"""
        frac = 0.1
        r = 0.5
        sin45 = np.sin(np.pi / 4.)

        if self.out == True:
            d = r - frac * sin45
        elif self.out == False:
            d = r + frac * sin45
        else:
            raise TypeError("arg: out must be True or False")

        a = np.sqrt(frac**2 * sin45**2 + d**2)
        alpha = np.arccos(d / a)
        return [a, alpha]
