from plotly.offline import init_notebook_mode, plot
init_notebook_mode(connected=True)
import numpy as np

# Variables
# x-coordinates
n = 800
x = np.linspace(-10, 10, n)
# Initialise incident, reflected and transmitted waves
y_i = [0]*n
y_r = [0]*n
y_t = [0]*n
# Velocity of incident wave
v1 = 10
# Velocity of transmitted wave
alpha = 0.5
v2 = alpha*v1
# Time
t_end = 19/v1 if v1 < v2 else (9 / v1 + 10 / v2)
times = np.linspace(0, t_end, 200)
# Transmitted and reflected equation constants
A = (v2-v1)/(v1+v2)
B = 2*v1/(v1+v2)

# Initialise incident wave
for i in range(n):
    y_i[i] = (x[i] + 6) * np.exp(-1*((x[i] + 6) * (x[i] + 6)) + (x[i] + 6))

# Data: Initial plot
incident = dict(x=x, y=y_i,
                name="incident",
                mode="line",
                line=dict(width=2, color="#960078", simplify=False))


reflected = dict(x=x, y=y_r,
                 name="reflected",
                 mode="line",
                 line=dict(width=2, color='#E40043', simplify=False))


transmitted = dict(x=x, y=y_t,
                   name="transmitted",
                   mode="line",
                   line=dict(width=2, color='#00ACD7', simplify=False))


boundary = dict(x=[0, 0], y=[-4, 4],
                name="boundary",
                mode="line",
                line=dict(width=2, color='black', simplify=False))


xline = dict(x=[-15, 15], y=[0, 0],
             showlegend=False,
             mode="line",
             line=dict(width=2, color='black', simplify=False))

data = [incident, transmitted, reflected, boundary, xline]


# Plot layout
layout = dict(width=800, height=600,margin=dict(l=50,r=50,b=100,t=100, pad=4),
              xaxis=dict(range=[-10, 10], autorange=False, zeroline=False),
              yaxis=dict(range=[-1.5, 1.5], autorange=False, zeroline=False),
              title='Travelling pulse at an interface', hovermode='closest', font=dict(family='Lato',size=18,color='#003E74',weight=900),
              updatemenus=[{'buttons': [
                            {
                                'args': [None, {'frame': {'duration': 500, 'redraw': False},
                                                'fromcurrent': True,
                                                'transition': {'duration': 300, 'easing': 'quadratic-in-out'}}],
                                'label': 'Play',
                                'method': 'animate'
                            },
                            {
                                'args': [[None], {'frame': {'duration': 0, 'redraw': False}, 'mode': 'immediate',
                                                  'transition': {'duration': 0}}],
                                'label': 'Pause',
                                'method': 'animate'
                            }
                                    ],
                        'direction': 'right',
                        'pad': {'r': 10, 't': 87},
                        'showactive': False,
                        'type': 'buttons',
                        'x': 5,
                        'xanchor': 'right',
                        'y': 0,
                        'yanchor': 'top'}])


# Data update functions over time
def compute_i(t):
    for j in range(n):
        if x[j] < 0:
            y_i[j] = (x[j] + 6 - v1 * t) * np.exp(-1*((x[j] + 6 - v1 * t) * (x[j] + 6 - v1 * t)) + (x[j] + 6 - v1 * t))
        else:
            y_i[j] = 0
    return y_i[:]


def compute_r(t):
    for k in range(n):
        if x[k] < 0:
            y_r[k] = A * (-1*x[k] + 6 - v1 * t) * np.exp(-1*((-1*x[k] + 6 - v1 * t) * (-1*x[k] + 6 - v1 * t)) + (-1*x[k] + 6 - v1 * t))
        else:
            y_r[k] = 0
    return y_r[:]


def compute_t(t):
    for l in range(n):
        if x[l] > 0:
            y_t[l] = B * (v1 / v2 * x[l] + 6 - v1 * t) * np.exp(-1*((v1 / v2 * x[l] + 6 - v1 * t) * (v1 / v2 * x[l] + 6 - v1 * t)) + (v1 / v2 * x[l] + 6 - v1 * t))
        else:
            y_t[l] = 0
    return y_t[:]

frames = [dict(data=[dict(x=x,
                          y=compute_i(time),
                          mode='lines',
                          line=dict(color="#960078", width=2)),
                     dict(x=x,
                          y=compute_t(time),
                          mode='lines',
                          line=dict(color='#00ACD7', width=2)),
                     dict(x=x,
                          y=compute_r(time),
                          mode='lines',
                          line=dict(color='#E40043', width=2))
                     ]) for time in times]

figure = dict(data=data, layout=layout, frames=frames)
plot(figure)





