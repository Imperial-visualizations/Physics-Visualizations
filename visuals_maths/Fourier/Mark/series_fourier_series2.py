# -*- coding: utf-8 -*-
"""
Created on Thu Jul 05 11:14:00 2018

@author: kramm
"""
import numpy as np
import matplotlib.pyplot as plt



"""shapes: 0 = Triangle, 1 = square, 2 = sawtooth, 3 = ?, 4 = -x/2, 5 = x^2, 6 = x, 7 = |x|, 8 = x+|x|"""
Titles = ["f(x) = Triangle", "f(x) = Square", "f(x) = Sawtooth", "f(x) = ?", "f(x) = -x/2", "$f(x) = x^2$", "f(x) = x", "f(x) = |x|", "f(x) = x+|x|"]


A = 5
L = 12.03
N = 10
histogram_accuracy = 1000 #Suggest 1000
shape = 8
axis_length = 5 #Number of periods visualized
resolution = 10**4
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
        amplitude =8/(n*np.pi) * (-1)**(n+1)*np.sin(n*np.pi*x/L) + 2/(n*np.pi) * ((-1)**n -1)*np.cos(n*np.pi*x/L)
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
        if n == 0 :
            amplitude  = L
        else:
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


def an(shape, n):
    if shape ==0:
        amplitude = 0
    elif shape ==1:
        amplitude =0
    elif shape ==2:
        amplitude = 0
    elif shape ==3:
        if n == 0 :
            amplitude = 6 #NOT CORRECT
        else:    
            amplitude = 2/(n*np.pi) * ((-1)**n -1)#8/n*np.pi *(-1)**(n+1)
    elif shape ==4:
        if n ==0:
            amplitude = 12 #NOT CORRECT
        else:    
            amplitude = 2L/(n*np.pi)**2 *(1-(-1)**n) # Missed *L
    elif shape ==5:
        if n == 0 :
            amplitude = 2*(L**2)/3  
        else:
            amplitude =4*L**2/(n*np.pi)**2 *(-1)**n # Left out an L^2 dependence for ease of visualization
    elif shape ==6:
        amplitude =0
    elif shape ==7:
        if n == 0 :
            amplitude = L
        else:
            amplitude = (2*A*L/(n*np.pi)**2)*((-1)**n - 1)#Missed *L
    elif shape ==8:
        if n == 0:
            amplitude  =L
        else:
            amplitude = (2*A*L/(n*np.pi)**2)*((-1)**n - 1)#Missed *L
    return amplitude

def bn(shape, n):
    if n == 0:
        amplitude = 0
    else:
        if shape == 0:
            amplitude = (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n))# (8*A*1/((2*(n)-1) *np.pi)**2)*((-1)**(n))
        elif shape == 1:
            amplitude =  A/(n*np.pi) *(1-(-1)**n) #A/(n*np.pi) *(1-(-1)**n)
        elif shape ==2:
            amplitude = 2*A*(-1)**(n+1) /(n*np.pi) #2*A*(-1)**(n+1) /(n*np.pi) 
        elif shape ==3:
            amplitude = 8/(n*np.pi) * (-1)**(n+1)
        elif shape ==4:
            amplitude = 0
        elif shape ==5:
            amplitude =0    
        elif shape ==6:
            amplitude = A*(2*L/(n*np.pi)**1 *(-1)**(n+1))#Missed *L
        elif shape ==7:
            amplitude = 0
        elif shape ==8:
            amplitude = A*(2*L/(n*np.pi)**1 *(-1)**(n+1))#Missed *L
    return amplitude
    

def coefficients():
    n = []
    a_n = []
    b_n = []
    alpha_n = []
    theta_n = []
    for i in range(0, N):
        n.append(i)
        a_n.append(an(shape,i))
        b_n.append(bn(shape,i))
        alpha_n.append(np.sqrt((an(shape, i))**2 + (bn(shape, i))**2))
        if an(shape, i) ==0 :
            if bn(shape, i) >0:
                theta_n.append(np.pi /2) 
            else:
                theta_n.append(-np.pi/2)
        else:
            theta_n.append(np.arctan(bn(shape,i)/an(shape,i)))
    return n, a_n, b_n, alpha_n, theta_n


n, an_set, bn_set, alpha_n_set, theta_n_set = coefficients()


def sign_split(data):
    positive_terms = []
    negative_terms = []
    for i in data:
        if i>0:
            positive_terms.append(i)
            negative_terms.append(0)
        else:
            positive_terms.append(0)
            negative_terms.append(i)
    return positive_terms, negative_terms
    

        
    
a_n,a__n = sign_split(an_set)
b_n, b__n = sign_split(bn_set)


def bar_breaks(n):
    breaks = np.linspace(-0.5, max(n)+0.5,len(n)+1)
    return breaks





