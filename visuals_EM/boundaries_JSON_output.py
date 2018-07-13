import numpy as np
import pandas as pd
from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
import plotly.graph_objs as go
import plotly_arrows as plar
init_notebook_mode(connected=True)

c = 3e8 # Speed of light
w_conversion = 6.92e5 # Factor to make plot wavelength reasonable

class Wave:
    def __init__(self, theta, out, E_0, polarisation, w=3.46e15, n1=1., width=2, color="rgb(0,0,0)", **kwargs):
        """
        Args:
            theta (float) - [radians] {0 to π}
            out (bool) - True if outgoing, False if incoming (to the origin)
            
            E_0 (float) - Magnitude of the E field
            polarisation (str) - {'s'/'p'} whether E or B is parallel to the boundary
            w (float) - [rad s^-1] Angular frequency (default: green light)
            n1 (float) - The incident material's refractive index
            
            width (int) - line thickness
            color (str) - [hex/rgb] line color
        """
        self.theta = theta
        self.out = out
        
        self.n1 = n1
        self.E_0 = E_0
        self.w = w / w_conversion
        self.true_w = w
        self.k = (n1 * self.w) / c
        self.true_k = (n1 * self.true_w) / c
        self.B_0 = self.n1 * E_0
        self.true_B_0 = (self.n1 / c) * E_0
        if polarisation == "s" or polarisation == "p":
            self.polarisation = polarisation
        else:
            raise Exception('Polarisation argument must be "s" or "p"')
        
        self.width = width
        self.color = color
        
        if kwargs.get("_x_reflect") == False:
            self._x_reflect = False
        else:
            self._x_reflect = True
            
        self.arrow = plar.Arrow(theta=self.theta, out=self.out,  width=width, color=color)
        self.sinusoids = self.create_sinusoids()
    
    
    def create_sinusoids(self):
        """Creates the sinusoidal wave components"""
        z_range = np.linspace(0, 1, 100)
        if self.polarisation == "s":
            E_sine = np.array([np.zeros_like(z_range), self.E_0 * -np.sin(self.k * z_range), z_range])
            B_sine = np.array([self.B_0 * -np.sin(self.k * z_range), np.zeros_like(z_range), z_range])
        else:
            E_sine = np.array([self.E_0 * np.sin(self.k * z_range), np.zeros_like(z_range), z_range])
            B_sine = np.array([np.zeros_like(z_range), self.B_0 * -np.sin(self.k * z_range), z_range])
        
        rot_E_sine = self.rotate_sinusoid(E_sine, self.theta, self._x_reflect)
        rot_B_sine = self.rotate_sinusoid(B_sine, self.theta, self._x_reflect)
        
        E_trace = go.Scatter3d(x=rot_E_sine[0].tolist(), y=rot_E_sine[1].tolist(), z=rot_E_sine[2].tolist(),
                               showlegend = False, mode = 'lines', marker = dict(color='#0099FF'))
        B_trace = go.Scatter3d(x=rot_B_sine[0].tolist(), y=rot_B_sine[1].tolist(), z=rot_B_sine[2].tolist(),
                               showlegend = False, mode = 'lines', marker = dict(color='#FF0099'))
        
        return [E_trace, B_trace]
        
    
    def transmit(self, n2):
        """
        Args:
            n2 (float) - The dielectric material's refactive index
        """
        self.n2 = n2
        
        theta_i = self.theta
        theta_t = self.snell(self.n1, self.n2, theta_i)
        if np.isnan(theta_t):
            print('Total internal reflection')
            return None
        
        plot_theta_t = np.pi + theta_t
        
        if self.polarisation == "s":
            E_t0 = self.E_0 * (2. * self.n1 * np.cos(theta_i)) / (self.n1 * np.cos(theta_i) + self.n2 * np.cos(theta_t))
        else:
            E_t0 = self.E_0 * (2. * self.n1 * np.cos(theta_i)) / (self.n1 * np.cos(theta_t) + self.n2 * np.cos(theta_i))
                
        return Wave(theta=plot_theta_t, out=True, E_0=E_t0, w=self.true_w,
                    polarisation=self.polarisation, n1=self.n2, color="#000000", _x_reflect=False)
    
        
    def reflect(self, n2):
        """
        Args:
            n2 (float) - The dielectric material's refactive index
        """
        self.n2 = n2
        if self.n1 == self.n2:
            print('Refractive indices equal - no reflection')
            return None
        
        theta_i = self.theta
        theta_r = theta_i
        theta_t = self.snell(self.n1, self.n2, theta_i)
        if np.isnan(theta_t):
            theta_t = 0.5 * np.pi
        
        plot_theta_r = -theta_r
        
        if self.polarisation == "s":
            E_r0 = self.E_0 * (self.n1 * np.cos(theta_i) - self.n2 * np.cos(theta_t)) / (self.n1 * np.cos(theta_i) + self.n2 * np.cos(theta_t))
        else:
            E_r0 = self.E_0 * (self.n1 * np.cos(theta_t) - self.n2 * np.cos(theta_i)) / (self.n1 * np.cos(theta_t) + self.n2 * np.cos(theta_i))
        
        return Wave(theta=plot_theta_r, out=True, E_0=E_r0, w=self.true_w,
                    polarisation=self.polarisation, n1=self.n1, _x_reflect=False)
    
    
    @staticmethod
    def snell(n1, n2, theta_i):
        """
        Finds angle of transmission using Snell's law
        
        Args:
            n1 (float) - incident medium's refractive index
            n2 (float) - transmissive medium's refractive index
            theta_i (float) - angle of incidence
        """
        return np.arcsin((n1 / n2) * np.sin(theta_i))
    
    
    @staticmethod
    def rotate_sinusoid(sinusoid, theta, x_reflect=False):
        """Apply rotation matrix element-wise to array of sine position vectors (using Einstein summation convention)"""
        rotation_matrix = np.array([[np.cos(theta), 0, np.sin(theta)],
                                    [0, 1, 0],
                                    [-np.sin(theta), 0, np.cos(theta)]])
        if x_reflect == False:
            return np.einsum("ij,jk->ik", rotation_matrix, sinusoid)
        elif x_reflect:
            x_reflect_matrix = np.array([[1, 0, 0],
                                         [0, -1, 0],
                                         [0, 0, 1]])
            transf_matrix = np.dot(x_reflect_matrix, rotation_matrix)
            return np.einsum("ij,jk->ik", transf_matrix, sinusoid)
        
        
