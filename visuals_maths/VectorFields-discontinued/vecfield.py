import numpy as np
import math as ma
import plotly.figure_factory as ff
from plotly.offline import download_plotlyjs,init_notebook_mode,plot,iplot
import plotly.graph_objs as go
init_notebook_mode(connected=True)


N = 100
x = np.linspace(-ma.pi, ma.pi, N)
y = np.linspace(-ma.pi, ma.pi, N)


def meshgrid(x, y, N):
    one_list = np.ones(N)
    meshx = np.outer(one_list, x)
    meshy = np.outer(one_list, y)
    return [meshx, meshy]


def vectorfield(x, y, N):
    [meshx, meshy] = meshgrid(x, y, N)
    return [np.sin(meshx), np.cos(meshy)]


if __name__ == '__main__':
    [meshx, meshy] = meshgrid(x, y, N)
    [u, v] = vectorfield(x, y, N)
    fig = ff.create_quiver(meshx, meshy, u, v)
    print(fig)
    iplot(fig)