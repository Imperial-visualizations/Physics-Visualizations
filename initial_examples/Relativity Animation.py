import numpy as np
from plotly import __version__
from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
from plotly.graph_objs import *
from IPython.display import display, HTML
from timeit import default_timer


init_notebook_mode(connected=True)
x = [0]
y = [0]

data = Data([Scatter(x=x, y=y)])

figure = dict(data=data)
iplot(figure)

# update plot
time = 1
end = 10
start = default_timer()
while default_timer() < 10:
    now = default_timer()
    if now - start > time:
        data = Data([Scatter(x=time, y=2*time)])
        figure = dict(data=data)
        iplot(figure, )
        time += 1
