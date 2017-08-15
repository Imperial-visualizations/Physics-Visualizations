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
            self.graph = graph                          # Graph object
            self.script = graph.script                  # JS script for Graph
            self.div_id = graph.div_id                  # HTML div where graph is located.
            self.attributes = {}
            self.variables_list = []                    # Name of variables to be animated.
            self.vars = kwargs

            if len(kwargs.items()) > 0:                 # If variables to be animated provided, go ahead and animate.
                self.animate(**kwargs)
        return

    def remove_repeated_data(self):
        self.graph.remove_repeated_data()
        self.script = self.graph.script
        return

    def animate(self, **kwargs):
        """

        :param kwargs: Names of variables that are to be animated.
        :return:
        """
        # Modifying existing script to ensure the first frame is defined by data points in index 0 of data list.
        tmp = {}                                # Temporary dictionary
        for key, variable in kwargs.items():
            tmp[key] = var(variable)            # Putting each variable in dictionary as a variable
            self.script[self.div_id] = self.script[self.div_id]\
                .replace(key + ": " + variable, key + ": " + variable + "[0]")
        self.variables.append(tmp)
        return

    def show(self, **kwargs):
        """

        :param kwargs: Attributes of Plotly.animate function
        :return:
        """
        self.attributes = Data(**kwargs).json
        anim_attr_js = jsify(self.attributes)

        self.script[self.div_id] += "\n\n"                            # Beautifying before writing animation code
        self.script[self.div_id] += "var is_paused = true;\n"         # Boolean for play/pause implementation.
        variables_str = ""
        for plot in self.variables:
            variables_str += "{"
            for key, variable in plot.items():
                variables_str += "{key}: {var}[counter_{var}], ".format(key=key, var=var(variable, True))

                # Making counter for every variable
                self.script[self.div_id] += "var counter_{var} = 0;\n".format(var=var(variable, True))

                # Setting up maximum value for counter for each variable
                self.script[self.div_id] += "var counter_{var}_lim = {var}.length;\n".format(var=var(variable, True))

            variables_str = variables_str[:-2]
            variables_str += "}, "                      # Making ready to write next object.

        variables_str = variables_str[:-2]
        traces = list(range(len(self.variables)))

        # Writing JS to create animation.
        anim_script = "function update() { \n\t if (!is_paused) {\n\t\t"          # Function to show next frame
        for i in range(0, len(self.variables)):
            for key, variable in self.variables[i].items():
                anim_script += "counter_{var}++; \n\t\t".format(var=var(variable, True))            # Increment counter.
                # If last index reached, reset index and hence loop animation.
                anim_script += "if (counter_{var} === counter_{var}_lim) {{\n\t\t\t" \
                               "counter_{var} = 0;\n\t\t}}\n\t\t".format(var=var(variable, True))

        anim_script += "Plotly.animate({div_id}, {{data: [".format(div_id=self.div_id)
        anim_script += "{variables}], ".format(variables=variables_str)         # Data to show in current frame.
        anim_script += "traces: {traces}}}, ".format(traces=traces)             # Labeling traces.
        anim_script += "{anim_attr}".format(anim_attr=anim_attr_js)             # Adding attributes.

        anim_script = anim_script[:-3]                                  # Removing "};" in jsified attributes.
        anim_script += "}); \n\t\t"                                     # End of Plotly.animate function.
        anim_script += "requestAnimationFrame(update); \n\t}\n}\n"      # End of update function
        anim_script += "requestAnimationFrame(update); \n"              # Calling animation function for first time.

        self.script[self.div_id] += anim_script
        self.graph.script[self.div_id] = self.script[self.div_id]                    # Updating graph script

        continuity_buttons = Button(self.graph, self.div_id[1:-1] + "_btn")     # Passing graph script to button maker.
        self.script[self.div_id] = continuity_buttons.add_play_button()              # Making play button.
        self.script[self.div_id] = continuity_buttons.add_reset_button()             # Making reset button.

        self.graph.script[self.div_id] = self.script[self.div_id]                    # Updating graph script.
        return self.graph


