//Initial contant declerations
const width = 500;
const height = 500;
const marT = 30, marB = 23, marR = 5, marL = 35;
const RED = '#DD2501';
const IMPERIAL_BLUE = '#003E74';
const CHERRY = "#E40043";
let init_VibKE = 0;
let init_RotKE = 0;

const options = {
    scrollZoom: false, // lets us scroll to zoom in and out - works
    showLink: false, // removes the link to edit on plotly - works
    modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d',
        'autoScale2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian'],
    //modeBarButtonsToAdd: ['lasso2d'],
    displayLogo: true, // this one also seems to not work
    displayModeBar: true //this one does work
};

//Get's p5js working as soon as page is ready -> no point in loading before this
$(document).ready(function () {
    $('#KE_slider').val("0");
    $('#RE_slider').val("0");
    let p5js = new p5(visualisation);
});

const visualisation = function (p) {
    let running = false;

    $('#KE_slider').on('change', function () {
        init_VibKE = parseFloat($('#KE_slider').val());
        reset();
    });
    $('#RE_slider').on('change', function () {
        init_RotKE = parseFloat($('#RE_slider').val());
        reset();
    });

    $('#playPauseButton').on('click', function () {
        running = !running;
        $('#KE_slider').prop('disabled', running);
        $('#RE_slider').prop('disabled', running);
        $(this).text((running) ? 'Pause' : 'Play');
    });
    $('#resetButton').on('click', function () {
        running = false;
        $('#playPauseButton').text("Play");
        $('#KE_slider').prop('disabled', false);
        $('#RE_slider').prop('disabled', false);
        reset();
    });

    class Atom {
        constructor(position, color, mass) {
            this.position = position;
            this.mass = mass;
            this.color = color;
            this.radius = 25 * mass ** 0.5;
        }

        draw() {
            p.fill(this.color);
            p.ellipse(this.position.x + width / 2, this.position.y + height / 2, this.radius);
        }

    }

    class LJPotential {
        constructor(sigma_1, epsilon_1, sigma_2, epsilon_2) {
            this.s = (sigma_2 + sigma_1) / 2;
            this.e = Math.sqrt(epsilon_1 * epsilon_2);
        }

        calcV(r) {
            let repulsive = Math.pow(this.s / r, 12);
            let attractive = -1 * Math.pow(this.s / r, 6);
            return 4 * this.e * (repulsive + attractive);
        }

        calcCorrV(r, L, mu) {
            return (this.calcV(r) + Math.pow(L / r, 2) / (2 * mu));
        }

        calcF(r) {
            let repulsive = 12 * Math.pow(this.s / r, 12);
            let attractive = -6 * Math.pow(this.s / r, 6);
            return 4 * this.e * (repulsive + attractive) / r;
        }

        getR_0() {
            return Math.pow(2, 1 / 6) * this.s;
        }

        plotLJ(ppu) {//ppu - Point per Unit
            let r = [];
            let v = [];
            for (let i = 1; i < Math.ceil(this.s * 3 * ppu); i++) {
                r.push(i / ppu);
                v.push(this.calcV(i / ppu));
            }
            return {
                x: r, y: v, name: "V" + "LJ".sub() + "(r)", mode: "lines",
                line: {width: this.e / 10, opacity: 0.6, color: CHERRY}
            };
        }

        plotCorrLJ(ppu, L, mu) {
            let r = [];
            let v = [];
            for (let i = 1; i < Math.ceil(this.s * 3 * ppu); i++) {
                r.push(i / ppu);
                v.push(this.calcCorrV(i / ppu, L, mu));
            }
            return {
                x: r, y: v, name: "V" + "Corr".sub() + "(r)", mode: "lines",
                line: {width: this.e / 10, opacity: 0.6, color: '#000000'}
            }
        }

    }

    function drawBond(a, b) {
        p.strokeWeight(5);
        p.stroke(0);
        p.line(a.position.x + width / 2, a.position.y + height / 2, b.position.x + width / 2, b.position.y + height / 2);
        p.strokeWeight(0);
    }

    let totEPlot, EP_to_LJ, currLJ, currEP;

    let atoms = [new Atom(p.createVector(width / 5, 0), RED, 1), new Atom(p.createVector(-width / 5, 0), IMPERIAL_BLUE, 1)];
    let potential = new LJPotential(2, 10, 2, 10);
    let reducedMass = atoms[0].mass * atoms[1].mass / (atoms[0].mass + atoms[1].mass);
    let momentOfInertia = reducedMass * Math.pow(potential.getR_0(), 2);
    let r = 2 / 5 * width;
    let rDot = 0;
    let omega = 0;
    let omegaDot = 0;
    let L = 0;

    function init_pos_r(resolution, L, mu) {
        let min = [0, Number.MAX_VALUE];
        for (let i = Math.floor(0.75 * potential.getR_0() / resolution); i < Math.ceil(1.25 * potential.getR_0() / resolution); i++) {
            let potVal = potential.calcV(i * resolution) + Math.pow(L / (i * resolution), 2) / (2 * mu);
            if (min[1] > potVal) min = [i * resolution, potVal];
        }
        return min[0];
    }


    let totalE, PE, effPE, scatterEP, scatterLJ;

    function reset() {


        momentOfInertia = reducedMass * Math.pow(potential.getR_0(), 2);
        L = Math.sqrt(2 * momentOfInertia * init_RotKE);
        omega = 0;
        omegaDot = (2 * init_RotKE / momentOfInertia) ** 0.5;

        r = init_pos_r(0.001, L, reducedMass);
        atoms[0].position = p.createVector(60 * (atoms[0].mass / reducedMass) * r / 2, 0);
        atoms[1].position = p.createVector(-60 * (atoms[1].mass / reducedMass) * r / 2, 0);

        console.log(r);
        rDot = (2 * init_VibKE / reducedMass) ** 0.5;
        PE = potential.calcV(r);

        effPE = potential.calcCorrV(r, L, reducedMass);
        totalE = init_VibKE + effPE;

        scatterLJ = potential.plotLJ(30);
        scatterEP = potential.plotCorrLJ(30, L, reducedMass);
        console.log(scatterEP);
        plotLJ(scatterLJ, scatterEP);
    }

    function plotLJ(scatterLJ, scatterEP) {
        LJ_layout = {
            title: "Lennard-Jones Potential", titlefont: {size: 12},
            margin: {l: marL, r: marR, b: marB + 10, t: marT}, legend: {x: 0.46, y: 1, "orientation": "h"},
            showlegend: true,
            yaxis: {
                range: [-1.1 * potential.e, 0.7 * potential.e],
                nticks: 20, title: "U / eV", titlefont: {size: 10}
            },
            xaxis: {
                range: [0.9 * potential.s, 3 * potential.s],
                nticks: 20, title: "r" + "AB".sub() + " / nm", titlefont: {size: 10}
            }
        };

        // Remove all points outside visible range on graph.
        while (scatterLJ.y[0] > LJ_layout.yaxis.range[1]) {
            scatterLJ.x.shift();
            scatterLJ.y.shift();
            scatterEP.x.shift();
            scatterEP.y.shift();
        }

        LJ_layout.yaxis.range[1] = scatterEP.y[0];     // Re-optimising y-axis scaling.

        // Drawing red marker that shows current LJ potential against current separation.

        totEPlot = {
            x: [LJ_layout.xaxis.range[0] - 1, LJ_layout.xaxis.range[1] + 1], y: [totalE, totalE],
            name: "E" + "tot".sub(), mode: "lines", line: {dash: "1px, 2px", width: 2}
        };
        EP_to_LJ = {
            x: [r, r], y: [PE, Math.max(0, effPE)], mode: "lines",
            line: {dash: "1px, 2px", width: 2}, showlegend: false
        };
        currLJ = {
            x: [r], y: [PE], name: "U" + "LJ, curr".sub(), mode: "markers",
            marker: {size: 10, color: CHERRY, symbol: "x"}, showlegend: false
        };
        currEP = {
            x: [r], y: [effPE], name: "EP", mode: "markers",
            marker: {size: 10, color: "#ff9030", symbol: "x"}, showlegend: false
        };

        let data = [scatterLJ, scatterEP, currLJ, currEP, totEPlot, EP_to_LJ];
        Plotly.newPlot("potentialGraph", data, LJ_layout, options);
    }

    //Function called once on page load
    p.setup = function () {
        let canvas = p.createCanvas(500, 500);
        p.frameRate(60);
        canvas.parent('animation_anchor');
        p.strokeWeight(0);
        reset();
    };

    function update_atoms(r, omega) {

        atoms[0].position = p.createVector(60 * r * (atoms[0].mass / reducedMass) / 2 * Math.cos(omega), 60 * r * (atoms[0].mass / reducedMass) / 2 * Math.sin(omega));
        atoms[1].position = p.createVector(-60 * r * (atoms[1].mass / reducedMass) / 2 * Math.cos(omega), -60 * r * (atoms[1].mass / reducedMass) / 2 * Math.sin(omega));
    }

    function updatePotentials() {
        PE = potential.calcV(r);
        effPE = potential.calcCorrV(r, L, reducedMass);
    }

    //Function called each page redraw
    p.draw = function () {
        p.clear();
        p.background(255);
        if (running) {
            //Calc r
            momentOfInertia = reducedMass * Math.pow(r, 2);
            omegaDot = L / momentOfInertia;
            omega += omegaDot / 60;
            omega = (omega > 2 * p.PI) ? omega - 2 * p.PI : omega;

            console.log(potential.calcF(r) / reducedMass + " ," + r * Math.pow(omegaDot, 2));
            let a = (potential.calcF(r) / (reducedMass) + Math.pow(omegaDot, 2) * r);
            rDot += a / 60;
            r += rDot / 60;

            update_atoms(r, omega);

            //Update Graphs
            // Updating current LJ r and V(r) and LJ_corr(r).

            updatePotentials();

            currLJ.x = [r];
            currLJ.y = [PE];
            currEP.x = [r];
            currEP.y = [effPE];

            EP_to_LJ.x = [r, r];
            EP_to_LJ.y = [PE, Math.max(0, effPE)];

            // Plotting the LJ and stuff.
            Plotly.animate("potentialGraph",
                {
                    data: [scatterLJ, scatterEP, currLJ, currEP, totEPlot, EP_to_LJ],
                    traces: [0, 1, 2, 3, 4, 5]
                },
                {frame: {redraw: false, duration: 0}, transition: {duration: 0}});
        }
        drawBond(atoms[0], atoms[1]);
        for (let i = 0; i < atoms.length; i++) {
            atoms[i].draw();
        }
    }

};
