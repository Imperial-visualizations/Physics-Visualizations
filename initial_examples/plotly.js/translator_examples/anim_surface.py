"""
Example to create moving surface.
"""

from translator.statics import Surface, Document
from translator.interaction import Animate
import numpy as np

z = []
x = list(np.linspace(-np.pi, np.pi, 31))
for t in range(0, 314):
    y = []
    for j in range(0, 20):
        tmp = []
        for i in range(0, len(x)):
            tmp.append(np.cos(x[i] + (j + t)/10))
        y.append(tmp)

    z.append(y)

surface = Surface(z=z, div_id="surface_plot")
surface.show(xaxis_range=[-np.pi, np.pi], yaxis_range=[1, -1], zaxis_range=[1, -1], title="Example Animated Surface")

animation = Animate(surface, z="z0")
animation.show(transition_duration=100, frame_redraw=True, frame_duration=100)

html = Document(div_id="surface_plot", js_script=animation.script, width=700, height=600)
html.create("surface_anim_test.html")
