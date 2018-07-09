<<<<<<< HEAD
import numpy as np
from scipy.integrate import tplquad,dblquad

k = 8.987551e9  #coulomb's constant
m = 1 #kg
dt = 0.1 #s
a = 0.5
#NOTE THIS IS FORCE ELEMENT. YOU HAVE TO INTEGRATE THIS THROUGH THE ENTIRE SURFACE TO GET OVERALL FORCE.
#outputs force element in direction i, given coulomb's constant k, test charge position p, and density rho for a sphere. 

def Force_element_sphere(r,theta,phi):
    r_vector = np.array([r*np.sin(phi)*np.cos(theta),r*np.sin(phi)*np.sin(theta),r*np.cos(phi)])
    distance= p-r_vector
    dV = np.linalg.norm(r_vector)**2*np.sin(phi) #volume element for sphere 
    dq = dV*rho
    dF = dq*k*distance/(np.linalg.norm(distance)**3) #coloumbs law 
    return dF[i]

#outputs force element in direction i (i  will be defined later) , given coulomb's constant k, test charge position p, and 
#density rho for a DISK. 

def Force_element_disk(r,theta):
    r_vector = np.array([r*np.cos(theta),r*np.sin(theta),0])
    distance= p-r_vector
    dS = np.linalg.norm(r_vector)
    dq = dS*rho
    dF = dq*k*distance/(np.linalg.norm(distance)**3) #coloumbs law 
    return dF[i]

def Force_element_torus(theta,z,r):
    #Note that 'a' or minor radius of torus is fixed here at 2. For ring torus, r must be greater than a 
    r_vector = np.array([r*np.cos(theta),r*np.sin(theta),z])
    distance= p-r_vector
    dV = np.linalg.norm(r_vector)*2 #volume element for sphere 
    dq = dV*rho
    dF = dq*k*distance/(np.linalg.norm(distance)**3) #coloumbs law 
    return dF[i]

def Force_element_cube(x, y, z):
    r_vector = np.array([x, y, z])
    distance = p - r_vector
    dV = 1
    dq = dV*rho
    dF = dq*k*distance/(np.linalg.norm(distance)**3)
    return dF[i]

class surface: 
    "EM surface takes arguments density, shape, and linear dim. Linear dim can be radius, width, etc" 
    "make_plot returns an array of data that defines the physical surface, which we use for 3D plotting later"
    
    def __init__(self, density=1.,shape='sphere',linear_dim=1.):
        self.rho = density
        self.s = shape
        self.dim= linear_dim
        
    
    def make_plot(self):
        u = np.linspace(0, 2 * np.pi, 35) #35 being the number of points that are optimal between visual resolution & computational effeciency 
        v = np.linspace(0, 2 * np.pi, 35)
        cube_side = np.linspace(-self.dim, self.dim, 35)

        #v_t = np.linspace(0,2*np.pi,37) actually changing the definition of v to 2*pi doesnt make a difference to the sphere or disk plot 
        
        [uu,vv] = np.meshgrid (u,v)
        
        if self.s=='sphere':
            x = self.dim * np.sin(uu) * np.cos(vv); 
            y = self.dim * np.sin(uu) * np.sin(vv); 
            z = self.dim * np.cos(uu)
            
        if self.s=='disk':
            x = self.dim * np.sin(uu) * np.cos(vv); 
            y = self.dim * np.sin(uu) * np.sin(vv); 
            z = 0 * np.cos(uu);        
            
        if self.s=='torus':
            x = (self.dim + a*np.cos(vv)) * np.cos(uu);
            y = (self.dim + a*np.cos(vv)) * np.sin(uu);
            z = a*np.sin(vv);
            
        if self.s=='cube':
           
            side1, side2 = np.meshgrid(cube_side, cube_side)
            zeroside = -1*self.dim*np.ones(side1.shape)
            oneside = np.ones(side1.shape)
            oneside = self.dim*oneside
            
            x = np.append(side1, side1, axis = 0)
            x = np.append(x, side2, axis = 0)
            x = np.append(x, side2, axis = 0)
            x = np.append(x, zeroside, axis = 0)
            x = np.append(x, oneside, axis = 0)
            
            y = np.append(side2, side2, axis = 0)
            y = np.append(y, zeroside, axis = 0)
            y = np.append(y, oneside, axis = 0)
            y = np.append(y, side1, axis = 0)
            y = np.append(y, side1, axis = 0)
            
            z = np.append(zeroside, oneside, axis = 0)
            z = np.append(z, side1, axis = 0)
            z = np.append(z, side1, axis = 0)
            z = np.append(z, side2, axis = 0)
            z = np.append(z, side2, axis = 0)
            

        return [x,y,z]

