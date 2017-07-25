import numpy as np
import plotly.graph_objs as go
from plotly.offline import init_notebook_mode, plot
from plotly import tools

init_notebook_mode(connected=True)

lim = np.linspace(0, 100, 2000)


def wave(x, t=1, k=1, omega=1, amp=1):
    return amp * np.cos(omega * t - k * x) * np.cos(omega * t / 2 - k * x / 2)


data = dict(x=lim, y=wave(lim))

trace1 = go.Scatter(data,
                    name='data1',
                    mode='lines',
                    line=dict(width=2, color='blue'))

trace2 = go.Scatter(x=lim, y=wave(lim),
                    name='data2',
                    mode='lines',
                    line=dict(width=2, color='blue'))

fig = tools.make_subplots(2, 1)

fig.append_trace(trace1, 1, 1)
fig.append_trace(trace2, 2, 1)

plot(fig)
