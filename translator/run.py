from translator.statics import *
from translator.interaction import Animate, Mouse

dat = [[8.83, 8.89, 8.81, 8.87, 8.9, 8.87],
    [8.89, 8.94, 8.85, 8.94, 8.96, 8.92],
    [8.84, 8.9, 8.82, 8.92, 8.93, 8.91],
    [8.79, 8.85, 8.79, 8.9, 8.94, 8.92],
    [8.79, 8.88, 8.81, 8.9, 8.95, 8.92]]

dat2 = [[8.83, 9.89, 10.81, 5.87, 2.9, 3.87],
    [4.89, 4.94, 2.85, 6.94, 5.96, 3.92],
    [5.84, 8.9, 8.82, 8.92, 8.93, 3.91],
    [2.79, 8.85, 8.79, 8.9, 8.94, 8.92]]

dat3 = [[5.84, 8.9, 8.82, 8.92, 8.93, 3.91],
        [8.79, 8.85, 8.79, 8.9, 8.94, 8.92],
        [8.79, 8.88, 8.81, 8.9, 8.95, 8.92]]

line = Scatter2D(x=dat[:4], y=dat2, div_id="scatter", mode="lines+markers",
                 marker_size=10, showlegend=True, name="random data")
# ms = Mouse(line, event="click")
# print(ms.script)

animation = Animate(line, x="x0", y="y0")
animation.show(transition_duration=0, frame_redraw=False)
