"""
Example to create moving sine wave.
"""

from translator.statics import Scatter2D, Document
from translator.interaction import Animate
import numpy as np

# Creating 3 sinusoidal waves
x = []
y = []
for t in range(0, 157):
    x.append(list(np.linspace(-np.pi, np.pi, 50)))
    y.append(list(np.sin(np.array(x[t]) + t/10)))

a = []
b = []
for t in range(0, 157):
    a.append(list(np.linspace(-np.pi, np.pi, 50)))
    b.append(list(np.cos(np.array(a[0]) - t/10)))

c = []
d = []
for t in range(0, 157):
    c.append(list(np.linspace(-np.pi, np.pi, 50)))
    d.append(list(np.tan(np.array(a[0]) + t/20)))


# Creating static plots.
line = Scatter2D(x=x, y=y, div_id="scatter", mode="lines", line_width=1, line_color='blue', name="sine")
line.plot(x=a, y=b, mode="lines", line_width=2, line_color='red', name="cos")
line.plot(x=c, y=d, mode="lines", line_width=2, line_color='green', name="tan")
line.show(xaxis_range=[-np.pi, np.pi], xaxis_title="x",
          yaxis_range=[-1, 1], yaxis_title="y", title="Animated Sine Wave Example")

# Animating static plots
animation = Animate(line, x="x0", y="y0")
animation.animate(x="x1", y="y1")
animation.animate(x="x2", y="y2")
animation.show(transition_duration=0, frame_redraw=False, frame_duration=0)

html = Document(div_id="scatter", width=1000, height=600, js_script=animation.script)
html.create("multiple_sin_anim_test.html")
