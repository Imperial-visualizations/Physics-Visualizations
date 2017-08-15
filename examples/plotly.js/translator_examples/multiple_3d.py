"""
Example to create moving 3D sine and cosine spiral.
"""

from translator.statics import Scatter3D, Document
from translator.interaction import Animate
import numpy as np

# Creating some pretty spirals
x = []
y = []
z = []

b = []
c = []
for t in range(0, 314):
    x.append(list(np.linspace(-np.pi, np.pi, 50)))
    y.append(list(np.sin(np.array(x[t]) + t/10)))
    z.append(list(np.cos(np.array(x[t]) + t/10)))
    b.append(list(np.cos(np.array(x[t]) - t/5)))
    c.append(list(np.sin(np.array(x[t]) - t/20)))

# Drawing static 3D line/scatter plots
line = Scatter3D(x=x, y=y, z=z, div_id="scatter", mode="markers", marker_size=4, line_color='blue', name='spiral')
line.plot(x=x, y=b, z=c, mode="lines", line_color="red", name="spiral2", type="scatter3d")
line.show(xaxis_range=[-np.pi, np.pi], xaxis_title="x", xaxis_titlefont_size=18, zaxis_range=[-1, 1], z_axis_title="z",
          yaxis_range=[-1, 1], yaxis_title="y", title="3D Animated Sine/Cos Wave Example")

# Animating static plots
animation = Animate(line)
animation.remove_repeated_data()
animation.animate(x="x0", y="y0", z="z0")
animation.animate(x="x1", y="y1", z="z1")
animation.show(transition_duration=10, frame_redraw=False, frame_duration=0)

# Saving to HTML
html = Document(line, width=90, height=80)
html.create("multiple_3d.html")
