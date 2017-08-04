import numpy

'''
mu will be the coefficent of resitution
u1, u2 will be inital velocities +ve indicates right directions
m1, m2 will be inital masses

v1,v2 will be current speed 
'''
x1 = -1
x2 = 1
u1 = float(input("Input initial velocity of particle 1"))
m1 = float(input("Input initial mass of particle 1"))
u2 = float(input("Input initial velocity of particle 2"))
m2 = float(input("Input initial mass of particle 2"))
e = float(input("Input coefficient of restitution"))
if e < 0:
    e = 0
if e > 1:
    e = 1

coM = 1.0 / (m1 + m2) * (m1 * x1 + m2 * x2)
coMu = 1.0 / (m1 + m2) * (m1 * u1 + m2 * u2)

print("Initial momentum of particle 1: " + str(u1 * m1))
print("Initial momentum of particle 2: " + str(u2 * m2))
print("Initial momentum of system is: " + str(u1 * m1 + u2 * m2))

p1Com = u1 * m1 - m1 * coMu
p2Com = u2 * m2 - m2 * coMu
print("Initial momentum of particle 1 in centre of mass frame: " + str(p1Com))
print("Initial momentum of particle 2 in centre of mass frame: " + str(p2Com))
ke1 = 0.5 * m1 * u1 ** 2
ke2 = 0.5 * m2 * u2 ** 2
print("Initial KE of particle 1: " + str(ke1))
print("Initial KE of particle 2:" + str(ke2))

v1, v2 = 1.0 / (m1 + m2) * ((m1 - e * m2) * u1 + (1 + e) * m2 * u2), \
         1.0 / (m1 + m2) * ((m2 - e * m1) * u2 + (1 + e) * m1 * u1)

print("Final momentum of particle 1:" + str(m1 * v1))
print("Final momentum of particle 2:" + str(m2 * v2))
print("Final total momentum of system:" + str(m1 * v1 + m2 * v2))
