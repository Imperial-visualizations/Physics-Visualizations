var layout = {

    width: 450, height: 500,

    margin: {l:0, r:0, t:0, b:0},

    hovermode: "closest",

    showlegend: false,

    scene: {

        camera: createView([1,1,1]),

        xaxis: {range: [-5, 5], zeroline: true, autorange: false,},

        yaxis: {range: [-5, 5], zeroline: true, autorange: false,},

        zaxis: {range: [-5, 5], zeroline: true, autorange: false,},

        aspectratio: {x:1, y:1, z:1},

    }

};



var initialA = 0;

var isBlackText = false;

var blackTextType = "lines";


function cubeAndArrow(x,y,z,color){

    Cubes = []
    cube = new Cube(x,y,z,0.5);
    Cubes.push(cube.gObject(green,green,1));


    if (x===1.5){
        arr1 = new Line([[x-0.5,y+0.2,z],[x-1,y+0.2,z]]);
        arr11 = new Line([[x+0.5,y+0.2,z],[x-1,y+0.2,z]]);
        Cubes.push(arr1.gObject(color, 3));
        Cubes.push(arr11.arrowHead(color,3));
    }else{
        arr1 = new Line([[x-0.5,y,z],[x-1,y,z]]);
        arr11 = new Line([[x+0.5,y,z],[x-1,y,z]]);
        Cubes.push(arr1.gObject(color, 3));
        Cubes.push(arr11.arrowHead(color,3));
    }

    if (x===-1.5){
        arr2 = new Line([[x+0.5,y+0.2,z],[x+1,y+0.2,z]]);
        arr22 = new Line([[x-0.5,y+0.2,z],[x+1,y+0.2,z]]);
        Cubes.push(arr2.gObject(color, 3));
        Cubes.push(arr22.arrowHead(color,3));
    }else{
        arr2 = new Line([[x+0.5,y,z],[x+1,y,z]]);
        arr22 = new Line([[x-0.5,y,z],[x+1,y,z]]);
        Cubes.push(arr2.gObject(color, 3));
        Cubes.push(arr22.arrowHead(color,3));
    }

    if (y===1.5){
        arr3 = new Line([[x,y-0.5,z+0.2],[x,y-1,z+0.2]]);
        arr33 = new Line([[x,y+0.5,z+0.2],[x,y-1,z+0.2]]);
        Cubes.push(arr3.gObject(color, 3));
        Cubes.push(arr33.arrowHead(color,3));
    }else{
        arr3 = new Line([[x,y-0.5,z],[x,y-1,z]]);
        arr33 = new Line([[x,y+0.5,z],[x,y-1,z]]);
        Cubes.push(arr3.gObject(color, 3));
        Cubes.push(arr33.arrowHead(color,3));
    }

    if (y===-1.5){
        arr4 = new Line([[x,y+0.5,z+0.2],[x,y+1,z+0.2]]);
        arr44 = new Line([[x,y-0.5,z+0.2],[x,y+1,z+0.2]]);
        Cubes.push(arr4.gObject(color, 3));
        Cubes.push(arr44.arrowHead(color,3));
    }else{
        arr4 = new Line([[x,y+0.5,z],[x,y+1,z]]);
        arr44 = new Line([[x,y-0.5,z],[x,y+1,z]]);
        Cubes.push(arr4.gObject(color, 3));
        Cubes.push(arr44.arrowHead(color,3));
    }

    if (z===1.5){
        arr5 = new Line([[x+0.2,y,z-0.5],[x+0.2,y,z-1]]);
        arr55 = new Line([[x+0.2,y,z+0.5],[x+0.2,y,z-1]]);
        Cubes.push(arr5.gObject(color, 3));
        Cubes.push(arr55.arrowHead(color,3));
    }else{
        arr5 = new Line([[x,y,z-0.5],[x,y,z-1]]);
        arr55 = new Line([[x,y,z+0.5],[x,y,z-1]]);
        Cubes.push(arr5.gObject(color, 3));
        Cubes.push(arr55.arrowHead(color,3));
    }
    if (z===-1.5){
        arr6 = new Line([[x+0.2,y,z+0.5],[x+0.2,y,z+1]]);
        arr66 = new Line([[x+0.2,y,z-0.5],[x+0.2,y,z+1]]);
        Cubes.push(arr6.gObject(color, 3));
        Cubes.push(arr66.arrowHead(color,3));
    }else{
        arr6 = new Line([[x,y,z+0.5],[x,y,z+1]]);
        arr66 = new Line([[x,y,z-0.5],[x,y,z+1]]);
        Cubes.push(arr6.gObject(color, 3));
        Cubes.push(arr66.arrowHead(color,3));
    }

    return Cubes;

}

function blank(data1, number){
    var data2 = []
    for (var i=0; i<number; ++i){
        data2.push({
            type: "scatter3d",
            mode: "lines",
            x:[0,0],
            y:[0,0],
            z:[0,0],
            lines: {width:0}
        })
    }
    data2 = data1.concat(data2)
    return data2;
}



function getCubes(frames){

    //var sep = numeric.linspace(0,0.5,20)


    var stops = [0]
    var Cube1 = new cubeAndArrow(0,0,0,black)
    var data = new blank(Cube1, 91)
    frames.push({data: data});
    stops.push(frames.length - 1);


    //for (var i =0; i<20; ++i){

    var Cube2 = new cubeAndArrow(1.5-sep[i],0,0,red)
    var Cube2 = Cube1.concat(Cube2)
    var data = new blank(Cube2, 78)
    frames.push({data: data});
    stops.push(frames.length - 1);





    var Cube3 = new cubeAndArrow(0,1.5,0,orange)
    var Cube3 = Cube2.concat(Cube3)
    var data = new blank(Cube3, 65)
    frames.push({data: data});
    stops.push(frames.length - 1);


    var Cube4 = new cubeAndArrow(0,0,1.5,lilac)
    var Cube4 = Cube3.concat(Cube4)
    var data = new blank(Cube4, 52)
    frames.push({data: data});
    stops.push(frames.length - 1);


    var Cube5 = new cubeAndArrow(-1.5,0,0,red)
    var Cube5 = Cube4.concat(Cube5)
    var data = new blank(Cube5, 39)
    frames.push({data: data});
    stops.push(frames.length - 1);


    var Cube6 = new cubeAndArrow(0,-1.5,0,orange)
    var Cube6 = Cube5.concat(Cube6)
    var data = new blank(Cube6, 26)
    frames.push({data: data});
    stops.push(frames.length - 1);


    var Cube7 = new cubeAndArrow(0,0,-1.5,lilac)
    var Cube7 = Cube6.concat(Cube7)
    var data = new blank(Cube7, 13)
    frames.push({data: data});
    stops.push(frames.length - 1);

    var sphere = new Sphere(3.5)
    var sphere = Cube7.concat(sphere)
    frames.push({data: sphere});
    stops.push(frames.length - 1);


    return stops
}

function initPlot(){
    Plotly.purge("graph");
    var frames = []
    stops = getCubes(frames)


    initAnimation("animate", frames, [], layout, 10, stops, true);
    return;
}


function main() {


    $("input[type=submit]").click(function () {
        var idName = $(this).attr("id");
        console.log("animating")
        startAnimation();
    });

    $("input[type=button]").click(function () {
        var idName = $(this).attr("id");
        initPlot();
        console.log("button")
    });

    initPlot();

}
$(document).ready(main);
