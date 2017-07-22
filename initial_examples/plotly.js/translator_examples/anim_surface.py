"""
Example to create moving surface. NOT WORKING YET.
"""

from translator.statics import *
from translator.interaction import Animate
import numpy as np

x = list(np.linspace(-np.pi, np.pi, 50))
y = []
for t in range(0, 50):
    tmp = []
    for i in range(0, len(x)):
        tmp.append(np.cos(x[i] + t/10))
    y.append(tmp)

z = [y]
y = []
for t in range(0, 50):
    tmp = []
    for i in range(0, len(x)):
        tmp.append(np.sin(x[i] + t/10))
    y.append(tmp)

z.append(y)
print(len(z))

# z = []
# for t in range(0, 314):
#     z.append(np.sin())
#
#
surface = Surface(z=z, div_id="surface_plot")
surface.show(xaxis_range=[-np.pi, np.pi], yaxis_range=[1, -1], zaxis_range=[1, -1], title="Example animated Surface")

animation = Animate(surface, z="z0")
animation.show(transition_duration=100, frame_redraw=False, frame_duration=100)
#
html = Document(div_id="surface_plot", js_script=surface.script, width=700, height=600)
html.create("surface_anim_test.html")