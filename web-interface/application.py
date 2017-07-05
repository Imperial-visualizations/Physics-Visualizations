from flask import Flask, flash, redirect, render_template, request, session, url_for
from flask_session import Session
from passlib.apps import custom_app_context as pwd_context
from tempfile import mkdtemp
from sql import SQL
from helpers import apology, login_required

# configure application
app = Flask(__name__)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

# configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# configure SQL class from sql.py to use MySQL database
db = SQL("mysql://root@localhost/impvis")


@app.route("/")
@login_required
def index():
    """Page showing active transactions."""
    return apology("TOO")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in."""

    # forget any user_id
    session.clear()

    # if user reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username")

        # ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password")

        # query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))

        # ensure username exists and password is correct
        if len(rows) != 1 or not pwd_context.verify(request.form.get("password"), rows[0]["hash"]):
            return apology("invalid username and/or password")

        # remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # redirect user to home page
        return redirect(url_for("index"))

    # else if user reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out."""

    # forget any user_id
    session.clear()

    # redirect user to login form
    return redirect(url_for("login"))


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user."""
    if request.method == "POST":
        # ensure email was submitted
        if not request.form.get("email"):
            return apology("must provide email")

        # ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username")

        # ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password")
            
        # ensure password entered again.
        elif not request.form.get("confirm_pass") or request.form.get("password") != request.form.get("confirm_pass"):
            return apology("Passwords", "DO NOT MATCH!")
        
        # check if username already taken
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))
        
        if len(rows) != 0:
            return apology("Account name taken already", "Sozzz!")

        # check if email already taken
        rows = db.execute("SELECT * FROM users WHERE email = :email", username=request.form.get("email"))

        if len (rows) != 0:
            return apology("This email is", "Already registered!")
        
        # hash and store password in database
        hashed = pwd_context.encrypt(request.form.get("password"))
        db.execute("INSERT INTO users (username, hash) VALUES(:username, :hashed)",
                   username=request.form.get("username"), hashed=hashed)
        
        return redirect(url_for("login"))
        
    else:
        return render_template("register.html")


@app.route("/unregister", methods=["GET", "POST"])
def unregister():
    """Unregisters an existing user"""
    if request.method == "POST":
        # ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username")

        # ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password")
            
        # ensure password entered again.
        elif request.form.get("password") != request.form.get("confirm_pass"):
            return apology("Passwords", "DO NOT MATCH!")
        
        # query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))

        # ensure username exists and password is correct
        if len(rows) != 1 or not pwd_context.verify(request.form.get("password"), rows[0]["hash"]):
            return apology("invalid username and/or password")
        
        # delete from database
        session.clear()
        db.execute("DELETE FROM users WHERE username = :username", username=request.form.get("username"))
        
        return redirect(url_for("login"))
        
    elif request.method == "GET":
        return render_template("unregister.html")
