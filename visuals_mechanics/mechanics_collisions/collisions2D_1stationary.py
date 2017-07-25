import numpy

'''
# 2D collision, keep ball 2 stationary


mu : coefficient of restitution set to 1

m1, m2 : masses


initial

r1_i, r2_i : initial positions
v1_i, v2_i : initial velocities , right as +ve
p1_i, p2_i : initial momentums


colliding 

r1_c, r2_c : initial positions


final

r1_f, r2_f : final positions
v1_f, v2_f : final velocities , right as +ve
p1_f, p2_f : initial momentums

'''

m1 = 1;				m2 = 1;

r1_i = [-1,0]; 		r2_i = [0,0];
v1_i = [1,0]; 		v2_i = [0,0];
p1_i = r1_i * v1_i;	p2_i = r2_i * v2_i;

r1_c2 = [0,0]; 		r2_c2 = [0,0];

r1_f = [0,0]; 		r2_f = [0,0];
v1_f = [0,0]; 		v2_f = [0,0];
p1_f = r1_f * v1_f;	p2_f = r2_f * v2_f;