if (a_n[N-2])**2 + (a__n[N-2]) +(a_n[N-1])**2 + (a__n[N-1])**2 != 0:
    fig_3 = plt.figure(3)
    fig_3.set_size_inches(7,3)
    plt.bar(n, a_n, width=1, color='r', label = "Positive contributions")
    plt.bar(n, a__n, width=1, color='b', label = "Negative contributions")
    plt.title(r'$a_n$' +"a_n as a function of n", fontsize = 20)
    plt.axhline(y = 0, color = 'K', linestyle = '--')
    plt.legend(loc = 1, fontsize = 10)
    bar_breaks_an = bar_breaks(n)
    for position in bar_breaks_an:
        plt.axvline(x = position , color = 'k', linestyle = ':')
    plt.xlim(-0.5, len(n)+0.5)
    plt.xticks(np.arange(0, len(n), step=1))
    plt.xlabel(r'$n$', fontsize = 20)
    plt.ylabel(r'$a_n$', fontsize = 20)
    
    
    
if (b_n[N-2])**2 + (b_n[N-2])**2 + (b_n[N-1])**2 + (b__n[N-1])**2 != 0:
    fig_4 = plt.figure(4)
    fig_4.set_size_inches(7,3)
    plt.bar(n, b_n, width=1, color='r', label = "Positive contributions")
    plt.bar(n, b__n, width=1, color='b', label = "Negative contributions")
    plt.title(r'$b_n$' +"as a function of n", fontsize = 20)
    plt.axhline(y = 0, color = 'k', linestyle = '--')
    plt.legend(loc = 1, fontsize = 10)
    for position in bar_breaks_an:
        plt.axvline(x = position , color = 'k', linestyle = ':')
    plt.xlim(0.5, len(n)-0.5)
    plt.xticks(np.arange(0, len(n), step=1))
    plt.xlabel(r'$n$', fontsize = 20)
    plt.ylabel(r'$b_n$', fontsize = 20)
    
fig_5 = plt.figure(5)
fig_5.set_size_inches(7,3)
plt.bar(n, alpha_n_set, width = 1, color = 'r' )
plt.title(r'$\alpha_{n}$' +"as a function of n", fontsize = 20)
for position in bar_breaks_an:
    plt.axvline(x = position , color = 'k', linestyle = ':')
    plt.xlim(-0.5, len(n)-0.5)
plt.xticks(np.arange(0, len(n), step=1))
plt.xlabel(r'$n$', fontsize = 20)
plt.ylabel(r'$\alpha_n$', fontsize = 20)




check = []
for i in bn_set:
    if i != 0:
        check.append(i)
if len(check) != 0:
    fig_6 = plt.figure(6)
    fig_6.set_size_inches(7,3)
    plt.bar(n, theta_n_set, width = 1, color = 'b')
    plt.title("Power spectrum phase terms", fontsize = 20)
    plt.axhline(y = 0, color = 'k', linestyle = '--')
    for position in bar_breaks_an:
        plt.axvline(x = position , color = 'k', linestyle = ':')
        plt.xlim(0.5, len(n)-0.5)
    plt.xticks(np.arange(0, len(n), step=1))
    plt.ylabel(r'$\theta_{n}$', fontsize = 20)
    plt.xlabel(r'$n$', fontsize = 20)
    plt.xlim(0.5, len(n) +0.5)
    
else:
    print("Function is even, so no phase terms in power spectrum")
    """SHOULD PROBABLY PUT AN EVEN/ODD CHECK FURTHER UP"""


def term_parity(n):
    even_n = []
    odd_n = []
    for i in n:
        if int(i%2) == 0:
            even_n.append(i)
            odd_n.append(0)
        else:
            even_n.append(0)
            odd_n.append(i)
    return even_n, odd_n

even_n, odd_n = term_parity(n)



def bar_breaks_parity(n):
    breaks = np.linspace(0.5, max(n)+0.5,len(n))
    return breaks

"""
if (an_set[N-2])**2 + (an_set[N-2]) + (an_set[N-1])**2 + (an_set[N-1])!= 0:
    fig_7 = plt.figure(7)
    fig_7.set_size_inches(7,3)
    plt.bar(even_n, an_set, width = 1, color = 'r', label = "Even n")
    plt.bar(odd_n, an_set, width = 1, color = 'b', label = "Odd n")
    plt.title("Plot of $a_n$ terms for odd and even n", fontsize = 20)
    plt.axhline(y = 0, color = 'k', linestyle = '--')
    plt.legend(loc = 1)
    plt.xlim(1, len(n))
    plt.xticks(np.arange(0, len(n), step=1))
    for position in bar_breaks_an:
        plt.axvline(x = position , color = 'k', linestyle = ':')

if (bn_set[N-2])**2 + (bn_set[N-2]) +(bn_set[N-1])**2 + (bn_set[N-1]) != 0:
    fig_8 = plt.figure(8)
    fig_8.set_size_inches(7,3)
    plt.bar(even_n, bn_set, width = 1, color = 'r', label = "Even n")
    plt.bar(odd_n, bn_set, width = 1, color = 'b', label = "Odd n")
    plt.title("Plot of $b_n$ terms for odd and even n", fontsize = 20)
    plt.axhline(y = 0, color = 'k', linestyle = '--')
    plt.legend(loc = 1)
    plt.xlim(1, len(n))
    plt.xticks(np.arange(0, len(n), step=1))
    bar_breaks_an_parity = bar_breaks_parity(n)
    for position in bar_breaks_an_parity:
        plt.axvline(x = position , color = 'k', linestyle = ':')
"""


