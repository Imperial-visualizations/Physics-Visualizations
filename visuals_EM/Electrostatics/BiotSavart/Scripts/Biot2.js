$(window).on('load', function() {
    //create shorthand for html elements
    var dom = {
        intface: $("#interface"),
        loadSpinner: $("#loading-spinner"),
        animationInput: $("input#animation"),
        animationDisplay: $("animation-display"),
        positionInput: $("input#position"),
        positionDisplay: $("position-display"),
        },
        //define original layout of the plotly plot
        plt = {
            MaxTraceNo: 12,
            layout: {
                autosize: true,
                width: 450,
                height: 350,
                margin: {
                    l: 0, r: 0, b: 0, t: 1, pad: 5
                },
                scene: {
                    aspectmode: "cube",
                    xaxis: {
                        range: [-1, 1], autorange: false, zeroline: true, showspikes: false
                    },
                    yaxis: {
                        range: [-1, 1], autorange: false, zeroline: true, showspikes: false
                    },
                    zaxis: {
                        range: [-1, 2], autorange: false, zeroline: true, showspikes: false
                    }
                },
                hovermode: false,
                font: {
                    family: "Fira Sans",
                    size: 14
                }
            },
        },
        //create a "class" with functions to set slider values and change data based on slider values
        phys = {
            animation: 1,
            position: 0,
            data: [],
            setAnimation: function(anim) {
                this.animation = anim;
            },
            setPosition: function(pos) {
                this.position = pos;
            },
            getPlotData: function() {

                return this.data[this.position][this.animation];
            },
        };
    //import JSON and define an onload function
    $.when(
        $.getJSON("https://rawgit.com/amna-askari/JSONfilesforVisualisations/master/BiotAnimate.JSON"),
    ).then(function(data) { // i.e., function(JSON1, JSON2) {// success}, function() {// error}
        data = data.Frames;
        init(data);

    }, showJSONLoadError);
    //define function to plot the initial static graph
    function init(data) {
        phys.data = data;
        endLoadingScreen();
        traces = []
        traces.push({type: "scatter3d",mode: "lines",name: "dI", line: {width: 4},x: deepCopy(phys.getPlotData())[0].x,
            y:deepCopy(phys.getPlotData())[0].y,z:deepCopy(phys.getPlotData())[0].z})
        traces.push({type: "scatter3d",mode: "lines",name: "dB", line: {width: 4},x: deepCopy(phys.getPlotData())[1].x,
            y:deepCopy(phys.getPlotData())[1].y,z:deepCopy(phys.getPlotData())[1].z})
        traces.push({type: "scatter3d",mode: "lines",name: "r", line: {width: 3},x: deepCopy(phys.getPlotData())[2].x,
            y:deepCopy(phys.getPlotData())[2].y,z:deepCopy(phys.getPlotData())[2].z})
        traces.push({type: "scatter3d",mode: "lines",name: "dB", line: {width: 4},x: deepCopy(phys.getPlotData())[3].x,
            y:deepCopy(phys.getPlotData())[3].y,z:deepCopy(phys.getPlotData())[3].z})
        traces.push({type: "scatter3d",mode: "lines",name: "dB", line: {width: 8},x: deepCopy(phys.getPlotData())[4].x,
            y:deepCopy(phys.getPlotData())[4].y,z:deepCopy(phys.getPlotData())[4].z})
        Plotly.plot(div='graph', traces, layout=plt.layout);
        dom.animationInput.on("input", handleAnimationSlider);
        dom.positionInput.on("input", handlePositionSlider);
    }

    function handlePositionSlider() {
        phys.setPosition(
            input2index($(this), phys.data[phys.position])
        );
        updatePlot();
        dom.positionDisplay.html(
            roundInput($(this), phys.data[phys.position])
        );
    }

    function handleAnimationSlider() {
        phys.setAnimation(
            input2index($(this), phys.data[phys.position][phys.animation])
        );
        updatePlot();
        dom.animationDisplay.html(
            roundInput($(this), phys.data[phys.position][phys.animation])
        );
    }


    function endLoadingScreen() {
        dom.loadSpinner.fadeOut(0);
    }

    function input2index(domInput, array) {
        /** Compute the corresponding JSON array index for a given input value, rounding to the nearest integer */
        var inputValue = domInput.val(),
            maxInput = parseFloat(domInput.attr("max")),
            minInput = parseFloat(domInput.attr("min")),
            arrayLen = array.length;
        console.log(inputValue)
        console.log(Math.round(((inputValue - minInput) / (maxInput - minInput)) * (arrayLen - 1)))
        return Math.round(((inputValue - minInput) / (maxInput - minInput)) * (arrayLen - 1));
    }
    function roundInput(domInput, array) {
        /** Round a given input value to the actual value in the array. Returns a string */
        var inputValue = domInput.val(),
            maxInput = parseFloat(domInput.attr("max")),
            minInput = parseFloat(domInput.attr("min")),
            arrayLen = array.length;
        return (minInput + ((maxInput - minInput) / (arrayLen - 1)) * input2index(domInput, array)).toFixed(1);
    }

    function updatePlot() {
        var update = {},
            plotData = phys.getPlotData();
        for (let i = 0; i <4 ; i++) {
            update[i] = {
                x: plotData[i].x,
                y: plotData[i].y,
                z: plotData[i].z,
            };
        }
        Plotly.animate(div="graph", {
            data: getObjValues(update),
            traces: getObjKeysAsInts(update),
            layout: {}
        }, {
            transition: {duration: 0},
            frame: {duration: 0, redraw: false}
        });
    }


    function showJSONLoadError() {
        dom.loadSpinner.children(".spinner-span").html("Error: Failed to load JSON resources");
        dom.loadSpinner.children("div").fadeOut(0);
    }


    function getObjKeys(obj) {
        return Object.keys(obj);
    }
    function getObjKeysAsInts(obj) {
        return Object.keys(obj).map(Number);
    }
    function getObjValues(obj) {
        return Object.keys(obj).map(function(key) {
            return obj[key];
        });
    }

    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

});