class test_charge:
    
    "test charge takes attribute position, which should be a 3d array"
    def __init__(self,position=[2.,2.,2.],charge=1.,initial_velocity=np.array([0.,0.,0.])):
        self.p = np.array(position)
        self.q_1=charge
        self.v=initial_velocity
    def force(self,surface):
        F = list()
        global p,rho,i,q_1  #making sure these values don't get lost in the class by definining them as global.
        rho = surface.rho # Wouldnt it be better to define this as a global variable within in the surface class 
        p = self.p
        q_1= self.q_1
        
        if surface.s=='sphere':
            for j in range(3): #cycling through the three dimensions of the force (because scipy doesn't do vector integration)
                i=j
                #tplquad returns the triple integral of the force
                F.append(tplquad(Force_element_sphere,0,np.pi,lambda theta:0, lambda theta: 2*np.pi,
                                 lambda phi,theta: 0, lambda phi, theta: surface.dim,epsrel=0.4)[0]) 
       
        elif surface.s =='disk' :     
            for j in range(3):
                i=j
                #tplquad returns the triple integral of the force
                F.append(dblquad(Force_element_disk,0,2*np.pi,lambda theta: 0, lambda theta: surface.dim,epsrel=0.4)[0])
        
        elif surface.s=='torus':
            for j in range(3):
                i=j
                #tplquad returns the triple integral of the force
                F.append(tplquad(Force_element_torus,surface.dim-a,surface.dim+a,lambda r: 0,lambda r: np.sqrt(a**2 - (r-surface.dim)**2),
                                 lambda z,r: 0, lambda z,r: 2*np.pi,epsrel=0.4)[0])
        
        
        elif surface.s=='cube':
            for j in range(3):
                i=j
                #tplquad returns the triple integral of the force
                F.append(tplquad(Force_element_cube,-surface.dim,surface.dim,lambda x: -surface.dim, lambda x: surface.dim, lambda x,y: -surface.dim, lambda x,y: surface.dim, epsrel=0.3)[0])
        
        
        return F
    def move(self,force=[0.,0.,0.]):
        print(type(self.v))
        print(self.v)
        print(type(force))
        self.v = self.v + force*dt/m
    
    
    
def f(x):
    return [3.,3.,3.]
electron = test_charge(position=[1.,1.,1.],charge=2,initial_velocity=np.array([1.,0.,0.]))

class Field():
    def __init__(self,type='magnetic',func=f,lim_x =[0,2],lim_y=[0,2],lim_z=[0,2]):
        self.func=func
        self.type=type
        self.lim_x = lim_x
        self.lim_y = lim_y
        self.lim_z=lim_z
    def force_oncharge(self,charge):
        if charge.p[0] >= self.lim_x[0] and charge.p[0] <= self.lim_x[1] and charge.p[1] >= self.lim_y[0] and charge.p[1]<=self.lim_y[1]and charge.p[2] >= self.lim_z[0] and charge.p[2]<=self.lim_z[1]:
            B = (self.func(charge.p))
            F= charge.q_1*np.cross(charge.v,B)
            return F
        else:
            return 0
b = Field()
print(b.force_oncharge(electron))
positions = {}
for i in range (0,10):
    electron.move(b.force_oncharge(electron))
    print(electron.p)
    

#you either do it through a circle or draw specifc current elements 

a = 2 ; #a is the radius of the circle 

shape = "circle" 
perm = 4*np.pi*10e-7 
current = 2; 

#end goal is to make a shape class and define these functions within them 

