#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Created on Wed May 17 10:17:56 2017

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

epsilon = 1.0E-15

def lepnorm(drab,drbc,theta,Frab,Frbc,Frac,vrabi,vrbci,vraci,hr1r1,hr1r2,hr1r3,hr2r2,hr2r3,hr3r3,ma,mb,mc,ti,dt,MEP):

    hessian = np.array([[hr1r1, hr1r2, hr1r3], [hr1r2, hr2r2, hr2r3], [hr1r3, hr2r3, hr3r3]])
    
    # Reduced masses.
    mab = (ma*mb)/(ma+mb)
    mbc = (mb*mc)/(mb+mc)
    mac = (ma*mc)/(ma+mc)

    prab = vrabi*mab
    prbc = vrbci*mbc
    prac = vraci*mac
    
    # G-Matrix
    y1 = 1/ma
    y2 = 1/mb
    y3 = 1/mc

    GM = np.zeros((3,3))
    GM[0][0]=y1+y2
    GM[0][1]=y2*np.cos(theta)
    GM[1][0]=GM[0][1]
    GM[1][1]=y3+y2
    GM[0][2]=-y2*np.sin(theta)/drbc
    GM[2][0]=GM[0][2]
    GM[1][2]=-y2*np.sin(theta)/drab
    GM[2][1]=GM[1][2]
    gmt=1/(drab ** 2)+1/(drbc ** 2)-(2*np.cos(theta)/(drab*drbc))
    GM[2][2]=y1/(drab ** 2)+y3/(drbc ** 2)+y2*gmt
    
    GMVal, GMVec = np.linalg.eig(GM)
    GMVal = np.diag(GMVal)
    GMVal1 = GMVal ** 0.5
    GMVal2 = np.diag(np.diag(GMVal) ** -0.5)
    GRR    = np.dot(np.dot(GMVec, GMVal1), GMVec.T)
    GROOT  = np.dot(np.dot(GMVec, GMVal2), GMVec.T)

    # G-Matrix Weighted Hessian;
    MWH = np.dot(np.dot(GRR, hessian), GRR)
    W2, ALT = np.linalg.eig(MWH); #ALT is antisymmetric version in Fort code but that does not give the right G-Matrix!!!!
    
    # Gradient Vector in mass-weighted coordinates
    GRAD = np.array([-Frab, -Frbc, -Frac])
    GRADN = np.dot(ALT.T ,np.dot(GRR, GRAD))
    
    # Momentum Vector in Normal Coordinates
    MOM = np.array([prab, prbc, prac])
    
    PCMO = np.dot(ALT.T,np.dot(GRR, MOM))
    
    ktot = 0.5 * (PCMO[0] ** 2 + PCMO[1] ** 2 + PCMO[2] ** 2)
    
    q = np.zeros((3))
    for i in range(3):
        if W2[i] < - epsilon:
            wmod = abs(W2[i]) ** 0.5
            wmt = wmod * dt
            q[i]=PCMO[i] * np.sinh(wmt) / wmod + GRADN[i] * (1 - np.cosh(wmt)) / (wmod ** 2)
            PCMO[i] = PCMO[i] * np.cosh(wmt) - GRADN[i] * np.sinh(wmt) / wmod
        elif abs(W2[i]) < epsilon:
            q[i] = PCMO[i] * dt - (0.5 * GRADN[i] * (dt ** 2))
            PCMO[i] = PCMO[i] - GRADN[i] * dt
        else:
            wroot =W2[i] ** 0.5
            tfn1 = GRADN[i] * (1 - np.cos(wroot * dt)) / (wroot ** 2)
            q[i] = PCMO[i] * np.sin(wroot * dt) / wroot - tfn1
            PCMO[i] = PCMO[i] * np.cos(wroot * dt) - GRADN[i] * np.sin(wroot * dt) / wroot
            
    XX = np.dot(GRR, np.dot(ALT, q.T))
        
    if MEP:
      XX *= 5
      
      
        
    drabf = drab + XX[0]
    drbcf = drbc + XX[1]
    thetaf = theta + XX[2]
    dracf = ((drab ** 2) + (drbc ** 2) - 2 * drab * drbc * np.cos(thetaf)) ** 0.5
    MOM = np.dot(np.dot(GROOT, ALT), PCMO)
    
    tf = ti + dt
    vrabf = MOM[0] / mab
    vrbcf = MOM[1] / mbc
    vracf = 0
    
    arab = Frab / mab
    arbc = Frbc / mbc
    if (arab + arbc < 0):
        arac = - ((arab ** 2) + (arbc ** 2) - 2 * arab * arbc * np.cos(thetaf)) ** 0.5
    else:
        arac =   ((arab ** 2) + (arbc ** 2) - 2 * arab * arbc * np.cos(thetaf)) ** 0.5
    
    return drabf,drbcf,dracf,thetaf,vrabf,vrbcf,vracf,tf,arab,arbc,arac,ktot
