"""
Example to create moving sine wave.
"""

from translator.statics import Scatter2D, Document
from translator.interaction import Animate
import numpy as np

x = []
y = []
z = []
for t in range(0, 314):
    x.append(list(np.linspace(-np.pi, np.pi, 50)))
    y.append(list(np.sin(np.array(x[t]) + t/10)))
    z.append(list(np.cos(np.array(x[t]) - t/10)))

line = Scatter2D(x=x, y=y, div_id="scatter", mode="lines", line_width=1, line_color='blue', name="sine")
line.plot(x=x, y=z, mode="lines", line_width=2, line_color="red", name="cosine")
line.show(xaxis_range=[-np.pi, np.pi], xaxis_title="x",
          yaxis_range=[-1, 1], yaxis_title="y", title="Animated Sine Wave Example")

animation = Animate(line)
animation.remove_repeated_data()
# animation.animate(x="x0", y="y0")
animation.animate(x="x1", y="y1")
animation.show(transition_duration=0, frame_redraw=False, frame_duration=0)

html = Document(line, title="Sine and Cos Animation", width=90, height=80)
html.create("multiple_2d.html")