def sine_n(x_triangle, n):
    x = x_triangle
    sin = []
    for x in x_triangle:
        sin.append(np.sin(n*np.pi*x/L))
    return sin
    



x_triangle = np.linspace(0,L,resolution)
x_first_branch = []
y_first_branch = []
y_second_branch = []
x_second_branch = []

for i in range(0, len(x_triangle)/2):
    y_first_branch.append(2*A/L*x_triangle[i])
    x_first_branch.append(x_triangle[i])#L*i/len(x_triangle))
    
for i in range(1+len(x_triangle)/2,len(x_triangle) ):
    y_second_branch.append(-2*A/L*(x_triangle[i]-L))
    x_second_branch.append(x_triangle[i])#L*i/len(x_triangle))


#lowercase_n = 53

"""
for i in range(1,11,2):
    lowercase_n = i        
    fig_9 = plt.figure(9)
    fig_9.set_size_inches(7,2)
    plt.plot(x_first_branch,y_first_branch, 'b-')    
    plt.plot(x_second_branch, y_second_branch, 'b')
    plt.axvline(x = x_second_branch[0], color = 'k', linestyle = ':')
    triangle_sine = sine_n(x_triangle, lowercase_n)
    plt.plot(x_triangle, triangle_sine)#, color = 'r')
    plt.axhline(y = 0, color = 'k', linestyle = ':')
    plt.title("Odd n")


for i in range(2,12,2):
    lowercase_n = i        
    fig_10 = plt.figure(10)
    fig_10.set_size_inches(7,2)
    plt.plot(x_first_branch,y_first_branch, 'b-')    
    plt.plot(x_second_branch, y_second_branch, 'b')
    plt.axvline(x = x_second_branch[0], color = 'k', linestyle = ':')
    triangle_sine = sine_n(x_triangle, lowercase_n)
    plt.plot(x_triangle, triangle_sine)#, color = 'r')
    plt.axhline(y = 0, color = 'k', linestyle = ':')
    plt.title("Even n")
#Could also plot the multiplication of the two elements so the idea of
#the integration is more easily seen
"""


x_all = np.concatenate((x_first_branch, x_second_branch), axis = 0)
y_all = np.concatenate((y_first_branch, y_second_branch), axis = 0)



def combination(triangle, y):
    combination = []
    for i in range(0, len(triangle)):
        combination.append(triangle[i] * y[i])
    return combination


lowercase_n = 7
triangle_combination = combination(y_all,sine_n(x_triangle, lowercase_n))
triangle_combination_first_branch = combination(y_first_branch, sine_n(x_first_branch, lowercase_n))
triangle_combination_second_branch = combination(y_second_branch, sine_n(x_second_branch, lowercase_n))

fig_11 = plt.figure(11)
fig_11.set_size_inches(7,2)
plt.plot(x_first_branch,y_first_branch, 'b-')    
plt.plot(x_second_branch, y_second_branch, 'b')
plt.axvline(x = x_second_branch[0], color = 'k', linestyle = ':')


triangle_sine = sine_n(x_triangle, lowercase_n)
plt.plot(x_triangle, triangle_sine)#, color = 'r')
    
    
plt.axhline(y = 0, color = 'k', linestyle = ':')




fig_12 = plt.figure(12)
fig_12.set_size_inches(7,2)
plt.plot(x_all,triangle_combination, 'b-')   
plt.axhline(y = 0, color = 'k', linestyle = ':')
plt.axvline(x = x_all[-1]/2,color = 'k', linestyle = ':' )
plt.title(r'$ \sin(\frac{n \pi x}{L}) f(x)$', fontsize = 10)
if lowercase_n % 2 ==0:
    plt.fill(x_first_branch, triangle_combination_first_branch, color = 'r')
    plt.fill(x_second_branch, triangle_combination_second_branch, color = 'g')
else:  
    plt.fill(x_all, triangle_combination, color = 'r')


# Important points: that there is a change of sign at L/2 for even n, and so the combination
#function is odd about L/2. This is made more obvious by proving that for even n,
#the function has a zero for x = L/2. This is because of sin(npix/L).
#Note then that the opposite is true for odd n, how sin(n pi x/L) is never zero at L/2. 
#infact a maximum of the function exists here, and so the combination is even about this
#point. And so the integration is finite.
#Note then that the area under the graph between 0 and L/2 and the area between L/2 ad L
#are equal, this means we only have to consider the area between 0 and L/2 (the simplest equation)
#and then just multiply by two. And so we have made our job insanely easier.

