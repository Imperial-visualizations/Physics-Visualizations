"""
Created to generate HTML pages with embedded PlotlyJS using Python commands defined in this script.
- Akash B

This file defines classes and functions for adding interactive features to existing PlotlyJS plots.
"""
from translator.helpers import Data, var, escape, jsify


class Animate:
    variables = []          # List of dictionaries

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

    def remove_repeated_data(self):
        self.graph.remove_repeated_data()
        self.script = self.graph.show()
        return

    def animate(self, **kwargs):
        """

        :param kwargs: Names of variables that are to be animated.
        :return:
        """
        # Modifying existing script to ensure the first frame is defined by data points in index 0 of data list.
        tmp = {}
        for key, variable in kwargs.items():
            tmp[key] = var(variable)
            self.script = self.script.replace(key + ": " + variable, key + ": " + variable + "[0]")
        self.variables.append(tmp)
        return

    def show(self, **kwargs):
        """

        :param kwargs: Attributes of Plotly.animate function
        :return:
        """
        self.attributes = Data(**kwargs).json
        anim_attr_js = jsify(self.attributes)

        self.script += "\n\n"                   # Beautifying before writing animation code

        variables_str = ""
        for plot in self.variables:
            variables_str += "{"
            for key, variable in plot.items():
                variables_str += "{key}: {var}[counter_{var}], ".format(key=key, var=var(variable, True))

                # Making counter for every variable
                self.script += "var counter_{var} = 0;\n".format(var=var(variable, True))

                # Setting up maximum value for counter for each variable
                self.script += "var counter_{var}_lim = {var}.length;\n".format(var=var(variable, True))

            variables_str = variables_str[:-2]
            variables_str += "}, "                      # Making ready to write next object.
        variables_str = variables_str[:-2]
        traces = list(range(len(self.variables)))

        # Writing JS to create animation.
        self.script += "function update() \n { \n\t\t"                   # Function to show next frame
        for i in range(0, len(self.variables)):
            for key, variable in self.variables[i].items():
                self.script += "counter_{var}++; \n\t\t".format(var=var(variable, True))            # Increment counter.
                # If last index reached, reset index and hence loop animation.
                self.script += "if (counter_{var} === counter_{var}_lim) {{\n\t\t\t" \
                               "counter_{var} = 0;\n\t\t}}\n\t\t".format(var=var(variable, True))

        self.script += "Plotly.animate({div_id}, {{data: [".format(div_id=self.div_id)
        self.script += "{variables}], ".format(variables=variables_str)       # Data to show in current frame.
        self.script += "traces: {traces}}},  \n\t\t".format(traces=traces)         # Labeling traces
        self.script += "{anim_attr}".format(anim_attr=anim_attr_js)             # Adding attributes.

        self.script = self.script[:-3]                                  # Removing "};" in jsified attributes.
        self.script += "\n\t\t }); \n\t"                                # End of Plotly.animate function.
        self.script += "requestAnimationFrame(update); \n } \n \n"      # End of update function
        self.script += "requestAnimationFrame(update);"                 # Calling animation function for first time.

        return self.script


class Mouse:
    def __init__(self, graph, event="hover"):
        # Sanity check - is the graph of the correct type?
        if str(graph.__class__.__bases__).find("<class 'translator.statics.Graph'>") == -1:
            raise TypeError("Object graph is not derived from base class 'Graph', but from {bases}"
                            .format(bases=str(graph.__class__.__bases__)))

        else:
            self.graph = graph
            if event == "hover" or event == "click":
                self.event = event

            else:
                raise ValueError("Need events to be type 'hover' or 'click', not {event}".format(event=str(self.event)))

            self.script = graph.script + "\n\n"
            self.write()
        return

    def change(self, **kwargs):
        """
        Changes value of data at mouse position. New data passed in as keyword arguments.
        :param kwargs: variable-name=changed-value
        :return:
        """
        # TODO
        return

    def draw(self, object):
        """
        Draws object at current mouse position.
        :param object:
        :return:
        """
        # TODO
        return

    def add_data(self):
        """
        Adds data at current mouse position.
        :return:
        """
        # TODO
        return

    def write(self):
        self.script += "myPlot.on('plotly_{event}', function(data) {{\n\t".format(event=str(self.event))

        return


class Button:
    def __init__(self):
        return
