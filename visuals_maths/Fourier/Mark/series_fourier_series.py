# -*- coding: utf-8 -*-
"""
Created on Thu Jul 05 11:14:00 2018

@author: kramm
"""
import numpy as np
import matplotlib.pyplot as plt

A = 5
L = 10.3
N = 2
"""shapes: 0 = Triangle, 1 = square, 2 = sawtooth, 3 = ?, 4 = -x/2, 5 = x^2, 6 = x, 7 = |x|, 8 = x+|x|"""
Titles = ["f(x) = Triangle", "f(x) = Square", "f(x) = Sawtooth", "f(x) = ?", "f(x) = -x/2", "$f(x) = x^2$", "f(x) = x", "f(x) = |x|", "f(x) = x+|x|"]
shape = 8
axis_length = 5 #Number of periods visualized
resolution = 10**3
x = np.linspace(-L*axis_length,L*axis_length,resolution)
decay = 0.9


spacing = 6*A #Suggest either spacing = 0 or =3, spacing separates x=0 part of cosines on cosine graph


def amplitude(n,number,x):
    if number == 0:
        amplitude = (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n)) * np.sin(x*(2*n -1) *np.pi /L)
    elif number == 1:
        amplitude = A/(n*np.pi) *(1-(-1)**n) *np.sin(n*np.pi *x/L)
    elif number ==2:
        amplitude = 2*A*(-1)**(n+1) /(n*np.pi) * np.sin(n *np.pi * x/L)
    elif number ==3:
        amplitude =8/(n*np.pi) * (-1)**(n+1)*np.sin(n*np.pi*x/L) + 2/(n*np.pi) * ((-1)**n -1)
    elif number ==4:
        amplitude = 2L/(n*np.pi)**2 *(1-(-1)**n)*np.cos(n*np.pi*x/L)
    elif number ==5: #Missed out L**2 terms here
        if n == 0 :
            amplitude = 2*(L**2)/3  
        else:
            amplitude = 4*L**2/(n*np.pi)**2 *(-1)**n *np.cos(n*np.pi*x/L)
    elif number ==6:
        amplitude = A*(2*L/(n*np.pi)**1 *(-1)**(n+1))*np.sin(n*np.pi*x/L)
    elif number ==7:
        amplitude = (2*A*L/(n*np.pi)**2)*((-1)**n - 1)*np.cos(n*np.pi*x/L) 
            
    elif number ==8:
        amplitude = A*(2*L/(n*np.pi)**1 *(-1)**(n+1))*np.sin(n*np.pi*x/L) + (2*A*L/(n*np.pi)**2)*((-1)**n - 1)*np.cos(n*np.pi*x/L)
            
    return amplitude

def summation(N,x,number): 
    """HI JACKSON! CHECK OUT LINES 52,55,56. They might be different to how you have in Javascript"""
    n = np.linspace(1,N+1,N+1)
    certain_x_value_height = []
    for i in range(0,N):
        certain_x_value_height.append(amplitude(n[i],number,x))
    certain_x_value = sum(certain_x_value_height)
    return certain_x_value
        


def plot(N,x,number):
    x_values = []
    y_values = []
    y_values_cheat = []
    for i in x:
        y_values.append(summation(N,i,number))
        x_values.append(i)
    """ LOOK HERE, THIS IS THE IMPORTANT BIT THAT FIXES THE Y VALUE OF X=0 TO 0"""
    for i in y_values:
        y_values_cheat.append(-y_values[len(y_values)/2]+i)
        
    return x_values , y_values_cheat
        


def breaks():
    breaks = np.linspace(-(axis_length)*L, (axis_length)*L,axis_length+1)
    return breaks

def centres():
    centres = np.linspace(-(axis_length-1)*L, (axis_length-1)*L,axis_length)#axis_length)
    return centres

        
plot = plot(N, x,shape)

fig_1 = plt.figure(1)
fig_1.set_size_inches(7,2)
plt.plot(plot[0],plot[1], 'r-')    #The fitted one is red
breaks = breaks()
for position in breaks:
    plt.axvline(x = position , color = 'b', linestyle = '--')
