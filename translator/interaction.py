"""
Created to generate HTML pages with embedded PlotlyJS using Python commands defined in this script.
- Akash B

This file defines classes and functions for adding interactive features to existing PlotlyJS plots.
"""
from translator.helpers import Data, var, escape, jsify, Tag


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

        self.script += "\n\n"                            # Beautifying before writing animation code
        self.script += "var is_paused = true;\n"         # Boolean for play/pause implementation.
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
        self.script += "function update() { \n\t if (is_paused) {\n\t\t"                   # Function to show next frame
        for i in range(0, len(self.variables)):
            for key, variable in self.variables[i].items():
                self.script += "counter_{var}++; \n\t\t".format(var=var(variable, True))            # Increment counter.
                # If last index reached, reset index and hence loop animation.
                self.script += "if (counter_{var} === counter_{var}_lim) {{\n\t\t\t" \
                               "counter_{var} = 0;\n\t\t}}\n\t\t".format(var=var(variable, True))

        self.script += "Plotly.animate({div_id}, {{data: [".format(div_id=self.div_id)
        self.script += "{variables}], ".format(variables=variables_str)         # Data to show in current frame.
        self.script += "traces: {traces}}}, ".format(traces=traces)             # Labeling traces
        self.script += "{anim_attr}".format(anim_attr=anim_attr_js)             # Adding attributes.

        self.script = self.script[:-3]                                  # Removing "};" in jsified attributes.
        self.script += "}); \n\t\t"                                     # End of Plotly.animate function.
        self.script += "requestAnimationFrame(update); \n\t}\n}\n"      # End of update function
        self.script += "requestAnimationFrame(update); \n"              # Calling animation function for first time.

        self.graph.script = self.script                                 # Updating graph script
        continuity_buttons = Button(self.graph, self.div_id[1:-1] + "_btn")     # Passing graph script to button maker
        self.script = continuity_buttons.add_play_button()              # Making play button
        self.script = continuity_buttons.add_reset_button()             # Making reset button
        self.graph.script = self.script                                 # Updating graph script.
        return self.graph


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
    def __init__(self, graph, div_id, **kwargs):

        # Sanity check - is the graph of the correct type?
        if str(graph.__class__.__bases__).find("<class 'translator.statics.Graph'>") == -1:
            raise TypeError("Object graph is not derived from base class 'Graph', but from {bases}"
                            .format(bases=str(graph.__class__.__bases__)))

        self.graph = graph
        self.div = Tag("div", id=escape(div_id)).html
        self.buttons = []

        if len(kwargs.items()) > 0:
            self.make(**kwargs)
        return

    def make(self, **kwargs):
        button = Tag("input", **kwargs).html                # Making HTML code for button.

        if self.div not in self.graph.buttons:              # If no buttons in current div, make empty list in which to
            self.graph.buttons[self.div] = []               # store buttons, with the key as the HTML tag of the div.

        self.graph.buttons[self.div].append(button)         # Adding button to dictionary of buttons.
        return

    def add_play_button(self):
        # Making HTML button.
        self.make(id=escape('run'), onclick=escape("onToggleRun()"), value=escape("Play"), type=escape("button"))

        self.graph.script += "function onToggleRun() { \n\t"                                # Action when button pressed
        self.graph.script += "is_paused = !is_paused;\n\t"                                  # Toggle boolean.

        # If paused, set button text to display Play, else display Pause.
        self.graph.script += "document.getElementById('run').value = (is_paused) ? 'Play':'Pause';\n\t"
        self.graph.script += "requestAnimationFrame(update);\n}\n"                          # Running animation.

        return self.graph.script

    def add_reset_button(self):
        # Making HTML button.
        self.make(id=escape('reset'), onclick=escape("onReset()"), value=escape("Reset"), type=escape("button"))
        self.graph.script += "function onReset() { \n\t"                                    # Action when button pressed

        for line in self.graph.script.split("\n"):                                          # Set all counters to 0.
            if "var counter" in line and " = 0;" in line and "\t" not in line:
                self.graph.script += line[3:] + "\n\t"

        self.graph.script += "\n\t"                                                         # Beautifying

        self.graph.script += "if (is_paused) { \n\t"                                        # Updating to initial frame
        for line in self.graph.script.split("\n"):                                          # if animation is paused, by
            if "Plotly.animate(" in line:                                                   # running Plotly.animate
                self.graph.script += line + "\n\t"                                          # function just one.
                break

        self.graph.script += "} \n"                                                         # Closing if conditional

        self.graph.script += "} \n"                                                         # Ending function.

        return self.graph.script
