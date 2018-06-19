$(window).on('load', function() {
    console.log("</h1>")
    var dom = {
            //defining shorthands for our html elements
            intface: $("#interface"),
            loadSpinner: $("#loading-spinner"),
            polarisationSwitchInputs: $("#polarisation-switch input"),
            refractiveIndexInput: $("input#refractive-index"),
            refractiveIndexDisplay: $("#refractive-index-display"),
            angleInput: $("input#angle"),
            angleDisplay: $("#angle-display")
        },
        //define initial layout for the plot
        plt = {
            MaxTraceNo: 3,
            layout: {
                autosize: true, //make the plot the size of the div
                xaxis: {
                    range: [-1, 1],
                    autorange: false,
                },

                yaxis: {
                    range: [-1, 1],
                    autorange: false,
                },
                margin: {
                   l: 40, r: 10, b: 60, t: 1, pad: 5
               },
               legend: {
                   x: 0, y: 10,
                   orientation: "h"
               },
               font: {
                   family: "Fira Sans",
                   size: 16
               }
            }
        },

        phys = {
            polarisation: "s",
            refractiveIndexIndex: 6,
            angleIndex: 10,
            data: [],
            setPolarisation: function(polarisation) {
                this.polarisation = polarisation;
            },
            setRefractiveIndexIndex: function(index) {
                this.refractiveIndexIndex = index;
            },
            setAngleIndex: function(index) {
                this.angleIndex = index;
            },
            getPlotData: function() {
                return this.data[this.polarisation][this.refractiveIndexIndex][this.angleIndex];
            },
        };

    //import JSON data from online
    $.when(
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_data3.JSON"),
        $.getJSON("https://rawgit.com/EdKeys/Imperial-Visualizations/master/fresnel_data.JSON")
    ).then(function(data) { // i.e., function(JSON1, JSON2) {// success}, function() {// error}
        data = data[0];
        init(data);

    }, showJSONLoadError);

    function init(data) {
        phys.data = data;
        endLoadingScreen();
        var traces = []
        //define the initial 3 traces
        traces.push({name: "Incident Wave", x: deepCopy(phys.getPlotData())[0].x,y:deepCopy(phys.getPlotData())[0].z,
        mode: "lines",line: {width: 3}})
        traces.push({name: "Transmitted Wave",x: deepCopy(phys.getPlotData())[4].x,y:deepCopy(phys.getPlotData())[4].z,
        mode: "lines",line: {width: 3,dash: "longdash"}})
        traces.push({name: "Reflected Wave",x: deepCopy(phys.getPlotData())[8].x,y:deepCopy(phys.getPlotData())[8].z,
        mode: "lines",line: {width: 3,dash: "longdash"}})
        //plot initial graph
        Plotly.plot(div='graph', traces, layout=plt.layout,{displayModeBar: false});

        dom.refractiveIndexInput.on("input", handleRefractiveIndexSlider);
        dom.angleInput.on("input", handleAngleSlider);
    }

    function handleRefractiveIndexSlider() {
        phys.setRefractiveIndexIndex(
            input2index($(this), phys.data[phys.polarisation])
        );
        updatePlot();
        dom.refractiveIndexDisplay.html(
            roundInput($(this), phys.data[phys.polarisation])
        );
    }

    function handleAngleSlider() {
        phys.setAngleIndex(
            input2index($(this), phys.data[phys.polarisation][phys.refractiveIndexIndex])
        );
        updatePlot();
        dom.angleDisplay.html(
            roundInput($(this), phys.data[phys.polarisation][phys.refractiveIndexIndex]).concat('&deg;')
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
        return Math.round(((inputValue - minInput) / (maxInput - minInput)) * (arrayLen - 1));
    }

    function roundInput(domInput, array) {
        /** Round a given input value to the actual value in the array. Returns a string */
        var inputValue = domInput.val(),
            maxInput = parseFloat(domInput.attr("max")),
            minInput = parseFloat(domInput.attr("min")),
            arrayLen = array.length;
        return (minInput + ((maxInput - minInput) / (arrayLen - 1)) * input2index(domInput, array)).toFixed(2);
    }

    function updatePlot() {
        var traces = [0,4,8]
        var update = {},
        plotData = phys.getPlotData();
        update[0] = {
            x: plotData[0].x,
            y: plotData[0].z,
            opacity: 1,
        }
        update[1] = {
            x: plotData[4].x,
            y: plotData[4].z,
            opacity: 1,
        }
        update[2]={
            x: [plotData[0].x[0],-1*plotData[0].x[1]],
            y: plotData[0].z,
            opacity: 1,
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