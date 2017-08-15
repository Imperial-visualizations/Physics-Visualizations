#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Wed May 17 11:30:28 2017

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

from configparser import ConfigParser

def _get_mass(config, key):
    
    try:
        d = config['atoms']
        l = d[key]
        m = float(l.split(',')[0])
    except KeyError:
        raise KeyError('Mass not available for atom type {}'.format(key))
    except:
        raise RuntimeError('Parameter file corrupted. Cannot get mass for atom type {}'.format(key))
    
    return m
    
def _get_morse(config, key):
    
    try:
        d = config['morse']
        m = d[key]
        m = [float(p) for p in m.split(',')]
        assert len(m) == 3
    except KeyError:
        raise KeyError('Morse potential not available for atom pair {}'.format(key))
    except:
        raise RuntimeError('Parameter file corrupted. Cannot get morse parater for atom pair {}'.format(key))
    
    return m
    
def _get_limits(config, key):
    
    try:
        d = config['limits']
        l = d[key]
        l = [float(p) for p in l.split(',')]
        assert len(l) == 4
    except KeyError:
        raise KeyError('Limits not available for atoms {}'.format(key))
    except:
        raise RuntimeError('Parameter file corrupted. Cannot get morse parater for atom pair {}'.format(key))
    
    return l

def params(a,b,c):

    # Gets the parameters for any atom set or returns error message if no
    # parameters exist.
    
    #Open parameter file
    config = ConfigParser(inline_comment_prefixes=(';', '#'))
    config.read('params.ini')
    try:
        isotopes = config['isotopes']
    except:
        isotopes = {}
    
    # labels:
    # H F Cl D I O
    # 1 2 3  4 5 6
    
    
    a   = str(a)
    b   = str(b)
    c   = str(c)
    ab  = (a + b)
    bc  = (b + c)
    ac  = (a + c)
    abc = (a + b + c)
    
    #Replace atoms set by the isotopes section in parameters file
    
    for i, o in isotopes.items():
        ab  =  ab.replace(i, o)
        bc  =  bc.replace(i, o)
        ac  =  ac.replace(i, o)
        abc = abc.replace(i, o)

    # Masses
    ma = _get_mass(config, a)
    mb = _get_mass(config, b)
    mc = _get_mass(config, c)
    

    # Morse Parameters
    Drab, lrab, Brab = _get_morse(config, ab)
    Drbc, lrbc, Brbc = _get_morse(config, bc)
    Drac, lrac, Brac = _get_morse(config, ac)
     
    # Plot Limits
    mina, maxa, minb, maxb = _get_limits(config, abc)

    return ma,mb,mc,Drab,Drbc,Drac,lrab,lrbc,lrac,Brab,Brbc,Brac,mina,maxa,minb,maxb