def Create_Parameter_Axis(shape):
    phi = np.linspace(0, 2 * np.pi, 35)
    x = y = np.linspace(0,1,35)
    if shape == "circle": 
        parameter = phi 
    elif shape == "triangle":
        parameter = [x,y]
    elif shape == "rectangle":
        parameter = [x,y]
    else: 
        print " you entered the wrong parameter "
    return parameter 

def Draw_current_loop(parameter,shape) 
        
def calc_this(shape):
    if shape == "circle":
        a = 2
        dI= np.array([-a*np.sin(phi),a*np.cos(phi),0])
        r_vec = np.array([-a*np.cos(phi),a*np.sin(phi),z])
        
    return dI,r_vec 

    
def Biot_equation (current,perm,r_scal,dI,r_vec):
    xprod = np.cross (dI,r_vec)
    dB = (perm*current/(4*np.pi)*r_scal**2) * xprod
    return dB

"""Do the integration using a for loop like before and do it for the different dimensions """
"""DO THE DRAWING BITS """


phi = np.linspace(0, 2 * np.pi, 35)
xc = a*np.cos(phi); 
yc = a*np.sin(phi); 
zc = 0; 

trace4 = go.Scatter3d(x = xc ,
                      y = yc,
                      z = zc,
                      name = "h", 
                      line = dict(width = 6, color = 'rgb(0,0,0)'),
                    );
=======
import numpy as np
from scipy.integrate import tplquad,dblquad
import plotly.graph_objs as go

k = 8.987551e9  #coulomb's constant
m = 1 #kg
dt = 0.1 #s
a = 0.5
#NOTE THIS IS FORCE ELEMENT. YOU HAVE TO INTEGRATE THIS THROUGH THE ENTIRE SURFACE TO GET OVERALL FORCE.
#outputs force element in direction i, given coulomb's constant k, test charge position p, and density rho for a sphere. 

def Force_element_sphere(r,theta,phi):
    r_vector = np.array([r*np.sin(phi)*np.cos(theta),r*np.sin(phi)*np.sin(theta),r*np.cos(phi)])
    distance= p-r_vector
    dV = np.linalg.norm(r_vector)**2*np.sin(phi) #volume element for sphere 
    dq = dV*rho
    dF = dq*k*distance/(np.linalg.norm(distance)**3) #coloumbs law 
    return dF[i]

#outputs force element in direction i (i  will be defined later) , given coulomb's constant k, test charge position p, and 
#density rho for a DISK. 

def Force_element_disk(r,theta):
    r_vector = np.array([r*np.cos(theta),r*np.sin(theta),0])
    distance= p-r_vector
    dS = np.linalg.norm(r_vector)
    dq = dS*rho
    dF = dq*k*distance/(np.linalg.norm(distance)**3) #coloumbs law 
    return dF[i]

def Force_element_torus(theta,z,r):
    #Note that 'a' or minor radius of torus is fixed here at 2. For ring torus, r must be greater than a 
    r_vector = np.array([r*np.cos(theta),r*np.sin(theta),z])
    distance= p-r_vector
    dV = np.linalg.norm(r_vector)*2 #volume element for sphere 
    dq = dV*rho
    dF = dq*k*distance/(np.linalg.norm(distance)**3) #coloumbs law 
    return dF[i]

def Force_element_cube(x, y, z):
    r_vector = np.array([x, y, z])
    distance = p - r_vector
    dV = 1
    dq = dV*rho
    dF = dq*k*distance/(np.linalg.norm(distance)**3)
    return dF[i]

