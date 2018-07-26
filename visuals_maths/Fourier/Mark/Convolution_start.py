# -*- coding: utf-8 -*-
"""
Created on Tue Jul 17 11:45:12 2018

@author: kramm
"""
import numpy as np
import matplotlib.pyplot as plt
import inspect

def lineno():
    """Returns the current line number in our program."""
    return inspect.currentframe().f_back.f_lineno

#print "this is line", lineno()

np.set_printoptions(threshold=np.nan)

L = 5
multiplier = 4
resolution = 500
x = np.linspace(-L,L, resolution)
a = 10

def Mark(x):
    y_values= []
    for i in range(0, len(x)):
        if x[i] < 0:
            y_values.append(0)
        else:
            y_values.append(x[i])
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
        y_values.append(L*x[i]*np.exp(-(0.1*x[i])**2))
    
    return y_values




def reverse(function):
    reverse = function[::-1]
    return reverse


def shift_t_positive(function,t):
    shifted_x1 = []
    shifted_x2 = []
    shifted_x3 = []
    for i in range(0,t):
        shifted_x1.append(i)
    for i in range(0, len(function)):
        shifted_x1.append(i+t)
    for i in range(0, len(shifted_x1)-t):
        shifted_x2.append(shifted_x1[i+t])
    for i in range(0, len(shifted_x2)):
        shifted_x3.append(shifted_x2[i] - len(shifted_x2)/2)   
    return shifted_x3

def shift_t_negative(function,t):
    shifted_x1  = []
    shifted_x2 = []
    shifted_x3 = []
    for i in range(0, len(function)):
        shifted_x1.append(i)
    for i in range(len(function), t+len(function)):
        shifted_x1.append(i)
    for i in range(0, len(shifted_x1)-t):
        shifted_x2.append(shifted_x1[i+t])
    for i in range(0, len(shifted_x2)):
        shifted_x3.append(shifted_x2[i] - len(shifted_x2)/2-2*t)
    return shifted_x3#
    

def g_of_t_minus_x(function, t, original):
    if original == False:    
        reversed_y_values = reverse(function)
    else: 
        reversed_y_values = function #Not actually reversed
    if t > 0:
        shifted_x_values = shift_t_positive(function, t)
    else:
        shifted_x_values = shift_t_negative(function, -t)
    return shifted_x_values, reversed_y_values
    
    
    

def normalise_1(f,g):
    f_output = []
    g_output = []
    for i in range(0, len(f)):
        f_output.append(f[i]/abs(max(f)))
        g_output.append(g[i]/abs(max(g)))
    return f_output, g_output



def check_zeros(y1,y2):
    xs = []
    ys = []
    non_zero_y_up = []
    non_zero_y_down = []
    non_zero_x = [] 
    
    for i in range(0, len(f)):
        ys.append(y1[i]*y2[i])
        xs.append(x1[i])
    for i in range(0, len(ys)):
        if ys[i] != 0:            
            if abs(y1[i]) > abs(y2[i]):
                non_zero_y_up.append(y2[i])
                non_zero_y_down.append(y1[i])
            else:
                non_zero_y_up.append(y1[i])
                non_zero_y_down.append(y2[i])
            non_zero_x.append(xs[i])
    
    
    return non_zero_x, non_zero_y_up, non_zero_y_down


def combination(f_x, g_t_minus_x):
    comb = []
    f_left = min(x1)
    g_left = min(x2)
    extra_f = []
    extra_g = []
    extra_x = []
    left_diff = 0
    if f_left < g_left:
        left_diff += g_left - f_left
        leftmost = min(x1)
        for i in g_t_minus_x:
            extra_g.append(i)
        for i in range(0, left_diff):
            extra_f.append(0)
            extra_g.append(0)
        for i in f_x:
            extra_f.append(i)
            
    else:
        left_diff += f_left - g_left
        leftmost = min(x2)
        for i in f_x:
            extra_f.append(i)
        for i in range(0, left_diff):
            extra_g.append(0)
            extra_f.append(0)
        for i in g_t_minus_x:
            extra_g.append(i)
    
    
    extra_x_positive_y = []
    extra_x_negative_y = []
    comb_positive_y = []
    comb_negative_y = []
    
    if t >= 0:
        for i in range(0, len(extra_f)):
            comb.append(extra_f[i]*extra_g[i])
            extra_x.append(i+leftmost)
            z = extra_f[i]*extra_g[t-i]
            if z < 0:
                extra_x_negative_y.append(i+leftmost-t)
                comb_negative_y.append(-z)
            if z>0:
                extra_x_positive_y.append(i+leftmost-t)
                comb_positive_y.append(-z)
    else:
        for i in range(0, len(extra_f)):
            comb.append(extra_f[i]*extra_g[i])
            extra_x.append(i+leftmost)
            z = extra_f[i]*extra_g[-t-i]
            
            if z < 0:
                extra_x_negative_y.append(-(i+leftmost-t))
                comb_negative_y.append(z)
            if z>0:
                extra_x_positive_y.append(-(i+leftmost-t))
                comb_positive_y.append(z)
            
    return extra_x, comb, extra_x_positive_y, comb_positive_y, extra_x_negative_y, comb_negative_y 


