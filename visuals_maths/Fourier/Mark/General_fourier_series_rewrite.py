import numpy as np
import matplotlib.pyplot as plt
import scipy

import plotly
plotly.offline.init_notebook_mode(connected = True)
import plotly.offline as py

resolution = 10**3
L = 10
N = 100

"""WRITE A FUNCTION HERE"""
function = "np.sin(x)"

def y_values(x_range):
    """Creates the specified function along the set x domain"""
    y = []
    for x in x_range:
        y.append(eval(function))   
    return y

x_original = np.linspace(-L,L, resolution)
y_original = y_values(x_original)

def an(input_function_values,n,x):
    """Finds an for a particular n for the function"""
    cos_npix = []# List of cosine for different x values for one particular n
    for i in range(0, len(input_function_values)):
        cos_npix.append(np.cos(n*np.pi*x[i]/L))#Works out cos_npix for all x values in range
    integrand = []   
    for i in range(0,len(input_function_values)):
        integrand.append(input_function_values[i] * cos_npix[i])#Multiplies
        #each value of the input function at all x by the corresponding cos_npix
    a_n = scipy.integrate.simps(integrand, x, dx = 2*L / resolution)/L
    """Uses simpsons rule to integrate and get the correct value"""
    return a_n

def bn(input_function_values,n,x):
    """Finds bn for a particular n for the function"""
    sin_npix = []# List of sine for different x values for one particular n
    for i in range(0, len(input_function_values)):
        sin_npix.append(np.sin(n*np.pi*x[i]/L))#Works out sin_npix for all x values in range
    integrand = []   
    for i in range(0,len(input_function_values)):
        integrand.append(input_function_values[i] * sin_npix[i])#Multiplies
        #each value of the input function at all x by the corresponding sin_npix
    """Again using simpsons rule"""
    b_n = scipy.integrate.simps(integrand, x, dx = 2*L / resolution)/L
    return b_n

def Fourier_coefficients(input_function_values,N,x):
    """Calls up both an and bn, will later retrieve alpha and theta"""
    a_n = []    #Lis of a_n for all n
    b_n = []
    alpha_n = []
    theta_n = []
    for n in range(0, N):
        a = an(input_function_values,n, x)
        b = bn(input_function_values,n, x)
        a_n.append(a)
        b_n.append(b)
        alpha_n.append(np.sqrt(a**2 + b**2))
        if a ==0:#Python can't deal with arctan(+/- infinity)
            if b>=0:
                theta_n.append(np.pi/2)
            else:
                theta_n.append(-np.pi/2)
        else:
            theta_n.append(np.arctan(b/a))
    return a_n, b_n#, alpha_n, theta_n

def Trig_summation_x(an,bn, x_value, N):
    """Finds the y value for an input function for a particular point x in the domain"""
    y_value = [an[0]/2]#Start with the a0 term
    for n in range(1, N):
        y_value.append(an[n]*np.cos(n*np.pi*x_value/L) + bn[n]*np.sin(n*np.pi*x_value/L)) #Sum the rest of n
    return sum(y_value)

def Trig_summation_n(an, bn,x,N):
    """Calculates all y values for every point in the function"""
    y_values = []
    for i in range(0, len(x)):#Finding y_values for all x
        y_values.append(Trig_summation_x(an,bn, x[i], N))
    return y_values

# Was to plot power spectrum, not needed yet though.
def Power_summation_x(an, alphan, thetan, x_value, N):
    y_value = [an[0]/2]
    for n in range(0, N):
        y_value.append(alphan[n] *np.cos((+n*np.pi*x_value/L) - thetan[n]))
    return sum(y_value)

def Power_summation_n(an, alphan, thetan, x, N):
    y_values = []
    for i in  range(0, len(x)):
        y_values.append(Power_summation_x(an, alphan, thetan, x[i], N))
    return y_values

def Assert_periodicity(x,y,periods): #Number of periods must be odd for now, this func isn't necessary
    """Makes it so we can plot more than one cycle of the function that
    is forced to be periodic over the interval [-L,L], we should see that
    we get Gibbs phenomena at +/- L's."""
    extra_long_x = []
    extra_long_y = []
    for i in range(0, periods):
        for j in range(0, len(x)):
            extra_long_x.append(x[j] - 2*L*i)
            extra_long_y.append(y[j])
    return extra_long_x, extra_long_y

