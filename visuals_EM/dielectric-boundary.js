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
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_data2.JSON"),
        $.getJSON("https://rawgit.com/binaryfunt/Imperial-Visualizations/master/dielectric_boundary_layout.JSON")
    ).then(function(data, layout) { // i.e., function(JSON1, JSON2) {// success}, function() {// error}
        data = data[0];
        layout = layout[0];

        init(data, layout);

        dom.polarisationSwitchInputs.on("change", handlePolarisationSwitch);
        dom.refractiveIndexInput.on("input", handleRefractiveIndexSlider);
        dom.angleInput.on("input", handleAngleSlider);

    }, showJSONLoadError);


    function init(data, layout) {
        console.log(data);
        phys.data = data;

        //updateSliderSteps(data); // NOTE Don't do this, just choose everything in advance
        endLoadingScreen();

        Plotly.plot(div='graph', phys.getPlotData(), layout=layout);
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
            arrayLen = array.length;
        return Math.round((inputValue / maxInput) * (arrayLen - 1));
    }


    function updatePlot() {
        var updateData = {};
        for (var trace = 0; trace < phys.getPlotData().length - 1; trace++) {
            updateData[trace] = {
                x: phys.getPlotData()[trace].x,
                y: phys.getPlotData()[trace].y,
                z: phys.getPlotData()[trace].z,
                opacity: 1
            };
        }
        for (var trace = phys.getPlotData().length - 1; trace < plt.MaxTraceNo; trace++) {
            updateData[trace] = {
                opacity: 0
            };
        }
        Plotly.animate(div="graph", {
            data: getObjValues(updateData),
            traces: getObjKeysAsInts(updateData),
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

});
