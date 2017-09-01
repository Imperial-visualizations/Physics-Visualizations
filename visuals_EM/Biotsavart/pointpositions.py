import numpy as np 
from scipy.integrate import quad
import plotly.graph_objs as go
import json 
    
data={"Frames":[[],[],[],[],[]]};

def calc_this(shape,phi_scal,P,a):
    if shape == "circle":
        dI= np.array([-a*np.sin(phi_scal),a*np.cos(phi_scal),0])
        r_vec = np.array([P[0]-a*np.cos(phi_scal),P[1]-a*np.sin(phi_scal),P[2]])
        
    return dI,r_vec 

def Biot_equation (current,perm,dI,r_vec):
    xprod = np.cross(dI,r_vec)
    dB = (current/(4*np.pi*(np.linalg.norm(r_vec)**3)))*xprod #should multiply current by perm 
    return dB


def calc_integrand(phi):
    a = 0.75;
    dI= np.array([-a*np.sin(phi),a*np.cos(phi),0])
    rvec = np.array([P[0]-a*np.cos(phi),P[1]-a*np.sin(phi),P[2]])
    result =(current/(4*np.pi*(np.linalg.norm(r_vec)**3)))* np.cross(dI,rvec)
    return result[i]



a = 0.75;
shape = "circle" 
perm = 4*np.pi*10e-7 
current = 2.; 
P = np.array([0,0,1]).tolist();
phi_scal = 0;
B = np.empty((0, 3))
iterator = 0.2 * np.pi; 

uu = np.linspace(0, 2 * np.pi, 50)
xc = a*np.cos(uu); 
yc = a*np.sin(uu); 
zc = np.zeros_like(xc); 
posx = [0,0,-1,0,1]
posy = [0,-1,0,1,0] 

for p in range(5):
    
    P = [posx[p],posy[p],1]

    for ang in range(0,11):
    
        dI,r_vec = calc_this("circle",(phi_scal+(ang*iterator)),P,a)
        dB= 2*Biot_equation(current,perm,dI,r_vec) #value of 18 is heuristic for diagram 

        for j in range(3):
            i=j
            zz = quad(calc_integrand,0,2*np.pi)[0]
            B = np.append(B,zz,axis=None) #value of 2.5 is heuristic for diagram 

        Currenttrace = go.Scatter3d(name = "dI" + str(ang),
                                    x = [a*np.cos((phi_scal+(ang*iterator))),dI[0]+a*np.cos((phi_scal+(ang*iterator)))], 
                                    y = [a*np.sin((phi_scal+(ang*iterator))),dI[1]+a*np.sin((phi_scal+(ang*iterator)))], 
                                    z = [0,dI[2]], 
                                    line = dict(width = 6,color = 'rgb(250,20,0)'),
                                    marker = dict(size=[0,10],color= 'rgb(250,20,0)',symbol= 'diamond',opacity=1)
                                   )   


        Magtrace = go.Scatter3d(name = "dB" +  str(ang),
                                x = [P[0],0+dB[0]], 
                                y = [P[1],0+dB[1]], 
                                z = [P[2],1+dB[2]],
                                line = dict(width = 6, color = 'rgb(50,100,200)'),
                                marker = dict(size=[0,10],color= 'rgb(50,100,200)',symbol= 'diamond',opacity=1),
                               );

        Rtrace = go.Scatter3d(name = "R" + str(ang),
                              x = [a*np.cos((phi_scal+(ang*iterator))),r_vec[0]+a*np.cos((phi_scal+(ang*iterator)))],
                              y = [a*np.sin((phi_scal+(ang*iterator))),r_vec[1]+a*np.sin((phi_scal+(ang*iterator)))],
                              z = [0,r_vec[2]], 
                              line = dict(width = 6, color = 'rgb(0,220,0)'),
                              marker = dict(size=[0,10],color= 'rgb(0,220,0)',symbol= 'diamond',opacity=1),
                             );


        Btrace = go.Scatter3d(name = "B field" + str(ang) ,
                              x = [P[0],P[0]+B[0]], 
                              y = [P[1],P[1]+B[1]], 
                              z = [P[2],P[2]+B[2]],
                              line = dict(width = 6, color = 'rgb(255,160,75)'),
                              marker = dict(size=[0,10],color= 'rgb(255,160,122)',symbol= 'diamond',opacity=1)
                             );

        Circletrace = go.Scatter3d(name = "circle" + str(ang), 
                                   x =  xc.tolist(),
                                   y= yc.tolist(),
                                   z = zc.tolist(),
                                   mode = "markers",
                                   marker = dict(symbol="circle",size=2.5,opacity=1,color= 'rgb(0,0,0)'),
                                  );

        Pointtrace = go.Scatter3d(name = 'Point' + str(ang) ,
                                  x = [P[0]],
                                  y= [P[1]],
                                  z=[P[2]],
                                  marker = dict(size=4, color= 'rgb(214,11,8)')
                                 )


        result= [Currenttrace,Magtrace,Rtrace,Btrace,Circletrace,Pointtrace]

        data['Frames'][p].append(result)

with open('BiotAnimatePos.JSON','w') as outfile:
    json.dump(data, outfile)

