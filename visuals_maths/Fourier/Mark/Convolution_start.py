# -*- coding: utf-8 -*-
"""
Created on Tue Jul 17 11:45:12 2018

@author: kramm
"""
import numpy as np
import matplotlib.pyplot as plt


np.set_printoptions(threshold=np.nan)

L = 5
resolution = 10
x = np.linspace(-L,L, resolution)
a = 16

def Mark(x):
    y_values= []
    for i in range(0, len(x)):
        if x[i] < 0:
            y_values.append(0)
        else:
            y_values.append(0.001*x[i])
    return y_values
    

def Jackson(x):
    y_values = []
    for i in range(0, len(x)):
        if x[i] < -a:
            y_values.append(0)
        elif x[i] > a:
            y_values.append(0)
        else:
            y_values.append(1)
    return y_values

def Freya(x):
    y_values = []
    for i in range(0, len(x)):
        if x[i] < 0:
            y_values.append(0)
        elif x[i] >a:
            y_values.append(0)
        else:
            y_values.append(1)
    return y_values

def Omar(x):
    y_values = []
    for i in range(0, len(x)):
        if x[i] < 0 :
            y_values.append(0)
        else:
            y_values.append(1)
    return y_values


def Dom(x):
    y_values = []
    for i in range(0, len(x)):
        y_values.append(L*x[i]*np.exp(-(x[i])**2))
    
    return y_values


y = Dom(x)






def combination(f_x, g_t_minus_x):
    h = []
    for i in range(0, len(f_x)):
        h.append(f_x[i]*g_t_minus_x[i])
    return h



def extra_range_t_positive(x,f,t):
    f_zeros = []

    #t is the number of extra elements we need
    x_zeros = []
    for i in range(0,t):
        x_zeros.append(-i-max(x))
        f_zeros.append(5e-13)
    
    x_values = []
    f_values = []
    for i in range(0,len(x)):
        x_values.append(x[i])
        f_values.append(f[i])
    
    f_extra = np.concatenate(( f_zeros,f_values), axis = 0)
    x_extra = np.concatenate((x_zeros,x_values[:-1],), axis = 0)
    
    return x_extra, f_extra
    

def extra_range_t_negative(x,g,t):
    
    
    
    g_zeros = []

    #t is the number of extra elements we need
    x_zeros = []
    for i in range(0,t):
        x_zeros.append(i+min(x))
        g_zeros.append(0)
    g_values = []
    x_values = []

    for i in range(0, len(x)):
        x_values.append(len(x_zeros)+x[i])
        g_values.append(g[i])
        
    f_extra = np.concatenate((g_zeros, g_values), axis = 0)
    x_extra = np.concatenate((x_zeros, x_values), axis = 0)
    
    return x_extra, f_extra



def extra_range(x,function, t):
    if t > 0:
        x,y = extra_range_t_positive(x,function, t)
    else:
        x,y = extra_range_t_negative(x,function, -t)
    return x,y



x_range = np.linspace(-50,50,resolution)
g = Mark(x_range)
t = 500


f = Dom(x_range)




xf, ff = extra_range(x_range,f, t)
xg,gg = extra_range(x_range, g,t)




fig_1 = plt.figure(1)
fig_1.set_size_inches(7,2)
plt.plot(xf,ff, color = 'r')

print (xf),

#plt.plot(xf,ff,color = 'b')
#plt.plot(xg, gg, color = 'r')
#plt.plot(x_range, f)
#plt.plot(xf,ff)