centres = centres()
for position in centres:
    plt.axvline(x = position, color = 'g', linestyle = '--')
plt.axvline(x = 0, color = 'g', linestyle = '--', label = '$Zeros$')#These are just so we don't plot 
plt.axvline(x = L, color = 'b', linestyle = '--', label = '$\pm L$')#on the legend more than once
plt.legend(loc = 1)
plt.title(Titles[shape]+",$\quad$ N = "+str(N) +",$\quad$ L = " +str(L), fontsize = 20)
"""PLOTS THE TITLE"""


def odd_amplitude2(shape,n):    
    if shape == 0:
        amplitude = (A*(-1)**n)*(decay)**n # (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n))
    elif shape == 1:
        amplitude = (A*(1-(-1)**n))*(decay)**n #A/(n*np.pi) *(1-(-1)**n)
    elif shape ==2:
        amplitude = (A*(-1)**(n+1))*(decay)**n #2*A*(-1)**(n+1) /(n*np.pi) 
    elif shape ==3:
        amplitude = 0
    elif shape ==4:
        amplitude = 0
    elif shape ==5:
        amplitude =0    
    elif shape ==6:
        amplitude = A*(2*(-1)**(n+1))*(decay)**n#Missed *L
    elif shape ==7:
        amplitude = 0
    elif shape ==8:
        amplitude = A*(2*(-1)**(n+1))*(decay)**n#Missed *L
    return amplitude
    
def even_amplitude2(shape,n):
    if shape ==0:
        amplitude = 0
    elif shape ==1:
        amplitude =0
    elif shape ==2:
        amplitude = 0
    elif shape ==3:
        amplitude = A*(2*(-1)**(n+1))*(decay)**n#8/n*np.pi *(-1)**(n+1)
    elif shape ==4:
        amplitude = A*(2/(n*np.pi)**0 *(1-(-1)**n))*(decay)**n # Missed *L
    elif shape ==5:
        amplitude = A*(4/(n*np.pi)**0 *(-1)**n)*(decay)**n # Left out an L^2 dependence for ease of visualization
    elif shape ==6:
        amplitude =0
    elif shape ==7:
        amplitude = 2*A*((-1)**n - 1)#Missed *L
    elif shape ==8:
        amplitude = 2*A*((-1)**n - 1)#Missed *L
    return amplitude

def sines(n,x,shape):
    all_y_for_n = []
    all_x_for_n = []
    for i in x:
        all_y_for_n.append(((odd_amplitude2(shape,n)*np.sin(n*np.pi*i/L))+(even_amplitude2(shape,n)*np.cos(n*np.pi*i/L))+spacing*(n)))
        all_x_for_n.append(i)
    fig_2 = plt.figure(2)
    fig_2.set_size_inches(7,3)
    plt.plot(all_x_for_n, all_y_for_n) 
    return all_y_for_n


def plot2(N,x,shape):
    array_of_y_values = []
    for n in range(1,N+1):#########NOTE I started this on 1, not zero because it just looks ugly, so we should change the N slider to start at 1, not zero
        array_of_y_values.append(sines(n,x,shape))
    return  
        
plot2 = plot2(N,x,shape)








def amplitude3(shape, n):
    if shape ==8:
        amplitude = (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n))    
    return amplitude


    
def set_of_coefficients():
    k = [] # k = n pi/L
    Ik = []
    term = []
    for n in range(1, N+1):
        k.append(n*np.pi/L)
        term.append(n)
        Ik.append(amplitude3(shape, n))

    return k, Ik, term
k,Ik, terms = set_of_coefficients()
print (k, Ik)
"""
def Count_amplitude(x,y):
    z = []
    for i in range(1,len(x)+1):
        for j in range(0, (y[i-1])):
            z.append(x[i-1])
    return (z)

Ik = Count_amplitude(terms,Ik)


fig_1 = plt.figure(1)
fig_1.set_size_inches(7,2)
numb_bins = len(k)
n, bins, patches = plt.hist(Ik, num_bins, facecolor='blue', alpha=0.5)
plt.show()

"""