How the code works for EarthFlattening.js

1. Image of Earth is pre-loaded and variables declared
2. Sliders, buttons and canvas created. Function created to resume/pause the animation if the play/pause button is pressed.
3. Omega value taken from the slider and (using the mathematical expressions for oblate spheroids) an ellipsoid is plotted with the 
correct value mathematically to conserve volume. If the variable show is true (if the user is hovering over show original button) then 
the sphere which corresponds to omega = 0 which also be plotted. The image of the Earth is wrapped around the ellipsoid.
4. Point lighting is directed towards the canvas, originating from the position of the user's cursor (not important, just stylistic).