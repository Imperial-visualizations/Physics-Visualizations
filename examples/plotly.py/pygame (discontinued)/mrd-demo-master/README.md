# Molecular Reaction Dynamics
Demonstration of classical molecular reaction dynamics for a tri-atomic system

### Downloading

Click on the **Clone or download** button to the right and download the zip file. The folder can be unzipped in your home folder.


### Starting the GUI 

#### Windows

Double click on the **lepsgui.py** file to start the GUI.

#### LINUX and OSX

In a terminal, change directory to the LepsPy directory and execute "python lepsgui.py".


### Files

#### [lepsgui.py](./lepsgui.py)

This is the main program. lepsgui generates the GUI and plots, and drives the trajectory calculations.

#### [params.ini](./params.ini)

params.ini contains the parameter sets for a number of atom combinations. New atoms and parameters can be added to the program here.

#### [params.py](./params.py)

params.py reads params.ini and passes parameters to the lepsgui.

#### [lepspoint](./lepspoint.py)

lepspoint calculations the energy, first and second energy derivatives for any point on the surface.

#### [lepnorm.py](./lepnorm.py)

lepnorm performs the dynamics and MEP steps using the energy, first and second energy derivatives.

