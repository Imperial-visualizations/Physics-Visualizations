from vectors import Vector
import pygame as pg
from pygame.locals import *
from numpy import random
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


class Game:
    DIFFICULTY = 1
    WIDTH = 500
    HEIGHT = 600
    ROW = 5
    COLUMN = 5
    SCORE = 0
    LIVES = 2

    def __init__(self, difficulty):
        if difficulty:
            self.DIFFICULTY = difficulty
        self.window = pg.display.set_mode([self.WIDTH, self.HEIGHT])
        pg.display.set_caption("Basic Breakout")
        pg.init()
        self.run()
        return

    def run(self):

        # Initial coordinates of paddle.
        p_init_coords = Vector(int(0.3 * self.window.get_width()), self.window.get_height() - 20)

        # Initialising ball.
        ball = Ball(self.window, 7,
                    Vector(self.window.get_width()/2, int(((49/50) * self.window.get_height()) - 37)),
                    Vector(0, 0))

        # Initialising paddle.
        paddle = Paddle(self.window, p_init_coords)

        # Initialising bricks.
        bricks = Bricks(self.window, RED, self.ROW, self.COLUMN)

        while self.LIVES - ball.restarts >= 0:
            for event in pg.event.get():
                # Exits if close button pressed.
                if event.type == QUIT:
                    pg.display.quit()
                    sys.exit(0)

                # Exits if escape key pressed.
                if event.type == KEYDOWN and event.key == K_ESCAPE:
                    pg.display.quit()
                    sys.exit(0)

                # Give ball an initial velocity when space key is pressed.
                if not ball.moving:
                    ball.follow_mouse(paddle)
                    if event.type == KEYDOWN and event.key == K_SPACE:
                        ball.start_move(self.DIFFICULTY)
                        ball.moving = True
                break

            if len(bricks.bricks) == 0:
                ball.velocity = Vector(0, 0)
                self.won()

            # Make screen blank.
            self.window.fill(BLACK)
            self.update_score()
            self.update_lives(ball.restarts)

            # Move objects on screen.
            if ball.moving:
                ball.move()
                ball.collision_paddle(paddle)

                # Accessing list of bricks in object 'bricks'.
                for brick in bricks.bricks:
                    # Check if collision has happened.
                    if ball.collision_bricks(brick):
                        # Removing brick ball collided with.
                        bricks.bricks.remove(brick)
                        # Updating score.
                        self.SCORE += 1

            paddle.move()

            # Draw objects on screen.
            ball.draw()
            bricks.draw()
            paddle.draw()

            # Update graphical contents of the window.
            pg.display.update()
            time.sleep(0.02)

        if self.LIVES - ball.restarts < 0:
            self.lost()

        return

    def lost(self):
        time.sleep(1)
        self.window.fill(BLACK)
        font = pg.font.SysFont('liberationserif', 100)
        gameover = font.render('You Lost. :/', True, BLUE, BLACK)
        self.window.blit(gameover, (70, 200))
        pg.display.update()
        time.sleep(5)
        pg.quit()

        # Window closes
        sys.exit()

    def won(self):
        font = pg.font.SysFont('liberationserif', 100)
        gameover = font.render('You Won!', True, GREEN, BLACK)
        self.window.blit(gameover, (100, 200))
        pg.display.update()
        time.sleep(5)
        pg.quit()

        # Window closes
        sys.exit()

    def update_score(self):
        font = pg.font.SysFont('liberationserif', 30)
        scoreboard = font.render("score: " + str(self.SCORE), True, BLUE)
        self.window.blit(scoreboard, (int(self.window.get_width()/2.25), self.window.get_height()/2))
        return

    def update_lives(self, num_restarts):
        font = pg.font.SysFont('liberationserif', 30)
        lifeboard = font.render("<3 : " + str(self.LIVES - num_restarts), True, RED)
        self.window.blit(lifeboard, (int(self.window.get_width() / 2.15), self.window.get_height() / 1.8))
        return


class Brick:

    def __init__(self, screen, color, coords, width, height):
        """
        :param coords: Vector coordinates
        :param width: int
        :param height: int
        :param color: RGB values
        :param direction: Initial Velocity
        """
        self.screen = screen
        self.coords = coords
        self.width = width
        self.height = height
        self.color = color
        return

    def draw(self):
        """
        Draws the brick as a rectangle on screen.
        :return: 
        """
        pg.draw.rect(self.screen, self.color, (self.coords.x, self.coords.y, self.width, self.height), 1)
        return


class Bricks:
    h_buffer = 3
    v_buffer = 2
    b_coords = []
    bricks = []

    def __init__(self, screen, color, row, column):
        """
        Initialises a set of bricks.
        :param screen: Surface on which bricks are drawn.
        :param row: Number of rows
        :param column: Number of column
        :param color: Color of bricks.
        """
        self.screen = screen
        self.row = row
        self.column = column
        self.width = screen.get_width()/row - self.h_buffer
        self.height = screen.get_height()/(5*column) - self.v_buffer
        self.color = color

        self.calculate_coordinates()
        self.init_bricks()
        return

    def calculate_coordinates(self):
        """
        Creates a list of coordinates for bricks to be initiated at.
        :return: 
        """

        for i in range(0, self.column):
            for j in range(0, self.row):
                x = 2 * self.h_buffer + (j * self.width)
                y = 2 * self.v_buffer + (i * self.height)
                coords = Vector(int(x), int(y))
                self.b_coords.append(coords)
        return

    def init_bricks(self):
        for i in range(0, len(self.b_coords)):
            brick = Brick(self.screen, self.color, self.b_coords[i], self.width, self.height)
            self.bricks.append(brick)
        return

    def remove(self, coords):

        for i in range(0, len(self.bricks)):
            tmp = self.bricks[i] - coords
            if tmp.x > 0:
                self.bricks.pop(i)
                return
        return

    def draw(self):
        """
        Draw each brick in list of bricks.
        :return: 
        """
        for brick in self.bricks:
            brick.draw()
        return


