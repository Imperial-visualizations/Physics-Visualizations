import numpy as np

from bokeh.io import curdoc
from bokeh.models import ColumnDataSource, HoverTool
from bokeh.models.widgets import RadioButtonGroup, Select, Slider, Toggle
from bokeh.layouts import layout, widgetbox
from bokeh.plotting import figure


x = np.linspace(0, 15, 500)
y = np.sin(x)

source = ColumnDataSource(data=dict(x=x, y=y))

plot = figure(y_range=(-10, 10), plot_width=600, plot_height=400)
line_test = plot.line(x='x', y='y', source=source, line_width=3, line_alpha=0.6, line_color='k')

amp_slider = Slider(title="Amplitude", start=0.1, end=10, value=1, step=.1)
freq_slider = Slider(title="Frequency", start=0.1, end=10, value=1, step=.1)
phase_slider = Slider(title="Phase", start=0, end=10, value=0, step=.1)
offset_slider = Slider(title="Offset", start=0, end=10, value=0, step=.1)
colour_select = Select(title="Colour", value="red", options=["red", "blue", "green"])
trig_button_group = RadioButtonGroup(labels=["sin", "cos", "tan"], active=0)
animation_toggle = Toggle(label="Pause Animation")

# Values must be from ColumnDataSource
hover = HoverTool(tooltips=[
    ("x", "@x"),
    ("y", "@y"),
])


def update():
    line_test.glyph.line_color = colour_select.value
    trig = np.sin
    if trig_button_group.active == 0:
        trig = np.sin
    elif trig_button_group.active == 1:
        trig = np.cos
    elif trig_button_group.active == 2:
        trig = np.tan

    source.data = dict(
        x=x,
        y=offset_slider.value + amp_slider.value * trig(freq_slider.value * x + phase_slider.value),
    )

# Bokeh plot information is not transmitted outside the server so can't know what the user's current axis limits are
# therefore can't update plot to fit the user's axis real time (this only really applies for trig functions anyway.

value_controls = [colour_select, amp_slider, freq_slider, phase_slider, offset_slider]
active_controls = [animation_toggle, trig_button_group]
for control in value_controls:
    control.on_change('value', lambda attr, old, new: update())
for control in active_controls:
    control.on_change('active', lambda attr, old, new: update())

# 'scale_width' also looks nice with this example
inputs = widgetbox(*active_controls, *value_controls, sizing_mode='fixed')
l = layout([[plot, inputs]])

update()  # initial load of the data

curdoc().add_root(l)
curdoc().title = "Trig Functions"

# ToDo: Real time animation
