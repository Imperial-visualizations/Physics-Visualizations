"""
Created to generate HTML pages with embedded PlotlyJS using Python commands defined in this script.
- Akash B

This file defines classes and functions for adding interactive features to existing PlotlyJS plots.
"""
from translate.helpers import Data, Document, var, escape, jsify


class Animate:
    def __init__(self, graph):
        self.graph = graph
        return

    def plot(self):
        pass


class AnimateOld:
    def __init__(self, div_id="scatter", **kwargs):
        self.script = ""
        self.data = {}
        self.attributes = {}
        self.div_id = escape(div_id)

        for key, value in kwargs.items():
            key = var(key)
            self.data_length = len(value)
            value = escape(value)
            self.data[key] = value
        return

    def show(self):
        # Writing variables to script.
        variable_names = ""
        for variable, value in self.data.items():
            variable = variable.replace("~", "")
            self.script += "var {variable} = {value}; \n".format(variable=variable, value=value)
            variable_names += "{variable}: {variable}[j], ".format(variable=variable)       # variable j is to be used
        variable_names = variable_names[:-2]                                                # as an index counter in JS

        self.script += "\nvar i = 0;\n"                                         # Counter
        self.script += "\nfunction update() \n{\n "                             # Function to change data
        self.script += "\t\ti++; \n\t\tvar j = i % {length};\n".format(length=str(self.data_length))    # Array Index
        self.script += "\t\tPlotly.animate({div_id}, ".format(div_id=self.div_id)     # Calling Plotly Animate function.
        self.script += "{data:[{"
        self.script += "{variable}".format(variable=variable_names)          # Data to show in current frame.
        self.script += "}]}"
        self.script += ", \n"
        self.script += "\t\t{anim_attr}".format(anim_attr=jsify(self.attributes))     # Adding attributes.
        self.script = self.script[:-3]                                          # Removing "};" in jsified attributes.
        self.script += "\n\t\t});\n\trequestAnimationFrame(update); \n}\n"      # Infinite loop initiation.
        self.script += "requestAnimationFrame(update);"                         # Calling animation function.
        return

    def animate(self, **kwargs):
        self.attributes = Data(**kwargs).json
        return
