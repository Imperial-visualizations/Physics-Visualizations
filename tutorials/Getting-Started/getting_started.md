# Getting Started (2017)

*This is a quick guide to getting started with the Imperial-Visualizations project to speed up set-up time.*

## Introduction

The Imperial-Visualizations project is a team project in which collaboration and staying up-to-date with each other (especially within subteams) is vital. In order to co-ordinate this we are currently using Slack and Trello. Coding in Python and Jupyter Notebooks also needs to standardised so we use the most recent Anaconda installation.

## Team Apps

### Slack

Slack is a cloud-based set of team collaboration tools and services including messaging channels, apps, and direct messaging. This ensures that everyone can contact each other and is the backbone for working remotely. It also has desktop and mobile apps.

1. Create a Slack account https://slack.com/ 

2. Slack admins (@c.clewley, @jamie, and @akashb95) can add people via the https://imperialvisualize.slack.com/admin/invites page. Or more easily by going to the Imperial-Visualizations slack, going to the Imperial-Visualizations drop-down menu, clicking *Invite people* and creating an invite link to be shared to all new project members.

3. Once you have joined the slack you will see a list of channels. The most important channels to join are *#general* (announcements and general discussion) and *#standup* (more on standup reports later). The *#code-help* and *#random* channels should be self explanatory. It is recommended to mute the *#trello* (linked to the core team's research trello for 2017) and *#github* (linked to the GitHub repo) channels as these can become quite spammy. We currently have the *#electromagnetism*, *#maths*, and *#mechanics* visualization channels but if one for your development stream doesn't yet exist feel free to make your own.

4. Standup reports are currently managed by @anthony_li where the *Standuply* app will ask each team member questions every working day on what they have done, obstacles encountered, and what they plan to do the next day. This is based upon agile software development principles (specifically Scrum) but removes the issues of standup meetings which can get sidetracked or delayed. Everyone can see what everyone else has been up to and see if any similar obstacles (which arise often in a project such as this) are encountered or have been overcome.

### Trello

Trello essentially a todo list that organises projects into various boards. This is powerful for project development and can be used to easily plan what is being done, what is going to be done, who is working on what, and what features need to be worked on. It also has a mobile app.

1. Create a Trello account https://trello.com/

2. Trello admins (@c.clewley, @jamie, @akashb95, @cyd_cowley, and @anthony_li) can add people via the https://trello.com/impvis/members page. 

3. Once you have joined the team you will see various project boards. Current boards are *Core Team* (no longer in use as set-up process is completed), *E&M group*, *Math group*, *Mechanics and V\&W*. If a board for your development stream doesn't yet exist feel free to make your own.

4. When you create a Trello account it will automatically create a welcome board for you. It is recommended to take the 5 minutes to work through the examples on this board to rapidly learn what Trello can offer.

## Coding Apps

## Anaconda

Anaconda is a Python platform which comes with many Python libraries installed, as well as other data science tools. At the start of the project we make sure everyone has the same Python version with up to date libraries by installing the latest version of Anaconda, or if it is already installed by updating Python and any exist libaries. It is a desktop program. 

1. Download and install Anaconda https://www.continuum.io/downloads.

2. Anaconda is best navigated using the Anaconda Navigator program which will come with the installation.

3. It is likely that you will need to install the *plotly.py* library for this project. To install more Python libraries in the Anaconda Navigator go to *Environments* on the left hand toolbar. The default Python environment is the *root* environment which shows all the Python libraries currently installed. You can then search the *Not installed* libraries for *plotly* and install it. You can also update existing libraries here

## Jupyter Notebooks

Jupyter Notebooks are a platform for separating code into segments and can be used to run isolated blocks of code. Their main purpose is that markdown text can be inserted to explain or give code context. It also allows anyone with the notebook to edit a segment of code and see what kind of change results. We will be creating Jupyter Notebooks to explain and demonstrate Physics using Python code. They are usually run online using your computer as a local host. 

1. Jupyter Notebooks files are saved as .ipynb (iPython Notebook) files.

2. Notebooks require a server to be hosted on and can be started from the Anaconda Navigator or by typing *jupyter notebook \&* into the command prompt. You will then need to navigate to and open the .ipynb file. 

## PEP8 and IDEs (Integrated Development Environments)

In order to make sure that people can understand what our code is doing (particularly for future work) we need to follow PEP8 for any Python code, particularly comments and documentation. The style guide is available at https://www.python.org/dev/peps/pep-0008/ and it is vital to read the section on *Comments*. If you want to improve your coding style reading the section on *Code layout* (and in fact the whole guide if you have time) would be beneficial.

1. IDEs make it easier to understand what your code is doing by highlighting functions. Some even check if your code is following PEP8 and checks your code for errors as you type. I recommend PyCharm for coding in Python https://www.jetbrains.com/pycharm/download/ and the professional version is free for students. If you plan to use PyCharm you can change the project interpreter and appearance theme by going to *File -> Settings*. I recommend using the Darcula theme for coding where possible as it puts far less strain on the eyes, particularly after extended periods of time.

2. JetBrains also have other development IDEs such as for web development free for students but I haven't tried these so I can't comment how useful they are. I currently even use PyCharm for creating markdown (after installing a plugin), and for coding in javascript and html (although it doesn't seem ideal for this). 

## Javascript

Javascript is *the* client-side programming language. In order to create fully interactive web apps we need to use Javascript as Python cannot run client-side and cannot send information about the user's actions back to a server - once the Python code has been run that's the final product. HTMl and CSS also are used here for formatting and rendering the web page. 

1. You don't need to install anything to work in HTML/Javascript. Just make sure that you have a good IDE to make your coding life easier and that you save the files as .html or .js files just as you would use the .py extension when saving Python files.

## Development

All coding collaboration is done via GitHub. See the [git tutorial](https://anthonyli358.github.io/Imperial-Visualizations/git/git#local-and-remote-files "git tutorial") for more details. 

### Process

1. proof of concept
notebooks
javascript web apps
final output is:

### Coding

jupyter notebooks (ipynb problems)
look through examples and tutorials
work from 2017 (should be well documented)
check the pinned message on slack/general
similar problems (documentation)

_________________________________________________________________________________________________

Thanks for reading this far! Please direct any further questions, suggestions, or corrections to Caroline Clewley (@c.clewley), or (the students involved in the set-up process) Akash Bhattacharya (@akashb95), Jamie Coombes (@jamie), Cyd Cowley (@cyd_cowley), and Anthony Li (@anthony_li) on the Imperial-Visualizations Slack.
