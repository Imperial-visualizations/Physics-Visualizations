"""
Helper functions to create Javascript files from Python commands.
"""


def var(s, decode=False):
    """
    Puts special character "~" around strings that are to be variable names in JS.
    When called again, removes special character and quotes to indicate that the string is a variable, NOT an object.
    :param s: "str" or "~str~" or "\"~str~\"".
    :param decode:
    :return: "~str~" or str.
    """
    if s.find("~") == -1 and not decode:
        s = "~" + s + "~"
        return s

    elif s.find("~") != -1 and decode:
        s = s.replace("~\"", "")
        s = s.replace("\"~", "")
        s = s.replace("~", "")
        return s

    return s


def escape(s):
    """
    Returns string literal if s is a string.
    :param s: input value
    :return: string literal.
    """
    # Ensuring input is string before adding quotes.
    # Also ensuring if already escaped, it isn't escaped again.
    if str(type(s)) == "<class 'bool'>":
        return str(s).lower()

    elif str(type(s)) == "<class 'str'>":
        if s == "\"false\"" or s == "\"False\"" or s == "False" or s == "false":
            return str("false")

        elif s == "\"true\"" or s == "\"True\"" or s == "True" or s == "true":
            return str("true")

        elif "\'" in s or "\"" in s:
            return s

        return "\"" + s + "\""

    else:
        return s


def jsify(data, variable_name=None):
    """

    :param variable_name: Name of variable to which attributes are added.
    :param data: Attributes of the variable.
    :return:JS script in string.
    """
    js = ""
    if variable_name:
        if variable_name[:1].isalpha():
            js += "var {variable_name} = ".format(variable_name=variable_name)

        else:
            raise NameError("function name must begin with a letter a-z, A-Z, not {string}"
                            .format(string=str(variable_name[:1])))

    def process(d):
        """

        :param d: dictionary
        :return: js string with object parameters.
        """
        attributes_js = "{"
        for key, value in d.items():
            if str(type(value)) == "<class 'dict'>":
                attributes_js += "{key}: {val}, ".format(key=key, val=process(value))

            else:
                attributes_js += "{key}: {val}, ".format(key=key, val=escape(value))

        attributes_js = attributes_js[:-2]
        attributes_js += "}"
        return str(attributes_js)

    js_attributes = process(data)
    js += js_attributes + ";\n"

    return js


class Tag:
    html = ""
    open_tag = ""
    close_tag = ""

    def __init__(self, tag, val="", **kwargs):
        """
        Generates HTML tags with their attributes and value.
        :param tag: HTML Tag.
        :param value: Value (goes between opening and closing tags).
        :param kwargs: Attributes.
        """
        self.tag = str(tag)
        self.attributes = []
        self.value = str(val)

        for name, value in kwargs.items():
            # Treating quotes as string literals - escape.
            if "\"" or "\'" in value:
                escape(value)
            self.attributes.append(str(name) + "=" + str(value))

        self.generate()
        return

    def __repr__(self):
        """For easier reading when print(tag_object) is used."""
        return str(self.html)

    def __add__(self, other):
        return str(self.html.join(other))

    def open(self):
        """
        Creates opening HTML tag: <tag>
        :return:
        """
        self.open_tag += "<" + self.tag + " "   # Beginning HTML tag.

        for attribute in self.attributes:       # Processing attributes passed in as kwargs.
            self.open_tag += attribute + " "

        self.open_tag = self.open_tag[:-1]      # Removing last space from attributes - cleaner.
        self.open_tag += ">"

        return

    def close(self):
        """
        Creates closing tag: </tag>
        :return:
        """
        self.close_tag += "</" + self.tag + ">"
        return

    def generate(self):
        """
        Generates HTML with given input. <tag>value</tag>
        :return:
        """
        self.open()
        self.close()

        self.html = self.open_tag + self.value + self.close_tag
        return


