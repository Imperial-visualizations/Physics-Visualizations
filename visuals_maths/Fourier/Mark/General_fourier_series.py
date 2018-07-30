# -*- coding: utf-8 -*-
"""
Created on Fri Jul 27 12:29:44 2018

@author: kramm
"""
import numpy as np
import matplotlib.pyplot as plt
import scipy

L = 25
"""PICK THESE VALUES"""
resolution = 1000
N = 10
"""UP THERE"""


x = np.linspace(-L,L, resolution)

def y_values(x_range):
    y = []
    for x in x_range:
        """WRITE A FUNCTION HERE"""
        y.append(np.sin(x/L))
    return y





data = y_values(x)
plt.plot(x,data, color = 'r')

def an(data,n):
    b = [] 
    x = []
    
    for i in range(0,(len(a))):
        b.append(np.cos(np.pi * n *i / L))
        x.append(i)
    integrand = []

    for i in range(0,len(a)):
        c = data[i] * b[i]
        integrand.append(c)

    integration = scipy.integrate.simps(integrand,x, dx  = 2*L/resolution) #spacing in x
    an = integration / len(integrand)
    print ("an", an)
    return (an)


def bn(data,n):
    a = data
    b = []  
    x = []
    for i in range(0,(len(a))):
        b.append(np.sin(np.pi * n *i / L))
        x.append(i)
    integrand = []
    
    for i in range(0,len(a)):
        c = a[i] * b[i]
        integrand.append(c)
    
    integration = scipy.integrate.simps(integrand,x, dx  = 2*L/resolution)
    bn = integration / len(integrand)
    #print ("bn", bn)
    return (bn)
    

def fourier_coefficients(N):
    a = []
    for i in range(0,N):
        cn = an(data,i)
        a.append(cn)
    
    b  = []
    for i in range(0,N):
        cn = bn(data, i)
        b.append(cn)
        
    alpha = []
    theta = []
    
    for i in range(0,len(a)):
        ALPHA = ((a[i])**2  +(b[i])**2)**0.5
        alpha.append(ALPHA)
        THETA = np.arctan(b[i]/a[i])
        theta.append(THETA)
        
    return a,b, alpha, theta

a,b,alpha, phi =  fourier_coefficients(6)

def summation_trig(N,x_value,set_of_an, set_of_bn):

    y_value = []
    for i in range(0, N):
        y_value_intermediate = []
        y_value_intermediate.append(set_of_an[0][i] *np.cos(i*np.pi*x_value/L) + set_of_bn[0][i]*np.sin(i*np.pi*x_value/L))
        y_value_final = sum(y_value_intermediate)
        y_value.append(y_value_final)
    y_value = sum(y_value)
    return y_value




def plot(N,x):
    
    set_of_an = []
    set_of_bn = []
    set_of_alpha_n = []
    set_of_theta_n = []
    
    set_of_an.append(fourier_coefficients(N)[0])
    set_of_bn.append(fourier_coefficients(N)[1])
    set_of_alpha_n.append(fourier_coefficients(N)[2])
    set_of_theta_n.append(fourier_coefficients(N)[3])
    
    
    y = []
    for i in range(0, len(x)):
        y.append(summation_trig(N, x[i],set_of_an, set_of_bn))
    xa = []
    xb = []
    ya = []
    yb = []
    for i in range(0, len(x)/2):
        xa.append(x[i])
        yb.append(y[i])
    for i in range(len(x)/2 , len(x)):
        xb.append(x[i] -2*L/resolution)
        ya.append(y[i])
        
    
    fig_1 = plt.figure(1)
    fig_1.set_size_inches(7,3)
    plt.plot(xa,ya, color = 'b')
    plt.plot(xb,yb, color = 'b')
    #plt.plot(x,y)
    plt.xlim(-L, +L)
    
    
plot(N,x)


    