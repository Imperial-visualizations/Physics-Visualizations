from translator.statics import Scatter2D, Document
from translator.interaction import Animate
import numpy as np


class particle:
    def __init__(self, r, v, charge, mass):
        self.r = r

        self.v = v

        self.q = charge

        self.m = mass

    def force(self, E, B):
        F = self.q * (E + np.cross(self.v, B))
        return F

    def update(self, E, B, dt):
        self.v = np.add(self.v, dt * self.force(E, B) / self.m)

        self.r = np.add(self.r, dt * self.v)


def mag(r):
    B = np.array([0, 0, 5])

    if abs(r[0]) > 1:
        B = np.array([0, 0, 5])

    return B


def elec(r, orientation):
    E = np.array([0, 0, 0])

    if abs(r[0]) < 1:
        E = np.array([orientation * 30, 0, 0])

    return E

r0 = np.array([0, 0, 0])
v0 = np.array([0, 0, 0])
p = particle(r0, v0, 1, 1)
dt = 0.01

r0 = np.array([0, -2, 0])
v0 = np.array([0, 0, 0])
p = particle(r0, v0, 1, 1)
dt = 0.03

totalt = 10
end = totalt / dt

Bmag = np.linalg.norm(mag(np.array([3, 0, 0])))

T = np.pi * p.m / (Bmag * p.q)

switch = False

frames = []

x = []
y = []
for t in range(0, int(end)):
    if p.r[0] < -1:
        switch = False

    elif p.r[0] > 1:
        switch = True

    if switch:
        E = elec(p.r, -1)

    else:
        E = elec(p.r, 1)

    B = mag(p.r)
    p.update(E, B, dt)

    if len(x) == 0:
        x.append([p.r[0]])
        y.append([p.r[1]])

    else:
        a = x[-1][:]
        a.append(p.r[0])
        x.append(a)
        b = y[-1][:]
        b.append(p.r[1])
        y.append(b)

line = Scatter2D(x=x, y=y, div_id="scatter", mode="lines", line_width=1, line_color='blue', name="sine")
line.show(xaxis_range=[-8, 8], xaxis_title="x",
          yaxis_range=[-8, 8], yaxis_title="y", title="Cyclotron")

animation = Animate(line)
# animation.remove_repeated_data()
animation.animate(x="x0", y="y0")
animation.show(transition_duration=0, frame_redraw=False, frame_duration=1)

html = Document(line, title="Cyclotron", width=30, height=80)
html.create("cyclotron.html")