class Data:
    """
    Class to create JSON from keyword arguments.
    """
    def __init__(self, **kwargs):
        """

        :param kwargs: JS attribute-value pairs passed in as Python keyword arguments.
        """
        self.json = {}                              # Dictionary where all attribute-value pairs will be stored.
        for attribute, value in kwargs.items():
            self.attribute = attribute
            self.value = value
            self.format_data()
        return

    def __repr__(self):
        return str(self.json)

    def __add__(self, other):
        self.json.update(other)

    def format_data(self):

        if self.attribute.find("_") != -1:                  # Find if attribute has "_" in it: chosen notation for
            tmp = {}                                        # nested attributes, e.g. marker size/color/opacity/etc.

            def de_score(s, v, d):
                """
                In this module, it has been decided that nested attributes required to define some attributes such as
                marker size/color/opacity/etc (see PlotlyJS documentation for for full details) will be separated by
                the underscore character ("_"). This function will decrypt the nested loops and
                :param s: Attribute string.
                :param v: Value of attribute.
                :param d: Dictionary in which to store attribute-value pair.
                :return:
                """
                # PlotlyJS attributes that are defined with underscores in them.
                underscore_exceptions = ["paper_bgcolor", "plot_bgcolor", "error_y", "error_x", "copy_ystyle",
                                         "copy_zstyle"]
                if s in underscore_exceptions:              # Escape de_score function if it is in list of exceptions.
                    return 0

                parent = s[:s.find("_")]                    # Text before "_": the key to the JSON object.
                child = s[s.find("_") + 1:]                 # Text after "_": the value of the JSON object.

                if child.find("_") == -1:                   # If "_" is not the remaining string after initial "_"...
                    value = escape(v)                       # Setting key as the parent to a dictionary with sub-key of
                    d[parent] = {child: value}              # the child.
                    return d

                if child.find("_") != -1:                   # If "_" in remaining string after initial "_"...
                    d[parent] = {child: {}}                 # Creating dictionary within dictionary.
                    d[parent] = de_score(child, v, d[parent][child])        # Recursively calling "de_score"

                return d
            # /------------------------------ End of "de_score" function definition ---------------------------------/ #

            tmp = de_score(self.attribute, self.value, tmp)

            if tmp != 0:                                  # Making sure attribute is not simply one of the excluded.
                def check_duplicate(temp_d, d):
                    """
                    If some values for the attribute already exist, then this function makes sure the existing values
                    are not overwritten.
                    :param temp_d: Dictionary to be tested
                    :param d: Dictionary against which duplicates will be tested.
                    :return:
                    """
                    for key, value in temp_d.items():
                        value = escape(value)
                        if key in d:
                            if str(type(value)) == "<class 'dict'>":
                                check_duplicate(temp_d[key], d[key])

                            else:
                                if d[key] != value:
                                    print("Warning: Clobbering value of {key} with {val}"
                                          .format(key=key, val=value))
                                d[key] = value

                        else:
                            d[key] = value

                    return d

                # /----------------------- End of "check_duplicate" function definition ----------------------------/ #

                check_duplicate(tmp, self.json)

            else:
                self.json.update(tmp)                       # Adding attribute to make final JSON.

        else:                                               # If no life ain't so difficult...
            self.json[self.attribute] = escape(self.value)

        return


class Document:
    doctype = Tag("!doctype html")                                              # Making sure CSS3 and HTML5 recognised
    language = Tag("html")                                                      # Document language declared.
    source = Tag("script", src="https://cdn.plot.ly/plotly-latest.min.js")      # Defining location of PlotlyJS source.
    jquery = Tag("script", src="https://code.jquery.com/jquery-latest.min.js")  # Defining location of JQuery source.
    head = Tag("head", val=source.html + jquery.html)                           # Putting script source in head of HTML.

    # Including CSS file path
    css = Tag("link", rel="stylesheet", href="https://manglekuo.com/i-v/styles.css?v=2").open_tag

    def __init__(self, graph, title=None, width=90, height=100):
        self.graph = graph
        self.div_id = graph.div_id
        self.graph_loc = Tag("body")                                        # Graph will be in document body by default.
        self.div_style = escape("width:" + str(width) + "%; " + "height:" + str(height) + "%")

        # Creating first few lines of HTML
        self.page = self.doctype.open_tag + "\n"
        self.page += self.language.open_tag + "\n"

        if title:
            self.title = Tag("title", val=title)

        else:
            self.title = Tag("title", val="PlotlyJS Plot")

        self.head = Tag("head",
                        val=self.source.html + "\n" +
                        self.jquery.html + "\n" +
                        self.title.html + "\n" +
                        self.css + "\n")

        self.page += self.head.html + "\n" + self.graph_loc.open_tag + "\n"

        self.add_plots()
        self.add_buttons()
        self.add_sliders()

        return

    def add_plots(self):
        """
        Adding div and corresponding PlotlyJS graph to HTML page.
        :return:
        """
        for div, plots in self.graph.script.items():
            self.page += Tag("div", id=div, style=self.div_style).html + "\n"
            self.page += Tag("script", val=plots).html + "\n"
        return

    def add_buttons(self):
        """
        Adding div and corresponding buttons to HTML page
        :return:
        """
        for div, plot_buttons in self.graph.buttons.items():
            self.page += div + "\n"
            for button in plot_buttons:
                self.page += button + "\n"
        return

    def add_sliders(self):
        return

    def create(self, filename):
        """
        Writing HTML to file.
        :param filename: Name of file to which HTML will be written.
        :return:
        """
        # Finishing HTML page with closing tags.
        self.page += "\n" + self.graph_loc.close_tag + "\n" + self.language.close_tag + "\n"

        # Making sure file is a .html file.
        filename = str(filename)
        if filename[-5:] != ".html":
            filename += ".html"

        # Writing to file
        file = open(filename, "w")
        file.write(self.page)
        file.close()
        return
