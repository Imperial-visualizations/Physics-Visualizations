var layout = {

    width: 450, height: 500,

    margin: {l:0, r:0, t:0, b:0},

    hovermode: "closest",

    showlegend: false,

    scene: {

        camera: createView([1,1,1]),

        xaxis: {range: [-6, 6], zeroline: true, autorange: false,},

        yaxis: {range: [-6, 6], zeroline: true, autorange: false,},

        zaxis: {range: [-6, 6], zeroline: true, autorange: false,},

        aspectratio: {x:1, y:1, z:1},

    }

};



var initialA = 0;

var isBlackText = false;

var blackTextType = "lines";



function plotData() {



    Plotly.purge("graph");



    Plotly.newPlot("graph", getGrids(), layout);



    return;



}
function getGrids(){

    var Cubes =[];

    a = [-1.5,0,1.5];

    for (i=0; i<3; ++i){

        for (j=0; j<3; ++j){

            for (k=0; k<3; ++k){

                x=a[k];

                y=a[j];

                z=a[i];

                cube = new Cube(x,y,z,0.5);

                Cubes.push(cube.gObject(green,cyan,1));



                arr1 = new Line([[x-0.5,y,z],[x-1,y,z]]);

                arr11 = new Line([[x+0.5,y,z],[x-1,y,z]]);

                Cubes.push(arr1.gObject(black, 3));

                Cubes.push(arr11.arrowHead(black,3));



                arr2 = new Line([[x+0.5,y,z],[x+1,y,z]]);

                arr22 = new Line([[x-0.5,y,z],[x+1,y,z]]);

                Cubes.push(arr2.gObject(black, 3));

                Cubes.push(arr22.arrowHead(black,3));


                arr3 = new Line([[x,y-0.5,z],[x,y-1,z]]);

                arr33 = new Line([[x,y+0.5,z],[x,y-1,z]]);

                Cubes.push(arr3.gObject(black, 3));

                Cubes.push(arr33.arrowHead(black,3));


                arr4 = new Line([[x,y+0.5,z],[x,y+1,z]]);

                arr44 = new Line([[x,y-0.5,z],[x,y+1,z]]);

                Cubes.push(arr4.gObject(black, 3));

                Cubes.push(arr44.arrowHead(black,3));


                arr5 = new Line([[x,y,z-0.5],[x,y,z-1]]);

                arr55 = new Line([[x,y,z+0.5],[x,y,z-1]]);

                Cubes.push(arr5.gObject(black, 3));

                Cubes.push(arr55.arrowHead(black,3));


                arr6 = new Line([[x,y,z+0.5],[x,y,z+1]]);

                arr66 = new Line([[x,y,z-0.5],[x,y,z+1]]);

                Cubes.push(arr6.gObject(black, 3));

                Cubes.push(arr66.arrowHead(black,3));

             }

        }
    }
    bigcube = new Cube(0,0,0,2.1);
    Cubes.push(bigcube.gObject(orange,white,0.3))

    ar1 = new Line([[-2.1,0,0],[-4.1,0,0]]);

    ar11 = new Line([[2.1,0,0],[-4.1,0,0]]);

    Cubes.push(ar1.gObject(magenta, 7));

    Cubes.push(ar11.arrowHead(magenta,7));



    ar2 = new Line([[2.1,0,0],[4.1,0,0]]);

    ar22 = new Line([[-2.1,0,0],[4.1,0,0]]);

    Cubes.push(ar2.gObject(magenta, 7));

    Cubes.push(ar22.arrowHead(magenta,7));


    ar3 = new Line([[0,-2.1,0],[0,-4.1,0]]);

    ar33 = new Line([[0,2.1,z],[0,-4.1,0]]);

    Cubes.push(ar3.gObject(magenta, 7));

    Cubes.push(ar33.arrowHead(magenta,7));


    ar4 = new Line([[0,2.1,0],[0,4.1,0]]);

    ar44 = new Line([[0,-2.1,0],[0,4.1,0]]);

    Cubes.push(ar4.gObject(magenta, 7));

    Cubes.push(ar44.arrowHead(magenta,7));


    ar5 = new Line([[0,0,-2.1],[0,0,-4.1]]);

    ar55 = new Line([[0,0,2.1],[0,0,-4.1]]);

    Cubes.push(ar5.gObject(magenta, 7));

    Cubes.push(ar55.arrowHead(magenta,7));


    ar6 = new Line([[0,0,2.1],[0,0,4.1]]);

    ar66 = new Line([[0,0,-2.1],[0,0,4.1]]);

    Cubes.push(ar6.gObject(magenta, 7));

    Cubes.push(ar66.arrowHead(magenta,7));

    return Cubes
}

function main() {
    plotData();
}

$(document).ready(main);