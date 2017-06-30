import numpy as np
from bokeh.layouts import row
from bokeh.models import ColumnDataSource, Slider, CustomJS
from bokeh.plotting import Figure, show


# Define data
x = [x*0.05 for x in range(0, 500)]
trigonometric_functions = {
    '0': np.sin(x),
    '1': np.cos(x),
    '2': np.tan(x),
    '3': np.arcsin(x),
    '4': np.arccos(x),
    '5': np.arctan(x)}
initial_function = '0'

# Wrap the data in two ColumnDataSources
source_visible = ColumnDataSource(data=dict(
    x=x, y=trigonometric_functions[initial_function]))
source_available = ColumnDataSource(data=trigonometric_functions)

# Define plot elements
plot = Figure(plot_width=400, plot_height=400)
plot.line('x', 'y', source=source_visible, line_width=3, line_alpha=0.6)
slider = Slider(title='Trigonometric function',
                value=int(initial_function),
                start=np.min([int(i) for i in trigonometric_functions.keys()]),
                end=np.max([int(i) for i in trigonometric_functions.keys()]),
                step=1)

# Define CustomJS callback, which updates the plot based on selected function
# by updating the source_visible ColumnDataSource.
slider.callback = CustomJS(
    args=dict(source_visible=source_visible,
              source_available=source_available), code="""
        var selected_function = cb_obj.get('value');
        // Get the data from the data sources
        var data_visible = source_visible.get('data');
        var data_available = source_available.get('data');
        // Change y-axis data according to the selected value
        data_visible.y = data_available[selected_function];
        // Update the plot
        source_visible.trigger('change');
    """)

layout = row(plot, slider)
show(layout)