class surface: 
    "EM surface takes arguments density, shape, and linear dim. Linear dim can be radius, width, etc" 
    "make_plot returns an array of data that defines the physical surface, which we use for 3D plotting later"
    
    def __init__(self, density=1.,shape='sphere',linear_dim=1.):
        self.rho = density
        self.s = shape
        self.dim= linear_dim
        
    
    def make_plot(self):
        u = np.linspace(0, 2 * np.pi, 35) #35 being the number of points that are optimal between visual resolution & computational effeciency 
        v = np.linspace(0, 2 * np.pi, 35)
        cube_side = np.linspace(-self.dim, self.dim, 35)

        #v_t = np.linspace(0,2*np.pi,37) actually changing the definition of v to 2*pi doesnt make a difference to the sphere or disk plot 
        
        [uu,vv] = np.meshgrid (u,v)
        
        if self.s=='sphere':
            x = self.dim * np.sin(uu) * np.cos(vv); 
            y = self.dim * np.sin(uu) * np.sin(vv); 
            z = self.dim * np.cos(uu)
            
        if self.s=='disk':
            x = self.dim * np.sin(uu) * np.cos(vv); 
            y = self.dim * np.sin(uu) * np.sin(vv); 
            z = 0 * np.cos(uu);        
            
        if self.s=='torus':
            x = (self.dim + a*np.cos(vv)) * np.cos(uu);
            y = (self.dim + a*np.cos(vv)) * np.sin(uu);
            z = a*np.sin(vv);
            
        if self.s=='cube':
           
            side1, side2 = np.meshgrid(cube_side, cube_side)
            zeroside = -1*self.dim*np.ones(side1.shape)
            oneside = np.ones(side1.shape)
            oneside = self.dim*oneside
            
            x = np.append(side1, side1, axis = 0)
            x = np.append(x, side2, axis = 0)
            x = np.append(x, side2, axis = 0)
            x = np.append(x, zeroside, axis = 0)
            x = np.append(x, oneside, axis = 0)
            
            y = np.append(side2, side2, axis = 0)
            y = np.append(y, zeroside, axis = 0)
            y = np.append(y, oneside, axis = 0)
            y = np.append(y, side1, axis = 0)
            y = np.append(y, side1, axis = 0)
            
            z = np.append(zeroside, oneside, axis = 0)
            z = np.append(z, side1, axis = 0)
            z = np.append(z, side1, axis = 0)
            z = np.append(z, side2, axis = 0)
            z = np.append(z, side2, axis = 0)
            

        return [x,y,z]

class test_charge:
    
    "test charge takes attribute position, which should be a 3d array"
    def __init__(self,position=[2.,2.,2.],charge=1.,initial_velocity=np.array([0.,0.,0.])):
        self.p = np.array(position)
        self.q_1=charge
        self.v=initial_velocity
        print(type(self.v))
        if type(self.v) != np.ndarray:
            raise Exception('invalid input for velocity')
    def force(self,surface):
        F = list()
        global p,rho,i,q_1  #making sure these values don't get lost in the class by definining them as global.
        rho = surface.rho # Wouldnt it be better to define this as a global variable within in the surface class 
        p = self.p
        q_1= self.q_1
        
        if surface.s=='sphere':
            for j in range(3): #cycling through the three dimensions of the force (because scipy doesn't do vector integration)
                i=j
                #tplquad returns the triple integral of the force
                F.append(tplquad(Force_element_sphere,0,np.pi,lambda theta:0, lambda theta: 2*np.pi,
                                 lambda phi,theta: 0, lambda phi, theta: surface.dim,epsrel=0.4)[0]) 
       
        elif surface.s =='disk' :     
            for j in range(3):
                i=j
                #tplquad returns the triple integral of the force
                F.append(dblquad(Force_element_disk,0,2*np.pi,lambda theta: 0, lambda theta: surface.dim,epsrel=0.4)[0])
        
        elif surface.s=='torus':
            for j in range(3):
                i=j
                #tplquad returns the triple integral of the force
                F.append(tplquad(Force_element_torus,surface.dim-a,surface.dim+a,lambda r: 0,lambda r: np.sqrt(a**2 - (r-surface.dim)**2),
                                 lambda z,r: 0, lambda z,r: 2*np.pi,epsrel=0.4)[0])
        
        
        elif surface.s=='cube':
            for j in range(3):
                i=j
                #tplquad returns the triple integral of the force
                F.append(tplquad(Force_element_cube,-surface.dim,surface.dim,lambda x: -surface.dim, lambda x: surface.dim, lambda x,y: -surface.dim, lambda x,y: surface.dim, epsrel=0.3)[0])
        
        
        return F
    def move(self,force=[0.,0.,0.]):
        self.p = self.p + self.v*dt
        self.v = self.v + force*dt/m
    
    
    