class Mouse:
    def __init__(self, graph, div_id="plot", event="hover"):
        # Sanity check - is the graph of the correct type?
        if str(graph.__class__.__bases__).find("<class 'translator.statics.Graph'>") == -1:
            raise TypeError("Object graph is not derived from base class 'Graph', but from {bases}"
                            .format(bases=str(graph.__class__.__bases__)))

        else:
            self.graph = graph
            self.gdiv_id = div_id

            if event == "hover" or event == "click":
                self.event = event

            else:
                raise ValueError("Need events to be type 'hover' or 'click', not {event}".format(event=str(self.event)))

            self.script = graph.script + "\n\n"
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

    def change_opacity(self, h_value):
        """
        Changes opacity of the data point.
        :param h_value: Value of opacity to change to when hovered on.
        :return:
        """
        script = "\t"

        script += "var trace_num = data.points[0].traceNumber \n\t"
        script += "var point_num = data.points[0].pointNumber \n\t"
        script += "var opacity = []; \n\n\t"

        script += "for (var i = 0; i < {variable}.length; i++) {{ \n\t\t".format(variable="x0")
        script += "opacity.push({unhover_value}) \n\t".format(unhover_value=str(h_value))
        script += "} \n\t"
        script += "var update = {marker:{opacity: opacity}}; \n\t"
        script += "Plotly.restyle({div_id}, update, [tn]); \n"
        script += "}); \n"
        return

    def write(self, script):
        self.script += "myPlot.on('plotly_{event}', function(data) {{\n\t".format(event=self.event)
        self.script += script
        self.script += "};"
        return


class Button:
    def __init__(self, graph, div_id, **kwargs):
        # Sanity check - is the graph of the correct type?
        if str(graph.__class__.__bases__).find("<class 'translator.statics.Graph'>") == -1:
            raise TypeError("Object graph is not derived from base class 'Graph', but from {bases}"
                            .format(bases=str(graph.__class__.__bases__)))

        self.graph = graph
        self.gdiv_id = self.graph.div_id
        self.div = Tag("div", id=escape(div_id)).html
        self.buttons = []

        if len(kwargs.items()) > 0:
            self.make(**kwargs)
        return

    def make(self, **kwargs):
        button = Tag("input", **kwargs).open_tag            # Making HTML code for button.

        if self.div not in self.graph.buttons:              # If no buttons in current div, make empty list in which to
            self.graph.buttons[self.div] = []               # store buttons, with the key as the HTML tag of the div.

        self.graph.buttons[self.div].append(button)         # Adding button to dictionary of buttons.
        return

    def add_play_button(self):
        # Making HTML button.
        self.make(id=escape('run'), onclick=escape("onToggleRun()"), value=escape("Play"), type=escape("button"))

        self.graph.script[self.gdiv_id] += "function onToggleRun() { \n\t"                  # Action when button pressed
        self.graph.script[self.gdiv_id] += "is_paused = !is_paused;\n\t"                    # Toggle boolean.

        # If paused, set button text to display Play, else display Pause.
        self.graph.script[self.gdiv_id] += "document.getElementById('run').value = (is_paused) ? 'Play':'Pause';\n\t"
        self.graph.script[self.gdiv_id] += "requestAnimationFrame(update);\n}\n"             # Running animation.

        return self.graph.script[self.gdiv_id]

    def add_reset_button(self, idx=0):
        """

        :param idx: Index to return graph to.
        :return:
        """
        # Making HTML button.
        self.make(id=escape('reset'), onclick=escape("onReset()"), value=escape("Reset"), type=escape("button"))
        self.graph.script[self.gdiv_id] += "function onReset() { \n\t"                      # Action when button pressed

        for line in self.graph.script[self.gdiv_id].split("\n"):                            # Set all counters to 0.
            if "var counter" in line and " = 0;" in line and "\t" not in line:
                self.graph.script[self.gdiv_id] += line[3:-2] + "{idx};\n\t".format(idx=idx)

        self.graph.script[self.gdiv_id] += "\n\t "                                           # Beautifying

        self.graph.script[self.gdiv_id] += "if (is_paused) { \n\t"                          # Updating to initial frame
        for line in self.graph.script[self.gdiv_id].split("\n"):                            # if animation is paused, by
            if "Plotly.animate(" in line:                                                   # running Plotly.animate
                self.graph.script[self.gdiv_id] += line + "\n\t"                            # function just one.
                break

        self.graph.script[self.gdiv_id] += "} \n"                                            # Closing if conditional
        self.graph.script[self.gdiv_id] += "} \n"                                            # Ending function.

        return self.graph.script[self.gdiv_id]


