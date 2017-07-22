"""
This python file contains a class and methods that can create HTML tags.
"""

from translate.helpers import escape


class Tag:
    html = ""
    open_tag = ""
    close_tag = ""

    def __init__(self, tag, value="", **kwargs):
        """
        Generates HTML tags with their attributes and value.
        :param tag: HTML Tag.
        :param value: Value (goes between opening and closing tags).
        :param kwargs: Attributes.
        """
        self.tag = str(tag)
        self.attributes = []
        self.value = str(value)

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
