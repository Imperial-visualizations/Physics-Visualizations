"""
Example to create moving 3D sine and cosine spiral.
"""

from translator.statics import Scatter3D, Document
from translator.interaction import Animate
import numpy as np

x = []
y = []
z = []
for t in range(0, 314):
    x.append(list(np.linspace(-np.pi, np.pi, 50)))
    y.append(list(np.sin(np.array(x[t]) + t/10)))
    z.append(list(np.cos(np.array(x[t]) + t/10)))

line = Scatter3D(x=x, y=y, z=z, div_id="scatter", mode="markers", marker_size=4, line_color='blue', name='spiral')
line.show(xaxis_range=[-np.pi, np.pi], xaxis_title="x", xaxis_titlefont_size=18, zaxis_range=[-1, 1], z_axis_title="z",
          yaxis_range=[-1, 1], yaxis_title="y", title="3D Animated Sine/Cos Wave Example")

animation = Animate(line, x="x0", y="y0", z="z0")
animation.show(transition_duration=0, frame_redraw=False, frame_duration=0)

html = Document(div_id="scatter", width=700, height=500, js_script=animation.script)
html.create("3d_anim_test.html")
