"""
Created to generate HTML pages with embedded PlotlyJS using Python commands defined in this script.
- Akash B

This file defines classes and functions for adding interactive features to existing PlotlyJS plots.
"""
from translator.helpers import Data, var, escape, jsify


class Animate:
    variables = {}

    def __init__(self, graph, **kwargs):
        """

        :param graph: An object whose base class is Graph.
        :param kwargs: Names of variables that are to be animated.
        """
        # Sanity check - is the graph of the correct type?
        if str(graph.__class__.__bases__).find("<class 'translator.statics.Graph'>") == -1:
            raise TypeError("Object graph is not derived from base class 'Graph', but from {bases}"
                            .format(bases=str(graph.__class__.__bases__)))

        else:
            self.graph = graph
            self.num_frames = None
            self.script = graph.script
            self.div_id = graph.div_id
            self.attributes = {}
            self.variables_list = []

            if len(kwargs.items()) > 0:                 # If variables to be animated provided, go ahead and animate.
                self.animate(**kwargs)
        return

    def animate(self, **kwargs):
        """

        :param kwargs: Names of variables that are to be animated.
        :return:
        """
        # Modifying existing script to ensure the first frame is defined by data points in index 0 of data list.
        for key, variable in kwargs.items():
            if key in self.variables:
                self.variables[key].append(var(variable))
            else:
                self.variables[key] = [var(variable)]

            self.script = self.script.replace(key + ": " + variable, var(key, True) + ": " + variable + "[0]")

            # Ensuring data length does not vary for x, y and/or z coords.
            try:
                if self.num_frames and self.num_frames != len(self.graph.data[var(variable)]):
                    raise IndexError("Variable lists not of equal length!")

                else:
                    self.num_frames = len(self.graph.data[var(variable)])
            except:                                                       # In case variable name entered not in script.
                raise IndexError("Variable not found in Graph instance: {name}".format(name=str(variable)))
        return

    def show(self, **kwargs):
        """

        :param kwargs: Attributes of Plotly.animate function
        :return:
        """
        self.attributes = Data(**kwargs).json
        anim_attr_js = jsify(self.attributes)

        variables = ""
        for key, value in self.variables.items():
            variables += "{key}: {value}[j], ".format(key=key, value=var(value[0], True))
        variables = variables[:-2]

        # Writing JS to create animation.
        self.script += "\n\n"
        self.script += "var i = 0;\n\n"                                 # Counter
        self.script += "function update() \n { \n\t\t"                  # Function to show next frame
        self.script += "i++; \n\t\t"                                    # Increment counter
        self.script += "var j = i % {length}; \n\t\t".format(length=str(self.num_frames))   # Array index to show.
        self.script += "Plotly.animate({div_id}, {{data: [{{".format(div_id=self.div_id)
        self.script += "{variables}".format(variables=variables)        # Data to show in current frame.
        self.script += "}]}, \n\t\t"
        self.script += "{anim_attr}".format(anim_attr=anim_attr_js)     # Adding attributes.
        self.script = self.script[:-3]                                  # Removing "};" in jsified attributes.
        self.script += "\n\t\t }); \n\t"                                # End of Plotly.animate function.
        self.script += "requestAnimationFrame(update); \n } \n \n"      # End of update function
        self.script += "requestAnimationFrame(update);"                 # Calling animation function for first time.

        return self.script
