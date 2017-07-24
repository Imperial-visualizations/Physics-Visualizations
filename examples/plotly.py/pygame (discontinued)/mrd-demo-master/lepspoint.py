#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Created on Wed May 17 10:41:56 2017

@author: Tristan Mackenzie

    This file is part of LepsPy.

    LepsPy is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    LepsPy is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with LepsPy.  If not, see <http://www.gnu.org/licenses/>.

"""

import numpy as np

def lepspoint(drab,drbc,theta,Drab,Drbc,Drac,Brab,Brbc,Brac,lrab,lrbc,lrac,H,grad):

# Gives the Energy and first derivative and Hessian at any point on LEPS surface.
    
    drac = ((drab ** 2) + (drbc ** 2) - 2 * drab * drbc * np.cos(theta)) ** 0.5

    #ENERGY
    # morse (y) and anti morse (z) functions
    ydrab =  Drab      * (np.exp(-2 * Brab * (drab - lrab)) - (2 * np.exp(-Brab * (drab - lrab))))
    zdrab = (Drab / 2) * (np.exp(-2 * Brab * (drab - lrab)) + (2 * np.exp(-Brab * (drab - lrab))))
    ydrbc =  Drbc      * (np.exp(-2 * Brbc * (drbc - lrbc)) - (2 * np.exp(-Brbc * (drbc - lrbc))))
    zdrbc = (Drbc / 2) * (np.exp(-2 * Brbc * (drbc - lrbc)) + (2 * np.exp(-Brbc * (drbc - lrbc))))
    ydrac =  Drac      * (np.exp(-2 * Brac * (drac - lrac)) - (2 * np.exp(-Brac * (drac - lrac))))
    zdrac = (Drac / 2) * (np.exp(-2 * Brac * (drac - lrac)) + (2 * np.exp(-Brac * (drac - lrac))))
    
    # Coulomb (Q) and Exchange (J) integrals
    k = 0.18 # In TRIATOMICS this is 0.18 but should be sato parameter?
    Qdrab = (ydrab + zdrab + k * (ydrab - zdrab)) / 2
    Jdrab = (ydrab - zdrab + k * (ydrab + zdrab)) / 2
    Qdrbc = (ydrbc + zdrbc + k * (ydrbc - zdrbc)) / 2
    Jdrbc = (ydrbc - zdrbc + k * (ydrbc + zdrbc)) / 2
    Qdrac = (ydrac + zdrac + k * (ydrac - zdrac)) / 2
    Jdrac = (ydrac - zdrac + k * (ydrac + zdrac)) / 2
    
    # Potential Energy
    sq = H ** 2
    ist = 1 # 1 for ground state, >1 for excited states
    FKK = 0.5 * ((Jdrab - Jdrbc) ** 2 + (Jdrbc - Jdrac) ** 2 + (Jdrac - Jdrab) ** 2)
    V = 1 / (1 + sq) * (Qdrab + Qdrbc + Qdrac - ist * (FKK ** 0.5))
    
    r  = np.zeros((3))
    dd = np.zeros((3))
    fa = np.zeros((3))
    re = np.zeros((3))
    dr = np.zeros((3))
    
    dmdr   = np.zeros((3))
    dmsdr  = np.zeros((3))
    dmdr2  = np.zeros((3))
    dmsdr2 = np.zeros((3))
    dQdr   = np.zeros((3))
    dJdr   = np.zeros((3))
    dQdr2  = np.zeros((3))
    dJdr2  = np.zeros((3))
    
    # FIRST DERIVATIVE
    if (grad != 0):
        r[0] = drab
        r[1] = drbc
        r[2] = drac
        dd[0] = Drab
        dd[1] = Drbc
        dd[2] = Drac
        fa[0] = Brab
        fa[1] = Brbc
        fa[2] = Brac
        re[0] = lrab
        re[1] = lrbc
        re[2] = lrac
        term = 1 / drac
    
        for m in range(3):
           dr[m] = r[m] - re[m] 
           ex1 = np.exp( - fa[m] * dr[m])
           ex2 = ex1 * ex1
    
           dmdr[m]   = dd[m] * ((-2 * fa[m]         * ex2) + (2 * fa[m]         * ex1))# morse 1st deriv
           dmsdr[m]  = dd[m] * ((   - fa[m]         * ex2) - (    fa[m]         * ex1))# anti-morse 1st deriv
           dmdr2[m]  = dd[m] * (( 4 * fa[m] * fa[m] * ex2) - (2 * fa[m] * fa[m] * ex1))
           dmsdr2[m] = dd[m] * (( 2 * fa[m] * fa[m] * ex2) + (    fa[m] * fa[m] * ex1))
     
           dQdr[m]  = 0.5 * ((dmdr[m]  + dmsdr[m] ) + k * (dmdr[m]  - dmsdr[m] )) # coulomb 1st deriv
           dJdr[m]  = 0.5 * ((dmdr[m]  - dmsdr[m] ) + k * (dmdr[m]  + dmsdr[m] )) # exchange 1st deriv
           dQdr2[m] = 0.5 * ((dmdr2[m] + dmsdr2[m]) + k * (dmdr2[m] - dmsdr2[m]))
           dJdr2[m] = 0.5 * ((dmdr2[m] - dmsdr2[m]) + k * (dmdr2[m] + dmsdr2[m]))
    
        xdQdr1 = dQdr[2] * (r[0] - r[1] * np.cos(theta)) * term 
        xdQdr2 = dQdr[2] * (r[1] - r[0] * np.cos(theta)) * term
        xdQdro = dQdr[2] * (r[0] * r[1] * np.sin(theta)) * term 

        xdJdr1 = dJdr[2] * (r[0] - r[1] * np.cos(theta)) * term 
        xdJdr2 = dJdr[2] * (r[1] - r[0] * np.cos(theta)) * term
        xdJdro = dJdr[2] * (r[0] * r[1] * np.sin(theta)) * term
    
        xmu  = xdJdr1 - dJdr[0]
        xnew = (Jdrbc - Jdrac) * (-xdJdr1)
        ymu  = dJdr[1] - xdJdr2
        ynew = (Jdrac - Jdrab) * xdJdr2
    
        tm1 = ( (Jdrab - Jdrbc) * dJdr[0] + (Jdrac - Jdrab) * xmu + xnew) * 0.5 * (1 / (FKK ** 0.5))
        tm2 = (-(Jdrab - Jdrbc) * dJdr[1] + (Jdrbc - Jdrac) * ymu + ynew) * 0.5 * (1 / (FKK ** 0.5))
        tm3 = (-(Jdrbc - Jdrac) * xdJdro  + (Jdrac - Jdrab) * xdJdro)     * 0.5 * (1 / (FKK ** 0.5))
 
        Frab = -1 / (1 + sq) * (dQdr[0] + xdQdr1 - ist * tm1)
        Frbc = -1 / (1 + sq) * (dQdr[1] + xdQdr2 - ist * tm2)
        Frac = -1 / (1 + sq) * (xdQdro - ist * tm3)
    
    # SECOND DERIVATIVE
        if (grad == 2):    
              bgt1 = dQdr2[2] * ((r[0] - r[1] * np.cos(theta)) * term) ** 2
              bgt2 = (-(r[0] - r[1] * np.cos(theta)) ** 2 *(term ** 3) + term)
              xdQr1r1 = bgt1 + bgt2 * dQdr[2]
              bzt1 = dJdr2[2] * ((r[0] - r[1] * np.cos(theta)) * term) ** 2
              bzt2 = (-(r[0] - r[1] * np.cos(theta)) ** 2 * (term ** 3) + term)
              xdJr1r1 = bzt1 + bzt2 * dJdr[2]
    
              yy = (r[1] - r[0] * np.cos(theta))
              bgt1 = dQdr2[2] * (r[0] - r[1] * np.cos(theta)) * term ** 2 * yy
              bgt2 = (-(r[0] - r[1] * np.cos(theta)) * yy * (term ** 3) - term * np.cos(theta))
              xdQr1r2 = bgt1 + bgt2 * dQdr[2]
              bzt1 = dJdr2[2] * (r[0] - r[1] * np.cos(theta)) * term ** 2 * yy
              bzt2 = (-(r[0] - r[1] * np.cos(theta)) * yy * (term ** 3) - term * np.cos(theta))
              xdJr1r2=bzt1+bzt2*dJdr[2]
    
              yy = (r[0] * r[1] * np.sin(theta))
              bgt1 = dQdr2[2] * (r[0] - r[1] * np.cos(theta)) * term ** 2 * yy
              bgt2 = (-(r[0] - r[1] * np.cos(theta)) * yy * (term ** 3) + term * yy / r[0])
              xdQr1ro = bgt1 + bgt2 * dQdr[2]
              bzt1 = dJdr2[2] * (r[0] - r[1] * np.cos(theta)) * term ** 2 * yy
              bzt2 = (-(r[0] - r[1] * np.cos(theta)) * yy * (term ** 3) + term * yy / r[0])
              xdJr1ro = bzt1 + bzt2 * dJdr[2]
    
              yy = (r[0] * r[1] * np.sin(theta))
              bgt1 = dQdr2[2] * (r[1] - r[0] * np.cos(theta)) * term ** 2 * yy
              bgt2 = (-(r[1] - r[0] * np.cos(theta)) * yy * (term ** 3) + term * yy / r[1])
              xdQr2ro = bgt1 + bgt2 * dQdr[2]
              bzt1 = dJdr2[2] * (r[1] - r[0] * np.cos(theta)) * term ** 2 * yy
              bzt2 = (-(r[1] - r[0] * np.cos(theta)) * yy * (term ** 3) + term * yy / r[1])
              xdJr2ro = bzt1 + bzt2 * dJdr[2]
    
              bgt1 = dQdr2[2] * ((r[1] - r[0] * np.cos(theta)) * term) ** 2
              bgt2 = (-(r[1] - r[0] * np.cos(theta)) ** 2 * (term ** 3) + term)
              xdQr2r2 = bgt1 + bgt2 * dQdr[2]
              bzt1 = dJdr2[2] * ((r[1]-r[0] * np.cos(theta)) * term) ** 2
              bzt2 = (-(r[1] - r[0] * np.cos(theta)) ** 2 * (term ** 3) + term)
              xdJr2r2 = bzt1 + bzt2 * dJdr[2]

              blt = r[0] * r[1] * np.cos(theta)
              bgt1 = dQdr2[2] * ((r[0] * r[1] * np.sin(theta)) * term) ** 2
              bgt2 = -(r[0] * r[1] * np.sin(theta)) ** 2 * (term ** 3) + term * blt
              xdQroro = bgt1 + bgt2 * dQdr[2]
              bzt1 = dJdr2[2] * ((r[0] * r[1] * np.sin(theta)) * term) ** 2
              bzt2 = -(r[0] * r[1] * np.sin(theta)) ** 2 * (term ** 3) + term * blt
              xdJroro = bzt1 + bzt2 * dJdr[2]
    
              fn1 = (Jdrab - Jdrbc) * dJdr[0] + (Jdrac - Jdrab) * (xdJdr1 - dJdr[0])
              fn1 = fn1 + (Jdrbc - Jdrac) * (-xdJdr1)
              f2  = (Jdrab - Jdrbc) * dJdr2[0] + (dJdr[0] ** 2)
              f3  = (Jdrac - Jdrab) * (xdJr1r1 - dJdr2[0]) + (xdJdr1 - dJdr[0]) ** 2
              fn2 = f2 + f3
              fn2 = fn2 + (Jdrbc - Jdrac) * (-xdJr1r1) + (-xdJdr1) ** 2
    
              fn3 = (-dJdr[1]) * dJdr[0] + (Jdrbc - Jdrac) * (-xdJr1r2)
              fn3 = fn3 + (Jdrac - Jdrab) * xdJr1r2 + xdJdr2 * (xdJdr1 - dJdr[0])
              fn3 = fn3 + (dJdr[1] - xdJdr2) * (-xdJdr1)
              fn4 = ((-Jdrab + Jdrbc) * dJdr[1]) + (Jdrbc - Jdrac) * (dJdr[1] - xdJdr2)
              fn4 = fn4 + (Jdrac - Jdrab) * xdJdr2
    
              fn3i = (Jdrbc - Jdrac) * (-xdJr1ro) + xdJdr1 * xdJdro
              fn3i = fn3i + (Jdrac - Jdrab) * xdJr1ro + xdJdro * (xdJdr1 - dJdr[0])
              fn4i = (Jdrbc - Jdrac) * (-xdJdro)
              fn4i = fn4i + (Jdrac - Jdrab) * (xdJdro)
    
              fn3p = (Jdrbc - Jdrac) * (-xdJr2ro) + (-xdJdro) * (dJdr[1] - xdJdr2)
              fn3p = fn3p + (Jdrac - Jdrab) * xdJr2ro + xdJdro * (xdJdr2)
              fn4p = (Jdrbc - Jdrac) * (-xdJdro)
              fn4p = fn4p + (Jdrac - Jdrab) * (xdJdro)
    
              fn1i = (-Jdrab + Jdrbc) * dJdr[1] + (Jdrac - Jdrab) * (xdJdr2)
              fn1i = fn1i + (Jdrbc - Jdrac) * (dJdr[1] - xdJdr2)
              f2i  = (-Jdrab + Jdrbc) * dJdr2[1] + (dJdr[1] ** 2)
              f3i  = (Jdrac - Jdrab) * (xdJr2r2) + (xdJdr2) ** 2
              fn2i = f2i + f3i
              fn2i = fn2i + (Jdrbc - Jdrac) * (dJdr2[1] - xdJr2r2)
              fn2i = fn2i + (dJdr[1] - xdJdr2) ** 2
    
              fn1j = (Jdrac - Jdrab) * (xdJdro)
              fn1j = fn1j + (Jdrbc - Jdrac) * (-xdJdro)
              fn2j = (Jdrac - Jdrab) * (xdJroro) + (xdJdro) ** 2
              fn2j = fn2j + (Jdrbc - Jdrac) * (-xdJroro) + xdJdro ** 2
    
              ttm1 = (.5 * (1 / (FKK ** 0.5)) * fn2 ) - (fn1  * .25 * (1 / FKK ** 1.5) * fn1 )
              ttm2 = (.5 * (1 / (FKK ** 0.5)) * fn3 ) - (fn1  * .25 * (1 / FKK ** 1.5) * fn4 )
              ttm3 = (.5 * (1 / (FKK ** 0.5)) * fn3i) - (fn1  * .25 * (1 / FKK ** 1.5) * fn4i)
              ttm4 = (.5 * (1 / (FKK ** 0.5)) * fn3p) - (fn1i * .25 * (1 / FKK ** 1.5) * fn4p)
              ttm5 = (.5 * (1 / (FKK ** 0.5)) * fn2i) - (fn1i * .25 * (1 / FKK ** 1.5) * fn1i)
              ttm6 = (.5 * (1 / (FKK ** 0.5)) * fn2j) - (fn1j * .25 * (1 / FKK ** 1.5) * fn1j)
    
              hr1r1 = (1 / (1 + sq)) * (dQdr2[0] + xdQr1r1 - ist * ttm1)
              hr1r2 = (1 / (1 + sq)) * (           xdQr1r2 - ist * ttm2)
              hr1r3 = (1 / (1 + sq)) * (           xdQr1ro - ist * ttm3)
              hr2r3 = (1 / (1 + sq)) * (           xdQr2ro - ist * ttm4)
              hr2r2 = (1 / (1 + sq)) * (dQdr2[1] + xdQr2r2 - ist * ttm5)
              hr3r3 = (1 / (1 + sq)) * (           xdQroro - ist * ttm6)
              
              
              return V,Frab,Frbc,Frac,hr1r1,hr1r2,hr1r3,hr2r2,hr2r3,hr3r3
              
        else:
            return V,Frab,Frbc,Frac
              
    else:
        return V
