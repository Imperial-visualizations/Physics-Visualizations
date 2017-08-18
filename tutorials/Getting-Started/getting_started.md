# Getting Started (2017)

*This is a quick guide to getting started with the Imperial-Visualizations project to speed up set-up time.*

In this tutorial the % sign is used to signify a placeholder. For example, %username% would mean to use the applicable username. Various other tutorials are available [here](https://anthonyli358.github.io/Imperial-Visualizations/tutorials "tutorials").


## Introduction

The Imperial-Visualizations project is a team project in which collaboration and staying up-to-date with each other (especially within subteams) is vital. In order to co-ordinate this we are currently using Slack and Trello. Coding in Python and Jupyter Notebooks also needs to standardised so we use the most recent Anaconda installation.


## Team Apps

### Slack

Slack is a cloud-based set of team collaboration tools and services including messaging channels, apps, and direct messaging. This ensures that everyone can contact each other and is the backbone for working remotely. It also has desktop and mobile apps.

1. Create a Slack account https://slack.com/.

2. Slack admins (@c.clewley, @jamie, and @akashb95) can add members via the https://imperialvisualize.slack.com/admin/invites page. An easier way to add multiple members is to go to the Imperial-Visualizations drop-down menu on the Imperial-Visualizations Slack, clicking *Invite people*, and creating an invite link to be shared to all new project members.

3. Once you have joined Slack you will see a list of channels. The most important channels to join are *#general* (announcements and general discussion) and *#standup* (more on standup reports later). The *#code-help* and *#random* channels should be self explanatory. It is recommended to mute the *#trello* (linked to the core team's research trello for 2017) and *#github* (linked to the GitHub repo) channels as these can become quite spammy. We currently have the *#electromagnetism*, *#maths*, and *#mechanics* visualization channels but if one for your development stream doesn't yet exist feel free to make your own.

4. Standup reports (currently managed by @c.clewley) are where the *Standuply* app asks each team member questions every working day on what they have done, obstacles encountered, and what they plan to do the next day. This is based upon agile software development principles (specifically Scrum) and removes the issues of standup meetings which can often get sidetracked or delayed. Answers are compiled from replies to the app and posted on the *#standuply* channel where everyone can see what everyone else has been up to, and see if any similar obstacles (which arise often in a project such as this) have been encountered and/or overcome.

### Trello

Trello essentially a todo list that organises projects into various boards. This is powerful for project development and can be used to easily plan what is being done, what is going to be done, who is working on what, and what features need to be worked on. It also has a mobile app.

1. Create a Trello account https://trello.com/.

2. Trello admins (@c.clewley, @jamie, @akashb95, @cyd_cowley, and @anthony_li) can add members via the https://trello.com/impvis/members page. 

3. Once you have joined the team you will see various project boards. Current boards are *Core Team* (no longer in use as set-up process is completed), *E&M group*, *Math group*, *Mechanics and V\&W*. If a board for your development stream doesn't yet exist feel free to make your own.

4. When you create a Trello account it will automatically create a welcome board for you. It is recommended to take the 5 minutes to work through the examples on this board to learn what Trello can offer.


## Coding Apps

### Anaconda

Anaconda is a Python platform which comes with many Python libraries installed, as well as other data science tools. At the start of the project we make sure everyone has the same Python version with up to date libraries by installing the latest version of Anaconda, or if it is already installed by updating Python and any exist libaries. It is a desktop program. 

1. Download and install Anaconda https://www.continuum.io/downloads.

2. Anaconda is best navigated using the Anaconda Navigator program which will come with the installation.

3. It is likely that you will need to install the *plotly.py* library for this project. To install more Python libraries in the Anaconda Navigator go to *Environments* on the left-hand toolbar. The default Python environment is the *root* environment which shows all the Python libraries currently installed. You can then search the *Not installed* libraries for *plotly* and install it. You can also update existing libraries here

### Jupyter Notebooks

Jupyter Notebooks are a platform for separating code into segments and can be used to run isolated blocks of code. Their main purpose is that markdown text can be inserted to explain or give code context. It also allows anyone with the notebook to edit a segment of code and see what kind of change results. We will be creating Jupyter Notebooks to explain and demonstrate Physics using Python code. They are usually run online using your computer as a local host. 

1. Jupyter Notebooks files are saved as .ipynb (iPython Notebook) files.

2. Notebooks require a server to be hosted on and can be started from the Anaconda Navigator or by typing *jupyter notebook \&* into the command prompt. You will then need to navigate to and open the .ipynb file. 

### PEP8 and IDEs (Integrated Development Environments)

In order to make sure that everyone can understand what our code is doing (particularly for future work) we need to follow PEP8 for any Python code, particularly comments and documentation. The style guide is available at https://www.python.org/dev/peps/pep-0008/ and it is vital to read the section on *Comments*. If you want to improve your coding style reading the section on *Code layout* (and in fact the whole guide if you have time) would be beneficial.

1. IDEs make it easier to understand what your code is doing by highlighting functions. Some even check if your code is following PEP8 and checks your code for errors as you type. I recommend PyCharm for coding in Python https://www.jetbrains.com/pycharm/download/ and the professional version can be downloaded for free by using a student email address. If you plan to use PyCharm you can change the project interpreter and appearance theme by going to *File -> Settings*. I recommend using the Darcula theme for coding where possible as it puts far less strain on the eyes, particularly after extended periods of time or late at night.

2. JetBrains also have other development IDEs such as for web development free for students but I haven't tried these so I can't comment how useful they are. I currently even use PyCharm for creating markdown (after installing a plugin), and for coding in javascript and html (although it doesn't seem ideal for this). 

### Javascript

Javascript is *the* client-side programming language. In order to create fully interactive web apps we need to use Javascript as Python cannot run client-side and cannot send information about the user's actions back to a server - once the Python code has been run that's the final product. HTMl and CSS also are used here for formatting and rendering the web page. 

1. You don't need to install anything to work in HTML/Javascript. Just make sure that you have a good IDE to make your coding life easier and that you save the files as .html or .js files just as you would use the .py extension when saving Python files.


## Development

All coding collaboration is done via GitHub. See the [git tutorial](https://anthonyli358.github.io/Imperial-Visualizations/git/git#local-and-remote-files "git tutorial") for more details. 

### Process

The final aim of the project is to create standalone interactive web apps for learning which can be simply accessed via a web link. These are built using HTML, CSS, and Javascript. For deeper learning accompanying Jupyter Notebooks containing carefully selected segments of Python code with well-explained Physics and explanations should also be created. These are built using Jupyter Notebooks (.ipynb files) and will either be available to download or accessible via a JupyterHub.

1. Since the Jupyter Notebook should be easier to code (coding interactivity isn't required since students will be changing code, variables, equations.etc themselves) it makes sense to first create a proof of concept for the visualization in Python. We also found that many members are more comfortable working with classes, objects.etc in Python. The key here is to make sure the concept is well-explained in the visualization.

2. At this point consider whether the visualizations will be computationally intensive or not. If it's intensive you will need to first export the plotting data to a json data file to eliminate the delay due to long computation times. Generate this using Python to reduce the workload when creating a Jupyter Notebook (the physics enabling the data output is sufficient here). If it's not intensive it is possible continuously update the data in Javascript and have the user update it themselves in a completely separate Jupyter Notebook. This also removes any loading times.

3. Either when the code is done or during coding, it is important to add explanations of the concept and what each segment of code is doing. Here .py files should be converted to .ipynb files and code carefully split into appropriate sections. This year we left some time near the end of the project to end all coding and focus on visualization feedback, clear explanations, and consistent formatting. 

4. Javascript is required to create standalone interactive web apps. In order to do this Javascript is coded within a HTMl web page references a CSS file for styling. Get started with HTML and Javascript by following the [HTML/Javascript tutorial](https://anthonyli358.github.io/Imperial-Visualizations/HTML/DoubleClickMe "HTML/Javascript tutorial").  

### Coding

The best way to start coding a visualization is probably to first plan out how you would create it without looking at any other code. Although you can simply start coding from there it is usually beneficial here to look through code for similar visualizations to see if they follow a different approach or encounter and overcome any similar obstacles. 

1. Aside from the main tutorials there are also guides on how to get started with plotly.py inside the *examples/plotly.py* folder on any branch in the git repo. These are Jupyter Notebooks so need to be opened as such and are very useful for understanding what plotly can do in general.

2. The examples folder also contains some examples of some very basic plotly plots including interactivity and animations in both plotly.py and plotly.js. This is a good place to start looking at code since each example is focused on a single outcome/proof of concept.

3. Completed visualizations are available inside the *visualizations* folder on the *dev* and *master* branches. This folder should be fairly easy to navigate and the code well commented and documented for ease of use and understanding. Each *visuals_%subteam%* folder contains all the work completed by each subteam but the file structure.etc here is left to each subteam's discretion so may be more difficult to navigate and not as well documented. These folders will only be up to date on each subteam's working branch and of course on the *dev* and *master* branches (see the [git tutorial](https://anthonyli358.github.io/Imperial-Visualizations/git/git#local-and-remote-files "git tutorial") for more information on branches). This is the reason you should also make sure to spend the time to comment and document your code properly - so that it can be understood by others.

4. Check the pinned messages on the *#general* channel on Slack (click on the pin icon underneath the channel title) for coding and visualizations design tips, as well as solutions to various obstacles encountered by the team this year. It is recommended to pin solutions and tips here, whilst unpinning any which are no longer applicable.

_________________________________________________________________________________________________

Thanks for reading this far! Please direct any further questions, suggestions, or corrections to Caroline Clewley (@c.clewley), or (the members involved in the set-up process) Akash Bhattacharya (@akashb95), Jamie Coombes (@jamie), Cyd Cowley (@cyd_cowley), and Anthony Li (@anthony_li) on the Imperial-Visualizations Slack.
