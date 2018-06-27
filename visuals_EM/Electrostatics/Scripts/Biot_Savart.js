$(window).on('load', function() {
    /** Define dom shorthands for key html elements */
    var dom = {
        intface: $("#interface"),
        loadSpinner: $("#loading-spinner"),
        animationInput: $("input#animation"),
        animationDisplay: $("#animation-display"),
        positionInput: $("input#position"),
        positionDisplay: $("#position-display"),
        },
        /** Create initial layout of plotly plot */
        plt = {
            MaxTraceNo: 12,
            layout: {
                autosize: true,
                  legend: {
                    x: 0,
                      y: 1
                },
                margin: {
                    l: 0, r: 0, b: 0, t: 1, pad: 5
                },
                scene: {
                    aspectmode: "cube",
                    xaxis: {
                        range: [-1, 1], autorange: false, zeroline: true, showspikes: false,dtick: 0.5,
                    },
                    yaxis: {
                        range: [-1, 1], autorange: false, zeroline: true, showspikes: false,dtick: 0.5,
                    },
                    zaxis: {
                        range: [-0.5, 1.5], autorange: false, zeroline: true, showspikes: false,dtick: 0.5,
                    }
                },
                hovermode: false,
                font: {
                    family: "Fira Sans",
                    size: 14
                }
            },
        },
        /** Phys is a ish-class that stores and updates the js animation position and data variables */
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
                return this.data.Position[this.position].Animation[this.animation];
            },
        };


    /** import JSON and define an onload function  */
    $.when(
        $.getJSON("https://rawgit.com/cydcowley/public-test-data/master/BiotData.json"),
    ).then(function(data) { // i.e., function(JSON1, JSON2) {// success}, function() {// error}
        data = JSON.parse(data);
        init(data);
    }, showJSONLoadError);


    //define function to plot the initial static graph
    function init(data) {
        phys.data = data;
        endLoadingScreen();
        traces = [];
        linewidth = 5;
        colors = ["#1A40B1","#E47F1A","#2E9849","#D81C1C"]

        traces.push({type: "scatter3d",mode: "lines",name: "dI", line: {width: linewidth,color:colors[0]},x: deepCopy(phys.getPlotData())[0].x,
            y:deepCopy(phys.getPlotData())[0].y,z:deepCopy(phys.getPlotData())[0].z,})
        traces.push({type: "scatter3d",mode: "lines",name: "dB", line: {width: linewidth,color:colors[1]},x: deepCopy(phys.getPlotData())[1].x,
            y:deepCopy(phys.getPlotData())[1].y,z:deepCopy(phys.getPlotData())[1].z})
        traces.push({type: "scatter3d",mode: "lines",name: "r", line: {width: linewidth,color:colors[2]},x: deepCopy(phys.getPlotData())[2].x,
            y:deepCopy(phys.getPlotData())[2].y,z:deepCopy(phys.getPlotData())[2].z})
        traces.push({type: "scatter3d",mode: "lines",name: "B", line: {width: linewidth,color: colors[3]},x: deepCopy(phys.getPlotData())[3].x,
            y:deepCopy(phys.getPlotData())[3].y,z:deepCopy(phys.getPlotData())[3].z})
        traces.push({type: "scatter3d",mode: "lines",name: "Circle", line: {width: 10},x: deepCopy(phys.getPlotData())[4].x,
            y:deepCopy(phys.getPlotData())[4].y,z:deepCopy(phys.getPlotData())[4].z})

        //Create arrowheads for each necessary trace
        for (let i = 0; i < 4; i++) {
            [x,y,z,u,v,w] = make_arrows(deepCopy(phys.getPlotData())[i].x,deepCopy(phys.getPlotData())[i].y,deepCopy(phys.getPlotData())[i].z)
            traces.push({type: "cone",colorscale: [[0, colors[i]], [1, colors[i]]],x:[x],y:[y],z:[z],u:[u],v:[v],w:[w],sizemode: "absolute",sizeref :0.125,showscale: false})
        }
        Plotly.plot(div='graph', traces, layout=plt.layout);
        dom.animationInput.on("input", handleAnimationSlider);
        dom.positionInput.on("input", handlePositionSlider);
    }

    function make_arrows(pointsx,pointsy,pointsz){
        /** Returns an arrowhead based on an inputed line */
        var x = pointsx[1],
            y = pointsy[1],
            z = pointsz[[1]],
            u = 0.5*(pointsx[1]-pointsx[0]),
            v = 0.5*(pointsy[1]-pointsy[0]),
            w =0.5*(pointsz[1]-pointsz[0]);
        return[x,y,z,u,v,w]
    }

    function handlePositionSlider() {
        /** Updates plotly plot with new position */
        phys.setPosition(
            input2index($(this), phys.data.Position)
        );
        updatePlot();
        dom.positionDisplay.html(
            roundInput($(this), phys.data.Position)
        );
    }

    function handleAnimationSlider() {
        /** Updates plotly plot with new animation frame*/
        phys.setAnimation(
            input2index($(this), phys.data.Position[phys.position].Animation)
        );
        updatePlot();
        dom.animationDisplay.text(
            roundInput($(this), phys.data.Position[phys.position].Animation));
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
            for (let j = 5; j <9; j++) {
                var [x,y,z,u,v,w]=make_arrows(plotData[j-5].x,plotData[j-5].y,plotData[j-5].z)
                update[j]={
                    x: [x], y: [y], z: [z],
                u: [u], v: [v], w: [w],
                }
            }
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