def Plot(x,y,N, periods):
    """
    a_n, b_n , alpha_n, theta_n = Fourier_coefficients(y, N, x)
    y_values_1 = Trig_summation_n(a_n, b_n, x,N)
    #y_values_2 = Power_summation_n(a_n, alpha_n, theta_n, x,N) #Not working yet
    #x,y_values_1 = Assert_periodicity(x, y_values_1, periods)#Not working yet
    fig_1 = plt.figure(1)
    fig_1.set_size_inches(7,3)
    plt.plot(x,y_values_1)#, color = 'b')#, label = "Series approximation")
    plt.plot(x_original,y_original, color = 'r')#, label = 'Original function')
    plt.legend(loc = 1)
    #plt.title(r'Plot of $\quad$' + function +r'$\quad$ with N = ' + str(N), fontsize = 20)
    #Just for plotting power spectrum approximation #Not currently working
    """
    """
    fig_2 = plt.figure(2)
    fig_2.set_size_inches(7,3)
    plt.plot(x,y_values_2, color = 'r', label = "Power")
    plt.legend()
    """
    
    a_n, b_n  = Fourier_coefficients(y, N, x) #Retrieves an and bn
    y_values =  Trig_summation_x(a_n, b_n, x,N)#Uses an and bn to reconstruct the function for finite N
    
    fig_1 = plt.figure(1)
    fig_1.set_size_inches(7,3)
    plt.plot(x,y_values, color = 'b', label = "Series approximation")
    plt.legend(loc = 1)
    py.iplot([{"x": x, "y": y_values}])
    
    

def Frequency_space(x,y,N):
    """Plots Fourier coefficients as a function of n"""
    a_n, b_n = Fourier_coefficients(y,N,x)#, alpha_n, theta_n = Fourier_coefficients(y,N,x)
    na = []
    nb = []
    for i in range(0, N):
        na.append(i)
        nb.append(N-i)#Reverses order of bn plot, just for ease of bug checking for now    
    fig_3 = plt.figure(3)
    fig_3.set_size_inches(7,3)
    #plt.bar(na,a_n, color = 'b', label = "a_n")
    #plt.plot(na, a_n_abs, color = 'k')
    #plt.plot(nb,b_n_abs, color = 'k')
    
    #plt.bar(na,alpha_n, color = 'r', label = r'$alpha_{n}$')
    #plt.plot(na, alpha_n, color  ='k')
    #plt.legend(loc = 1)
    #plt.xlim(0, N)
    
    #fig_4 = plt.figure(4)
    #fig_4.set_size_inches(7,3)
    # plt.bar(na, theta_n, color = 'b')
    
Plot(x_original,y_original,N,1)
Frequency_space(x_original,y_original,N)


def Error(x,y,N):
    a_n, b_n = Fourier_coefficients(y,N,x)
    y_values =  Trig_summation_x(a_n, b_n, x,N)
    diff_squared = []
    for i in range(0, len(y)):
        diff_squared.append((y[i] - y_values[i])**2)
        
    A = scipy.integrate.simps(diff_squared, x, dx = 2*L / resolution)
    print ("Error is ", A)
    
for i in range(2, 10):
    Error(x_original, y_original, i)



"""
x = np.linspace(0, 1, 10**5)
y = []
for i in x:
    y.append(4/(1+ i**2))
#x = [1,2,3,4,5]
#y = [5,4,7,4,6]

def integrate_rect(x,y):
    A = 0
    for i in range(0, len(x)-1):
        A += (x[i+1] - x[i]) * (y[i+1] + y[i])
    return A/2

z = integrate_rect(x,y)
print (z)

def integrate_traps(x,y):
    a = x[0]
    b = x[-1]
    N = len(x)
    h = (b-a)/N
    A = 0
    for i in range(1, len(x)-1):
        A += y[i]
    A = 2*A
    A += (y[0] + y[-1])
    A = A*h/2
    return A

zz = integrate_traps(x,y)
print (zz)
"""
def integrate_simps(x,y):
    a = x[0]
    b = x[-1]
    N = len(x)
    h = (b-a)/N
    A = 0
    for i in range(1, len(x)-1):
        if i%2 == 0:
            A += 2*y[i]
        else:
            A+= 4*y[i]
    A += y[0] + y[-1]
    A = A*h/3
    return A

zzz = integrate_simps(x,y)
print (zzz)