def normalise_2(y1,y2,y3, normalisation):
    
    y3_normalised = []
    comb_positive_y_normalised = []
    comb_negative_y_normalised = []
    normalisation = 1
    for i in range(0, len(y3)):
        maximum = 0
        maximum = abs(max(y1)*max(y2))
        y3_normalised.append(normalisation*y3[i]/maximum)
    
    
    for i in  range(0, len(comb_positive_y)):
        maximum = 0
        maximum = abs(max(y1)*max(y2))
        comb_positive_y_normalised.append(normalisation*comb_positive_y[i]/maximum)
    
    
    for i in  range(0, len(comb_negative_y)):
        maximum = 0
        if max(y1) > max(y2):
            maximum += max(y1)
        else:
            maximum += max(y2)
            comb_negative_y_normalised.append(normalisation*comb_negative_y[i]/maximum)
    return y3_normalised, comb_positive_y_normalised, comb_negative_y_normalised


xlim = 100
x_range = np.linspace(-xlim,xlim,resolution)

f = Dom(x_range)
g = Omar(x_range)
f,g = normalise_1(f,g)

t = 0                     # t must be integer 

x1, y1 = g_of_t_minus_x(f, 0, original = True) #Do this to f# NOTE THAT Y1 IS NULL
x2, y2 = g_of_t_minus_x(g,t, original = False) # Do this to g                     

h = np.convolve(f,g, mode = 'same')

normalisation = 1

shade_x, shade_y_up, shade_y_down = check_zeros(y1,y2)
x3,y3, extra_x_positive_y, comb_positive_y, extra_x_negative_y, comb_negative_y = combination(y1,y2)
y3_normalised, comb_positive_y_normalised, comb_negative_y_normalised = normalise_2(y1,y2,y3,normalisation)





def plot_1():
    fig_1 = plt.figure(1)
    fig_1.set_size_inches(7,2)
    plt.plot(x1,y1, color = 'r', label = r'$f( \tau)$')
    plt.plot(x2, y2, color = 'b', label = r'$g(t- \tau)$')
    plt.xlabel(r'$\tau$', fontsize = 15)
    plt.title(r'$f(\tau) \quad$'+"and" + r'$ \quad g(t - \tau)$'+" with t=" +str(t), fontsize = 20)
    plt.legend()
    plt.plot
    
    
    
def plot_2():
    time = []
    
    for i in np.linspace(-len(h) , len(h), len(h)):
        time.append(i) 
    step = time[1] - time[0]
    
    for i in range(0, len(time)):
        if time[i] - step/2 < t and time[i] +step/2 > t:
            entry = i
            
    fig_2 = plt.figure(2)
    fig_2.set_size_inches(7,2)
    plt.plot(time,h)#, label = r'h(t)')
    plt.axvline(x = t,  color = 'g', linestyle = ':', label = "t = "+str(t))
    if t<max(time) and t>min(time):    
        plt.axhline(y = h[entry], color = 'g', linestyle = ':')
    plt.xlabel("t", fontsize = 15)
    plt.ylabel("h(t)", fontsize = 15)
    plt.title("h(t) = f * g", fontsize = 20)
    plt.legend()




def plot_3():
    fig_3 = plt.figure(3)
    fig_3.set_size_inches(7,5)
    plt.plot(x1,y1, color = 'r', label = r'f($\tau$)')
    plt.plot(x2, y2, color = 'b', label = r'g(t-$\tau$)')
    #plt.plot(x3,y3_normalised, color = 'k', label = r'f($\tau$) g(t-$\tau$)')
    plt.plot(extra_x_positive_y, comb_positive_y_normalised, color = 'k', label =  r'f($\tau$) g(t-$\tau$)')
    plt.plot(extra_x_negative_y, comb_negative_y_normalised,color = 'k')
    print len(extra_x_positive_y)
    if len(extra_x_positive_y) != 0:
        plt.fill(extra_x_positive_y, comb_positive_y_normalised, color = 'y', label = "-ve contribution to h",fill='tozeroy')
    if len(extra_x_negative_y) != 0:
        plt.fill(extra_x_negative_y, comb_negative_y_normalised, color = 'g', label = "+ve contribution to h",fill='tozeroy')
    plt.axhline(y = 0 , color = 'k', linestyle = ':')
    plt.xlabel(r'$\tau$', fontsize = 15)
    plt.title("Integral of " + r'$f(\tau) g(t - \tau) $ ' + "$\quad$ for t=" + str(t), fontsize = 20)
    #plt.axvline(x = t, linestyle = ':', color = 'b', label = 'x = t')
    #plt.axvline(x = 0, linestyle = ':', color = 'r', label = 'x = 0')
    plt.legend()

#plot_1()
plot_2()
plot_3()




"""
def convolute(f_x,g_t_minus_x):
    extra_x, comb = combination(f_x, g_t_minus_x)
    h = []
    lower_limit = min(extra_x)
"""    

#Can't currently convolute functions that have no positive values