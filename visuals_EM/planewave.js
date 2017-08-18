$(window).on('load', function() {

    var dom = {
            intface: $("#interface"),
            loadSpinner: $("#spinner-wrapper"),
            polarisationSwitchInputs: $("#polarisation-switch input"),
            refractiveIndexInput: $("input#refractive-index"),
            angleInput: $("input#angle")
        },
        plt = {
            MaxTraceNo: 12
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
            }
        };

    $.when(
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Vis-Raw/master/planewave.JSON")
    ).then(function(data) {
        var trace = data[0],
            layout = data[1],
            frames = data[2];

        // NOTE HOLD YOUR HORSES
        init(trace, layout, frames);

        // dom.polarisationSwitchInputs.on("change", handlePolarisationSwitch);
        // dom.refractiveIndexInput.on("input", handleRefractiveIndexSlider);
        // dom.angleInput.on("input", handleAngleSlider);

    }, showJSONLoadError);


    function init(trace, layout, frames) {
        // phys.data = data;

        endLoadingScreen();

        // Plotly.plot(div='graph', deepCopy(phys.getPlotData()), layout=layout);
        console.log(trace);
        console.log(layout);
        console.log(frames);
        Plotly.plot(div='graph', data=[trace], layout=layout).then(function() {
            Plotly.addFrames(div='graph', frames)
        })
    }


    function handlePolarisationSwitch() {
        if (this.value === "s-polarisation") {
            phys.setPolarisation("s");
        } else if (this.value === "p-polarisation") {
            phys.setPolarisation("p");
        }
        updatePlot();
    }

    function handleRefractiveIndexSlider() {
        phys.setRefractiveIndexIndex(
            input2index($(this), phys.data[phys.polarisation])
        );
        updatePlot();
    }

    function handleAngleSlider() {
        phys.setAngleIndex(
            input2index($(this), phys.data[phys.polarisation][phys.refractiveIndexIndex])
        );
        updatePlot();
    }


    function endLoadingScreen() {
        dom.loadSpinner.fadeOut(0);
    }


    function input2index(domInput, array) {
        // Compute the corresponding JSON array index for a given input value, rounding to the nearest integer
        var inputValue = domInput.val(),
            maxInput = domInput.attr("max"),
            minInput = domInput.attr("min"),
            arrayLen = array.length;
        return Math.round(((inputValue - minInput) / (maxInput - minInput)) * (arrayLen - 1));
    }


    function updatePlot() {
        var update = {},
            plotData = phys.getPlotData();
        for (var trace = 0; trace < plotData.length - 1; trace++) {
            update[trace] = {
                x: plotData[trace].x,
                y: plotData[trace].y,
                z: plotData[trace].z,
                opacity: 1
            };
        }
        for (var trace = plotData.length - 1; trace < plt.MaxTraceNo; trace++) {
            update[trace] = {
                opacity: 0
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