def f(x):
    return [3.,3.,3.]
electron = test_charge(position=[1.,1.,1.],charge=2,initial_velocity=np.array([1.,1.,0.]))

class Field():
    def __init__(self,Type='magnetic',func=f,lim_x =[0,2],lim_y=[0,2],lim_z=[0,2]):
        self.func=func
        self.type=Type
        self.lim_x = lim_x
        self.lim_y = lim_y
        self.lim_z=lim_z
    def force_oncharge(self,charge):
        if charge.p[0] >= self.lim_x[0] and charge.p[0] <= self.lim_x[1] and charge.p[1] >= self.lim_y[0] and charge.p[1]<=self.lim_y[1]and charge.p[2] >= self.lim_z[0] and charge.p[2]<=self.lim_z[1]:
            B = (self.func(charge.p))
            F= charge.q_1*np.cross(charge.v,B)
            return F
        else:
            return 0
            
            
class EM_wave:
    """
    Args:
            theta (float) - radians [0, π]
            phi (float) - radians [0, 2π]
            rot (float) - radians [0, 2π] - This rotates the wave along its axis
            width (int) - line thickness
            color (hex/rgb) - line color
    """
    def __init__(self, theta, phi=0, rot=0, width=5, color='rgb(0,0,0)'):
        self.theta = theta
        self.phi = phi
        self.rot = rot
        self.width = width
        self.color = color

        n = 100
        Ex_init = np.linspace(0,1,n)
        Ey_init = 0.25*np.sin(Ex_init*6.*np.pi)
        Ez_init = np.zeros(n)

        Bx_init = Ex_init
        By_init = Ez_init
        Bz_init = Ey_init

        E_coords_init = [np.array([Ex_init[i], Ey_init[i], Ez_init[i]]) for i in range(0, len(Ex_init))]
        B_coords_init = [np.array([Bx_init[i], By_init[i], Bz_init[i]]) for i in range(0, len(Bx_init))]

        theta_x = self.rot
        theta_y = self.phi
        theta_z = self.theta
        rotmatrix_x = np.array([[1, 0, 0],
                            [0, np.cos(theta_x), -np.sin(theta_x)], 
                            [0, np.sin(theta_x),  np.cos(theta_x)]])
        rotmatrix_y = np.array([[np.cos(theta_y), 0, np.sin(theta_y)],
                            [0, 1, 0], 
                            [-np.sin(theta_y), 0,  np.cos(theta_y)]])
        rotmatrix_z = np.array([[np.cos(theta_z), -np.sin(theta_z), 0],
                            [np.sin(theta_z), np.cos(theta_z), 0], 
                            [0, 0, 1]])

        E_coords_trans = [np.dot(rotmatrix_x,i) for i in E_coords_init]
        E_coords_trans = [np.dot(rotmatrix_y,i) for i in E_coords_trans]
        E_coords_trans = [np.dot(rotmatrix_z,i) for i in E_coords_trans]
        self.Ex = [i[0] for i in E_coords_trans]
        self.Ey = [i[1] for i in E_coords_trans]
        self.Ez = [i[2] for i in E_coords_trans]

        B_coords_trans = [np.dot(rotmatrix_x,i) for i in B_coords_init]
        B_coords_trans = [np.dot(rotmatrix_y,i) for i in B_coords_trans]
        B_coords_trans = [np.dot(rotmatrix_z,i) for i in B_coords_trans]
        self.Bx = [i[0] for i in B_coords_trans]
        self.By = [i[1] for i in B_coords_trans]
        self.Bz = [i[2] for i in B_coords_trans]
        
        self.E_wave = go.Scatter3d(
            x=self.Ex,
            y=self.Ey, 
            z=self.Ez,
            showlegend=False, mode='lines', line={'width': self.width, 'color': self.color}
        )
        
        self.B_wave = go.Scatter3d(
            x=self.Bx,
            y=self.By, 
            z=self.Bz,
            showlegend=False, mode='lines', line={'width': self.width, 'color': self.color}
        )
        
        self.data = [self.E_wave, self.B_wave]
>>>>>>> ac58d1a688f601c2450dad69cc1b11047b7ecdcb
