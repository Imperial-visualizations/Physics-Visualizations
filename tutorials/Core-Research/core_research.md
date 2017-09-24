# Core Research (2017)

*This is a quick write-up of the initial process and research for setting up the Imperial-Visualizations project. Initial discussion can be found on the #general channel on the Imperial-Visualizations Slack, and the #standup channel can be used to check work done since the visualization focused subteams joined. The #trello and #github channels summarise the main history of the process, which can be seen in more detail on the Core Team board (see archived items for boards and cards) on the Imperial-Visualizations Trello and on the Imperial-Visualizations GitHub repository (see commit history).*

A guide to getting started with the project and various other tutorials are available [here](https://anthonyli358.github.io/Imperial-Visualizations/tutorials "tutorials").


## Introduction

The aim of the Imperial-Visualizations project is to create interactive standalone web apps which are easily accessible - preferably via web link. These visualizations will help to explain Physics concepts which are difficult to understand and visualize. They should ideally be coded in Python since it has a fairly simple syntax and is taught at undergraduate level in the Imperial College London Physics course, hence increasing the breadth of audience who can understand the code. By serving the code in Jupyter Notebooks with corresponding markdown to explain concepts and give the code context, the notebooks aim to add that extra layer of understanding to increase the depth of learning.


## Research/Set-up Process

A 'core' team was put together to research and discuss how best to approach the project before the visualization focused subteams would join in 5 weeks time.

### Week 1

The main focus this week was to research interactive Python libraries and determine which best fit the project aims.

1. Set up teamwork apps (Slack and Trello).

2. The initial list of interactive Python libraries was very large:

    * bokeh
    * chaco
    * d3py
    * folium
    * ggplot
    * gleam
    * gr
    * highcharts
    * holoview
    * kibana
    * leaflet
    * leather
    * mayavi
    * mpld3
    * opendx 
    * plotly
    * pyopengl
    * pygal
    * pygame
    * seaborn
    * simpy
    * tableau
    * vincent
    * vispy
    * visvis    
    * vpython
    * vtk (with Python wrapper)

    This was narrowed down based on:

    * 3D capabilities
    * Ease of use
    * Interactivity
    * Prettiness
    * Python only? (or available in other languages?)
    * Has a server available for hosting
    
    A final shortlist was then created:
    
    * bokeh (with holoview extension)
    * gr (with jupyter interacts)
    * mayavi
    * mpld3
    * plotly (with jupyter interacts?)
    * pygame (not a graphing library)
    * pyopengl
    * vispy
    
3. Each library was then tested by attempting to create a simple interactive plot. The final shortlist at the end of the week was:

    * bokeh (with holoview extension)
    * gr (with jupyter interacts)
    * plotly (with jupyter interacts?)
    * pygame (not a graphing library)

### Week 2

The main focus this week was how to fully implement interactivity without requiring users to download anything and what the limits of possible interactivity were.

1. Discussed library testing results:

    * gr very hard to use
    * bokeh needs a server running so its updating is very intensive, despite a fairly extensive interactive sine wave plot being created fairly easily
    * plotly gives the option to create visualization frames beforehand then simply show/hide them during interactivity, removing any server strain since the whole visualization is sent to the client initially (and has the option to host plots online if required). It is also built on top of D3 - a Javascript library that would be the ideal package for this kind of project
    * pygame is perfect for non-graph based visualizations but difficult to serve to users without requiring a download
    
    The final libraries were selected to be plotly and pygame, and work began on creating interactive EM surface example. Now a method to serve the results and explanations to users without requiring downloads was required.
    
2. Researched client-side Python interpreters and to-js converters, some main examples include:

    * brython
    * pyjamas
    * pyjsdl
    * pypyjs
    * skulpt
    * transcrypt

    However it turned out that Python libraries including key packages such as matplotlib, numpy.etc are not supported by these interpreters as they are written in C so conversion must be specifically coded. Since difficult mathematical operations are required in this project this is not suitable.
    
3. Jupyter dashboards seemed like the solution - allowing Jupyter Notebooks to be served online by a server without initially showing any code. Much effort was put into getting a dashboard server working until at the end of the week one was finally up and running - it turns out Linux OS is required. However, since all computation is done server-side they can currently only suppport up to around 200 users. JupyterHub could be used to serve the Jupyter Notebooks themselves (also requires Linux OS). 

### Week 3

The main focus this week was creating a standardised dashboard layout (report vs grid view) and contacting Imperial's tech department for server space to start hosting a JupyterHub. In the meantime the team worked on getting fully to grips with plotly and writing guides on using git (people seemed to struggle with this) and plotly. Work also continued with the EM surface example, adding Jupyter interacts and additional surface options.

1. Worked on using plotly.py with Jupyter interacts in the notebooks/dashboard to enable Python interactivity:

    * Interacting during (e.g.) continuously updating sin wave not possible
    * Relativity example not possible 
    * Mouse interacts not possible
    
    Essentially interacting during an animation and updating the plot isn't possible as Python can't check information about the animations current state and therefore can't update accordingly. Mouse interacts also aren't possible in plotly.py at the moment.
    
2. The solution to this is to use a client-side programming language Javascript to code the standalone visualizations. Here Javascript is ideal as it is used in standalone web pages and can be formatted using HTML and CSS. Vitally, in addition to Python plotly is also supported for other languages including Javascript, ensuring that plots created in Python and Javascript maintain a consistent style. Plotly.js offers additional interactions over plotly.py mouse interacts and is used over D3 due to limited Javascript experience and more importantly - time. D3 is more powerful and offers superior customization but everything must be built from scratch (it requires ~200 lines to build a scatter plot compared to ~3 for plotly), whereas plotly has built in plotting, interactivity.etc for plotting (exactly what we want). However, an issue with plotly is that it is a little *too* high level, which can actually make some simple customizations quite difficult.

3. Here it was discussed that it might be useful to create a Python-Javascript transpiler to speed up working in Javascript since the expertise this year was predominantly Python based.

### Week 4

The main focus this week was for the team to start learning and using Javascript. The team aimed to create a few simple examples in plotly.js for reference and to get the Python-Javascript transpiler underway. 

1. The EM surface example was converted to Javascript and some simple Javascript examples were also created:
 
    * Outputting a json data file in Python
    * Using Javascript to read a json data file by importing it as a variable for parsing
    * Plotting a sine wave from a data file with simple interactions
    * Creating a continuously updating plot (Lorentz Attractor) which can be changed via interactions
    * Creating a simple example with intersecting normal surfaces and highlighting points/lines of intersection
    
2. Considered how the visualizations should be hosted once Imperial allocated server space and if the framework should be coded in Python (e.g. Django Flask).

3. Since the visualizations would be coded in Javascript using HTMl pages makes sense. A consistent CSS (cascading style sheets) style following the Imperial style and branding guide (www.imperial.ac.uk/media/imperial-college/staff/brand-and-style-guide/public/Branding-Guidelines-2016.pdf) for use across all visualizations is very important, and work began on creating one here. CMS (content management systems) would become important when actually hosting the pages but it is possible Imperial requires us to use theirs so this was again left until server space was allocated.

### Week 5

The main focus this week was to continue to extend the features in the plotly.js examples, partly by implementing graphics in Javascript and enabling interactivity. Work also continued on the CSS.

1. Data structure were very important for pre-generating data and reading from json data files. Standard dict (json data type) layouts were created for basic 3D and 2D scatter plots. Some work was also put into creating 3D surfaces.

2. As *the* key missing interactive feature (plotly features buttons, dropdown menus.etc), implementing Javascript sliders and linking them to plotly plots was the main focus this week. Plotly.js *onhover* and *onclick* mouse interacts were also attempted, and a bug was found for 3D interactions where plot would not update (though plotly devs are aware of and currently working on fixing this). These were tested and implemented on the EM surface example.

3. Since the visualization focused subteams would be joining the project in the next week, comments and documentation for the current plotly.py and plotly.js examples were added and updated. 

4. Work continued on the Python-Javascript transpiler and was completed for some basic plotly plots. Some example transplier outputs were created.

### Week 6

Here the 4 members of the 'core' team split up to lead the EM (electromagnetism), maths, and mechanics subteams and focus on creating visualizations. Work on finishing the Python-Javascript transpiler also continued. A Javascript alternative for pygame called "Phaser" was also discovered, perfect for creating (e.g.) collision visualizations in mechanics.


## Outcome

At the end of the project there should be two main outputs:

   * A standalone interactive web app created in Javascript, and formatted using HTML and CSS. This should be easily accessible via a simple web link.
   * A Jupyter notebook (.ipynb file) containing the code written in in Python. The code should be split into appropriate segments, given context, and explained alongside the key concepts using markdown.
   
To ensure coding time is spent efficiently and to compromise between loading and computing times, visualizations should be written in Javascript in one of two ways:

   * For computationally intensive visualizations (e.g. 3D EM waves), a json data file should first be output using Python. With the physics written in Python this will make it simple to write up in a Jupyter notebook, and plotly.js will be used to plot this pre-generated data for the interactive web app. This removes the delay due to long computation times.
   * For non-computationally intensive visualizations (e.g. a simple 2D pulse) it is possible continuously update the data in Javascript and have the user update it themselves in a completely separate Jupyter Notebook. This removes any loading times.

_________________________________________________________________________________________________

Thanks for reading this far! Please direct any further questions, suggestions, or corrections to (the members involved in the set-up process) Akash Bhattacharya (@akashb95), Jamie Coombes (@jamie), Cyd Cowley (@cyd_cowley), and Anthony Li (@anthony_li) on the Imperial-Visualizations Slack.