class Draw:
    variables = []  # List of dictionaries

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
            self.graph = graph  # Graph object
            self.script = graph.script  # JS script for Graph
            self.div_id = graph.div_id  # HTML div where graph is located.
            self.attributes = {}
            self.variables_list = []  # Name of variables to be animated.
            self.vars = kwargs

            if len(kwargs.items()) > 0:  # If variables to be animated provided, go ahead and animate.
                self.draw(**kwargs)
        return

    def draw(self, **kwargs):
        """

        :param kwargs: Names of variables that are to be animated.
        :return:
        """
        # Modifying existing script to ensure the first frame is defined by data points in index 0 of data list.
        tmp = {}                                                    # Temporary dictionary.
        for key, variable in kwargs.items():
            tmp[key] = var(variable)                                # Putting each variable in dictionary as a variable

        self.variables.append(tmp)
        return

    def show(self, **kwargs):
        """

        :param kwargs: Attributes of Plotly.animate function
        :return:
        """
        self.attributes = Data(**kwargs).json
        anim_attr_js = jsify(self.attributes)

        self.script[self.div_id] += "\n\n"                      # Beautifying before writing animation code
        self.script[self.div_id] += "var is_paused = true;\n"   # Boolean for play/pause implementation.
        variables_str = ""
        for plot in self.variables:
            variables_str += "{"
            for key, variable in plot.items():
                variables_str += "{key}: {var}.slice(0, counter_{var}), ".format(key=key, var=var(variable, True))

                # Making counter for every variable
                self.script[self.div_id] += "var counter_{var} = 0;\n".format(var=var(variable, True))

                # Setting up maximum value for counter for each variable
                self.script[self.div_id] += "var counter_{var}_lim = {var}.length;\n".format(
                    var=var(variable, True))

            variables_str = variables_str[:-2]
            variables_str += "}, "  # Making ready to write next object.

        variables_str = variables_str[:-2]
        traces = list(range(len(self.variables)))

        # Writing JS to create animation.
        anim_script = "function update() { \n\t if (!is_paused) {\n\t\t"                   # Function to show next frame

        for i in range(0, len(self.variables)):
            for key, variable in self.variables[i].items():
                anim_script += "counter_{var}++; \n\t\t".format(var=var(variable, True))   # Increment counter.
                # If last index reached, reset index and hence loop animation.
                anim_script += "if (counter_{var} === counter_{var}_lim) {{\n\t\t\t" \
                               "counter_{var} = 0;\n\t\t}}\n\t\t".format(var=var(variable, True))

        anim_script += "Plotly.animate({div_id}, {{data: [".format(div_id=self.div_id)
        anim_script += "{variables}], ".format(variables=variables_str)     # Data to show in current frame.
        anim_script += "traces: {traces}}}, ".format(traces=traces)         # Labeling traces.
        anim_script += "{anim_attr}".format(anim_attr=anim_attr_js)         # Adding attributes.

        anim_script = anim_script[:-3]                                      # Removing "};" in jsified attributes.
        anim_script += "}); \n\t\t"                                         # End of Plotly.animate function.
        anim_script += "requestAnimationFrame(update); \n\t}\n}\n"          # End of update function
        anim_script += "requestAnimationFrame(update); \n"                  # Calling animation function for first time.

        self.script[self.div_id] += anim_script
        self.graph.script[self.div_id] = self.script[self.div_id]           # Updating graph script

        continuity_buttons = Button(self.graph, self.div_id[1:-1] + "_btn")  # Passing graph script to button maker.
        self.script[self.div_id] = continuity_buttons.add_play_button()      # Making play button.
        self.script[self.div_id] = continuity_buttons.add_reset_button(1)    # Making reset button.

        self.graph.script[self.div_id] = self.script[self.div_id]            # Updating graph script.
        return self.graph
