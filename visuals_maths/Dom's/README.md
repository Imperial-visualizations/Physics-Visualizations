Author Dong-Woo (Dom) Ko (dk1713)
1. Copy the [animateUtil.js] file in your working directory and include it as a script in your head section.
2. Only require a complete list of the frames.
3. Firstly initAnimations(.....)
4. Then, using startAnimation(), reset(), historyPlot(index) to link it with your html.

### Functions

> ```javascript
> initAnimation(playButtonID, allFrames, extra=[], layout={}, setDuration = 50, stopValues=[0, 0], isSliders = false)
> ```
> **Input:** 
> * **playButtonID:** Play button ID (str)
> * **allFrames:** Desired frames that need to be animated ([Obj])
> * **extra:** additional plots that doesn't need to be animated ([Obj])
> * **layout:** layout for the animation (Obj)
> * **setDuration:** how fast you want the frames to trasition to the next one (float)
> * **stopValues:** Stop the animation mid frame ([float])
> * **isSlider:** Link sliders to the frame animations (bool)
>
> Initialises the animations
>

> ```javascript
> reset()
> ```
>
> Resets the frames to first frame.
>

> ```javascript
> historyPlot(index)
> ```
> **Input:**
> * **index:** frame index
> 
> plots particular frame.
>

> ```javascript
> update() 
> ```
>
> Transits the frames in order.
>

> ```javascript
> pauseComp(ms)
> ```
> **Input:** 
> *	**ms:**  Pause the computation for this amount.
>


> updateSlider()
> Updates the frame slider value and slider position
>

> ```javascript
> startAnimation ()
> ```
> Plays the animation
>
