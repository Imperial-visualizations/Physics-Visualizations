"""
Example to create moving surface.
"""

from translator.statics import Surface, Document
from translator.interaction import Animate
import numpy as np

# Generating data
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

# Drawing surface
surface = Surface(z=z, div_id="surface_plot")
surface.show(xaxis_range=[-np.pi, np.pi], yaxis_range=[1, -1], zaxis_range=[1, -1], title="Example Animated Surface")

# Animating surface
animation = Animate(surface)
animation.remove_repeated_data()   # Feature not working on surface plots yet
animation.animate(z="z0")
animation.show(transition_duration=0, frame_redraw=False, frame_duration=0)

# Writing JS to HTML file
html = Document(surface, title="Surface Animation", width=90, height=80)
html.create("surface_anim.html")
