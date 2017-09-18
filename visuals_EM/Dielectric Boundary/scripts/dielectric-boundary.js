$(window).on('load', function() {

    var dom = {
            intface: $("#interface"),
            loadSpinner: $("#loading-spinner"),
            polarisationSwitchInputs: $("#polarisation-switch input"),
            refractiveIndexInput: $("input#refractive-index"),
            refractiveIndexDisplay: $("#refractive-index-display"),
            angleInput: $("input#angle"),
            angleDisplay: $("#angle-display")
        },
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
                        range: [-1, 1], autorange: false, zeroline: true, showspikes: false
                    }
                },
                hovermode: false,
                font: {
                    family: "Fira Sans",
                    size: 14
                }
            },
            layoutFres: {
                width: 350,
                height: 320,
                xaxis: {
                    range: [0, 90],
                    title: "Angle"
                },
                yaxis: {
                   range: [-1, 2.1]
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
            dataFres: [],
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
            getFresPlotData: function() {
                return [this.dataFres[this.polarisation][this.refractiveIndexIndex][this.angleIndex]];
            },
            getCurvePlotData: function(){
                var plotData = this.dataFres.Curves[this.polarisation][this.refractiveIndexIndex].concat(
                    [this.dataFres[this.polarisation][this.refractiveIndexIndex][this.angleIndex]]);
                console.log(plotData);
                return plotData;
            }
        };

    $.when(
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_data3.JSON"),
        $.getJSON("https://rawgit.com/EdKeys/Imperial-Visualizations/master/fresnel_data.JSON")
    ).then(function(data, dataFres) { // i.e., function(JSON1, JSON2) {// success}, function() {// error}
        data = data[0];
        dataFres = dataFres[0];

        init(data, dataFres);

    }, showJSONLoadError);


    function init(data, dataFres) {
        phys.data = data;
        phys.dataFres = dataFres;

        endLoadingScreen();

        Plotly.plot(div='graph', deepCopy(phys.getPlotData()), layout=plt.layout);
        Plotly.newPlot(div='graph2', deepCopy(phys.getCurvePlotData()), layout=plt.layoutFres, {displayModeBar: false});

        dom.polarisationSwitchInputs.on("change", handlePolarisationSwitch);
        dom.refractiveIndexInput.on("input", handleRefractiveIndexSlider);
        dom.angleInput.on("input", handleAngleSlider);
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
        // Hide/show reflected ray depending on whether TIR:
        for (trace = plotData.length - 1; trace < plt.MaxTraceNo; trace++) {
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

        var update2 = {},
            plotData2 = phys.getCurvePlotData();
        for (var trace2 = 0; trace2 < plotData2.length - 1; trace2++) {
            update2[trace2] = {
                x: plotData2[trace2].x,
                y: plotData2[trace2].y,
                z: plotData2[trace2].z,
                opacity: 1
            };
        }
        Plotly.animate(div="graph2", {
            data: getObjValues(update2),
            traces: getObjKeysAsInts(update2),
            layout: {}
        }, {
            transition: {duration: 0},
            frame: {duration: 0, redraw: false}
        });
        Plotly.restyle(div="graph2", {
            x: [phys.dataFres[phys.polarisation][phys.refractiveIndexIndex][phys.angleIndex].x],
            y: [phys.dataFres[phys.polarisation][phys.refractiveIndexIndex][phys.angleIndex].y]
        }, [2]);
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