def tabulate(incident, transmitted, reflected):
    if transmitted is None:
        table = pd.DataFrame.from_items(
            [('Incident', [incident.E_0, incident.true_B_0, incident.true_k, incident.true_w, incident.n1, incident.polarisation]),
             ('Reflected', [reflected.E_0, reflected.true_B_0, reflected.true_k, reflected.true_w, reflected.n1, reflected.polarisation])],
            orient='index', columns=['E_0', 'B_0', 'k', 'w', 'n1', 'polarisation']
        )
    elif reflected is None:
        table = pd.DataFrame.from_items(
            [('Incident', [incident.E_0, incident.true_B_0, incident.true_k, incident.true_w, incident.n1, incident.polarisation]),
             ('Transmitted', [transmitted.E_0, transmitted.true_B_0, transmitted.true_k, transmitted.true_w, transmitted.n1, transmitted.polarisation])],
            orient='index', columns=['E_0', 'B_0', 'k', 'w', 'n1', 'polarisation']
        )
    else:
        table = pd.DataFrame.from_items(
            [('Incident', [incident.E_0, incident.true_B_0, incident.true_k, incident.true_w, incident.n1, incident.polarisation]),
             ('Transmitted', [transmitted.E_0, transmitted.true_B_0, transmitted.true_k, transmitted.true_w, transmitted.n1, transmitted.polarisation]),
             ('Reflected', [reflected.E_0, reflected.true_B_0, reflected.true_k, reflected.true_w, reflected.n1, reflected.polarisation])],
            orient='index', columns=['E_0', 'B_0', 'k', 'w', 'n1', 'polarisation']
        )
    
    print(table)
    
def run(angle, polarisation, n1, n2):
    """
    Args:
        angle (float) - [degrees] {0 to 90}
        polarisation (str) - {'s'/'p'} whether E or B is parallel to the boundary
        n1 (float) - The incident material's refractive index
        n2 (float) - The second material's refractive index
    """
    Incident = Wave(theta=np.deg2rad(angle), out=False, E_0=0.2, polarisation=polarisation, n1=n1)
    Transmitted = Incident.transmit(n2=n2)
    Reflected = Incident.reflect(n2=n2)
    tabulate(Incident, Transmitted, Reflected)
    
    surface = go.Mesh3d(x=[-1, 1, -1, 1],
                    y=[-1, -1, 1, 1],
                    z=[0, 0, 0, 0],
                    color='rgb(0,0,0)', opacity=0.1)

    if Transmitted == None:
        plot_data = Incident.arrow.data + Incident.sinusoids \
            + Reflected.arrow.data + Reflected.sinusoids + [surface]
    elif Reflected == None:
        plot_data = Incident.arrow.data + Incident.sinusoids \
            + Transmitted.arrow.data + Transmitted.sinusoids + [surface]
    else:
        plot_data = Incident.arrow.data + Incident.sinusoids \
            + Transmitted.arrow.data + Transmitted.sinusoids \
            + Reflected.arrow.data + Reflected.sinusoids + [surface]

    layout = {
        'autosize': True,
        'width': 700, 'height': 700,
        'scene': {
            'aspectmode': 'cube',
            'xaxis': {'range': [-1, 1], 'autorange': False, 'zeroline': True},
            'yaxis': {'range': [-1, 1], 'autorange': False, 'zeroline': True},
            'zaxis': {'range': [-1, 1], 'autorange': False, 'zeroline': True},
            'camera': {
                'up': {'x': 0, 'y': 1, 'z': 0} # DOESN'T WORK -- WHY NOT!?
            }
        }
    }

#    fig = go.Figure(data=plot_data, layout=layout)
#    iplot(fig)
    return(plot_data)
        