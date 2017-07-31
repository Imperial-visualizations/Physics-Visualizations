from vectors import Vector
import pygame as pg
from pygame.locals import *
#from numpy import random
import math
import time
import sys

# Colour codes
WHITE = 255, 255, 255
GREEN = 0, 255, 0
BLACK = 0, 0, 0
BLUE = 0, 0, 255
RED = 255, 0, 0
GREY = 211, 211, 211


class Animation:
    """Contains functions to:
    Set up a window to run animation/game in.
    Run the animation."""

    def __init__(self, name="Animation", width=500, height=300):
        # Setting window size.
        self.window = pg.display.set_mode([width, height])

        # Setting the title of the opened window.
        pg.display.set_caption(str(name))

        pg.init()
        self.run()
        return

    def run(self):
        """Runs the animation in the initiated window."""
        #TODO
        return


class Particle:

    def __init__(self, radius, pos, velocity=Vector(0, 0), mass=1, charge=0):
        self.mass = mass
        self.charge = charge
        self.radius = radius
        self.pos = pos
        self.velocity = velocity

    def