class Ball:

    def __init__(self, screen, radius, coords, velocity):
        """
        Initialises ball.
        :param screen: The Screen on which ball is drawn.
        :param radius: The radius of the ball.
        :param coords: The Vector coordinates of centre of the ball.
        :param velocity: The Vector velocity of ball.
        """
        self.radius = radius
        self.coords = coords
        self.screen = screen
        self.velocity = velocity
        self.initial_coords = Vector(int(self.screen.get_width()/2), int(((49/50) * self.screen.get_height()) - 37))

        self.moving = False
        self.restarts = 0
        return

    def draw(self):
        """
        Draws a circle as a ball.
        :return: None.
        """
        pg.draw.circle(self.screen, BLUE, (int(self.coords.x), int(self.coords.y)), self.radius, 0)
        return

    def follow_mouse(self, paddle):
        """
        Function to make sure ball x coordinate matches mouse's x coordinates.
        :return: 
        """
        mouse_x = pg.mouse.get_pos()[0]

        if mouse_x != self.coords.x:
            if (mouse_x >= paddle.width/2) and (mouse_x <= self.screen.get_width() - paddle.width/2):
                self.coords.x = int(mouse_x)
        return

    def start_move(self, difficulty):
        """
        Generates a velocity Vector dependent on difficulty level.
        :return: Velocity Vector.
        """
        # Making sure ball is not moving already.
        if self.moving:
            return

        v_x = random.randint(-10, 10) + 2 * difficulty
        if abs(v_x) < 2:
            v_x += 2 + difficulty
        v_y = - random.randint(10, 15) - 2 * difficulty

        self.velocity = Vector(v_x, v_y)

        self.coords += self.velocity
        self.coords.x = int(self.coords.x)
        self.coords.y = int(self.coords.y)
        self.moving = True
        return

    def move(self):
        """
        Finds new coordinates of ball.
        :return: 
        """
        # Making sure ball is moving already.
        if not self.moving:
            return

        self.coords += self.velocity
        self.coords.x = int(self.coords.x)
        self.coords.y = int(self.coords.y)
        self.bounce()
        return

    def bounce(self):
        """
        Function to change velocities when circle hits the upper 3 walls
        Pauses game for 1 second if ball hits the bottom wall.
        :return:
        """
        if self.coords.x <= self.radius or self.coords.x + self.radius >= self.screen.get_width():
            self.velocity.x = int(-self.velocity.x)

        if self.coords.y <= 0:
            self.velocity.y = int(-self.velocity.y)
        return

    def collision_bricks(self, rect):
        """
        Function to check if Ball has collided with a Brick.
        :param rect: Rect.
        :return: 
        """
        r_left = int(rect.coords.x)
        r_right = int(rect.coords.x + rect.width)
        r_top = int(rect.coords.y)
        r_bottom = int(rect.coords.y + rect.height)

        # Doing nothing if ball is further away from the top left of the rectangle than the sum of its radius and
        # the width of the rectangle. Reduces computation times.
        if self.coords.x - rect.coords.x > rect.width + self.radius:
            return False

        for x in range(r_left, r_right):
            for y in range(r_top, r_bottom):
                d = math.hypot(x - self.coords.x, y - self.coords.y)
                if d <= self.radius:
                    if self.coords.y - self.radius <= r_bottom or self.coords.y + self.radius >= r_top:
                        self.velocity.y = -self.velocity.y
                        return True
        return False

    def collision_paddle(self, paddle):
        """
        Function to check if Ball has collided with a Paddle.
        :param paddle: Rect
        :return: 
        """
        r_left = pg.mouse.get_pos()[0] - paddle.width
        r_right = pg.mouse.get_pos()[0] + paddle.width
        r_top = paddle.coords.y

        # Doing nothing if ball is further away from the top left of the rectangle than the sum of its radius and
        # the width of the rectangle. Reduces computation times.
        if r_top - self.radius - paddle.buffer - 30 > self.coords.y:
            return

        elif r_top - self.radius - paddle.buffer - 5 <= self.coords.y:
            if r_left <= self.coords.x <= r_right:
                self.velocity.y = -self.velocity.y
                return
            else:
                pg.time.wait(1)
                self.velocity = Vector(0, 0)
                self.coords = self.initial_coords
                self.restarts += 1
                self.moving = False
                return

        return


class Paddle:

    def __init__(self, screen, coords):
        """
        Initialises paddle.
        :param screen: Screen on which paddle is to be drawn.
        :param coords: Vector coordinates of top left hand corner of the padddle.
        """
        self.screen = screen
        self.width = int(screen.get_width()/4)
        self.height = int(screen.get_height()/50)
        self.buffer = 4
        self.coords = coords
        return

    def draw(self):
        pg.draw.rect(self.screen, GREY, (int(self.coords.x), int(self.coords.y - self.height - self.buffer),
                                                   self.width, self.height), 0)
        return

    def move(self):
        mouse_x = pg.mouse.get_pos()[0]

        if mouse_x != self.coords.x and mouse_x >= self.width/2 and mouse_x + self.width/2 <= self.screen.get_width():
            self.coords.x = int(mouse_x - self.width/2)

        return

    def widen(self):
        """
        Bonus feature for later versions where upgrades possible. Widens paddle by factor of 2.
        :return: A wider Paddle.
        """
        self.width *= 2
        return

    def shorten(self):
        """
        Bonus feature for later versions where upgrades possible. Shortens paddle by factor of 1/2.
        :return: A shorter Paddle.
        """
        self.width /= 2
        return

Game(1)
