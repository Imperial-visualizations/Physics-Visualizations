import numpy as np
import plotly.graph_objs as go
from plotly.offline import init_notebook_mode, plot
from plotly import tools

init_notebook_mode(connected=True)

lim = np.linspace(0, 100, 2000)


def wave(x, t=1, k=1, omega=1, amp=1):
    return amp * np.cos(omega * t - k * x) * np.cos(omega * t / 2 - k * x / 2)

data = [dict(x=lim, y=wave(lim))]

o = [i for i in range(5)]
steps = []
for i in range(len(o)):
    step = dict(
        method='update',
        args=[{'y': [wave(lim, t=o[i])]}]
    )
    steps.append(step)

sliders = [dict(
    active=2,
    currentvalue={'prefix': 'x position'},
    pad={'t': len(o)},
    steps=steps
)]

layout = dict(width=1000, height=500,
              xaxis=dict(range=[0, 2 * np.pi], autorange=False, zeroline=False),
              yaxis=dict(range=[-1.1, 1.1], autorange=False, zeroline=False),
              title='Slider', hovermode='closest',
              sliders=sliders)
figure = dict(data=data, layout=layout)
plot(figure)
