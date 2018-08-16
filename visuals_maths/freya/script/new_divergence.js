var layout = {

    width: 450, height: 500,

    margin: {l:0, r:0, t:0, b:0},

    hovermode: "closest",

    showlegend: false,

    scene: {

        camera: createView([1,1,1]),

        xaxis: {range: [-2.8, 3.2], zeroline: true, autorange: false,},

        yaxis: {range: [-2.8, 3.2], zeroline: true, autorange: false,},

        zaxis: {range: [-2.8, 3.2], zeroline: true, autorange: false,},

        aspectratio: {x:1, y:1, z:1},

    }

};



var initialA = 0;

var isBlackText = false;

var blackTextType = "lines";


function cubeAndArrow(x,y,z,color,color1,innerArr1 = true,innerArr2 = true,innerArr3 = true,innerArr4 = true,innerArr5 = true,innerArr6 = true){

    Cubes = []
    cube = new Cube(x,y,z,0.5,0.5,0.5);
    Cubes.push(cube.gObject(color1, white , 0.8));

    if (innerArr1){
        if (x>0){
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
    }else{
        arr1 = new Line([[0,0,0],[0,0,0]]);
        arr11 = new Line([[0,0,0],[0,0,0]]);
        Cubes.push(arr1.gObject(color, 0));
        Cubes.push(arr11.arrowHead(color,0));
    }


    if (innerArr2){
        if (x<0){
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
    }else{
        arr2 = new Line([[0,0,0],[0,0,0]]);
        arr22 = new Line([[0,0,0],[0,0,0]]);
        Cubes.push(arr2.gObject(color, 0));
        Cubes.push(arr22.arrowHead(color,0));
    }

    if (innerArr3){
        if (y>0){
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
    }else{
        arr3 = new Line([[0,0,0],[0,0,0]]);
        arr33 = new Line([[0,0,0],[0,0,0]]);
        Cubes.push(arr3.gObject(color, 0));
        Cubes.push(arr33.arrowHead(color,0));
    }

    if (innerArr4){
        if (y<0){
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
    }else{
        arr4 = new Line([[0,0,0],[0,0,0]]);
        arr44 = new Line([[0,0,0],[0,0,0]]);
        Cubes.push(arr4.gObject(color, 0));
        Cubes.push(arr44.arrowHead(color,0));
    }

    if (innerArr5){
        if (z>0){
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
    }else{
        arr5 = new Line([[0,0,0],[0,0,0]]);
        arr55 = new Line([[0,0,0],[0,0,0]]);
        Cubes.push(arr5.gObject(color, 0));
        Cubes.push(arr55.arrowHead(color,0));
    }


    if (innerArr6){
        if (z<0){
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
    }else{
        arr6 = new Line([[0,0,0],[0,0,0]]);
        arr66 = new Line([[0,0,0],[0,0,0]]);
        Cubes.push(arr6.gObject(color, 0));
        Cubes.push(arr66.arrowHead(color,0));
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

function Surface3d(a1,b1,c1,a2,b2,c2,a3,b3,c3,a4,b4,c4){

    var edge1 = new Line([[a1,b1,c1],[a2,b2,c2]])
    var edge2 = new Line([[a2,b2,c2],[a3,b3,c3]])
    var edge3 = new Line([[a3,b3,c3],[a4,b4,c4]])
    var edge4 = new Line([[a4,b4,c4],[a1,b1,c1]])
    var square = [
    edge1.gObject(red,5),
    edge2.gObject(red,5),
    edge3.gObject(red,5),
    edge4.gObject(red,5),
    {
            type: "mesh3d",
            x: [a1,a2,a3,a4],
            y: [b1,b2,b3,b4],
            z: [c1,c2,c3,c4],
            i : [0, 0],
            j : [2, 3],
            k : [1, 2],
            opacity: 0.8,
            colorscale: [['0', impBlue], ['1', impBlue]],
            intensity: [0.8,0.8],
            showscale: false
    }
    ]
    return square;
}

function getCubes(){

    var sep = numeric.linspace(0,0.5,20)


    var frames = [];
    var Cube1 = new cubeAndArrow(0,0,0,black,green)
    var data = new blank(Cube1, 200)
    frames.push({data: data});



    for (var i =0; i<20; ++i){

        var Cube2 = new cubeAndArrow(1.5-sep[i],0,0,lilac,green)
        var Cube2 = Cube1.concat(Cube2)
        var data = new blank(Cube2, 200)
        frames.push({data: data});
    }


    var Cube11 = new cubeAndArrow(0,0,0,black,orange,true,false)
    var Cube22 = new cubeAndArrow(1,0,0,black,orange,false)
    var square = new Surface3d(0.51,-0.51,-0.51,0.51,0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51)
    var Cube22 = Cube11.concat(Cube22)
    var Cube22 = Cube22.concat(square)
    var data = new blank(Cube22, 200)
    frames.push({data: data});


    for (var i =0; i<20; ++i){
        var Cube3 = new cubeAndArrow(0,1.5-sep[i],0,lilac, green)
        var Cube3 = Cube22.concat(Cube3)
        var data = new blank(Cube3, 200)
        frames.push({data: data});
    }

    var Cube11 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false)
    var Cube22 = new cubeAndArrow(1,0,0,black,orange,false)
    var square = new Surface3d(0.51,-0.51,-0.51,0.51,0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51)
    var Cube22 = Cube11.concat(Cube22)
    var Cube22 = Cube22.concat(square)
    var Cube33 = new cubeAndArrow(0,1,0,black,orange,true,true,false)
    var square = new Surface3d(-0.51,0.51,0.51,0.51,0.51,0.51,0.51,0.51,-0.51,-0.51,0.51,-0.51)
    var Cube33 = Cube22.concat(Cube33)
    var Cube33 = Cube33.concat(square)
    var data = new blank(Cube33, 200)
    frames.push({data: data});

    for (var i =0; i<20; ++i){
        var Cube4 = new cubeAndArrow(1.5-sep[i],1.5-sep[i],0,lilac,green)
        var Cube4 = Cube33.concat(Cube4)
        var data = new blank(Cube4, 200)
        frames.push({data: data});
    }

    var Cube11 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false)
    var Cube22 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false)
    var square = new Surface3d(0.51,-0.51,-0.51,0.51,0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51)
    var Cube22 = Cube11.concat(Cube22)
    var Cube22 = Cube22.concat(square)
    var Cube33 = new cubeAndArrow(0,1,0,black,orange,true,false,false)
    var square = new Surface3d(-0.51,0.51,0.51,0.51,0.51,0.51,0.51,0.51,-0.51,-0.51,0.51,-0.51)
    var Cube33 = Cube22.concat(Cube33)
    var Cube33 = Cube33.concat(square)
    var Cube44 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,0.51,-0.51,0.51,0.51,-0.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,1.51,0.51,0.51,1.51,-0.51,0.51,0.51,-0.51)
    var Cube44 = Cube33.concat(Cube44)
    var Cube44 = Cube44.concat(square1)
    var Cube44 = Cube44.concat(square2)
    var data = new blank(Cube44, 200)
    frames.push({data: data});

    for (var i =0; i<20; ++i){
        var Cube5 = new cubeAndArrow(0,0,1.5-sep[i],lilac, green,white)
        var Cube5 = Cube44.concat(Cube5)
        var data = new blank(Cube5, 200)
        frames.push({data: data});
    }

    var Cube11 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
    var Cube22 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false)
    var square = new Surface3d(0.51,-0.51,-0.51,0.51,0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51)
    var Cube22 = Cube11.concat(Cube22)
    var Cube22 = Cube22.concat(square)
    var Cube33 = new cubeAndArrow(0,1,0,black,orange,true,false,false)
    var square = new Surface3d(-0.51,0.51,0.51,0.51,0.51,0.51,0.51,0.51,-0.51,-0.51,0.51,-0.51)
    var Cube33 = Cube22.concat(Cube33)
    var Cube33 = Cube33.concat(square)
    var Cube44 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,0.51,-0.51,0.51,0.51,-0.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,1.51,0.51,0.51,1.51,-0.51,0.51,0.51,-0.51)
    var Cube44 = Cube33.concat(Cube44)
    var Cube44 = Cube44.concat(square1)
    var Cube44 = Cube44.concat(square2)
    var Cube55 = new cubeAndArrow(0,0,1,black, orange,true,true,true,true,false)
    var square = new Surface3d(0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,-0.51,0.51)
    var Cube55 = Cube44.concat(Cube55)
    var Cube55 = Cube55.concat(square)
    var data = new blank(Cube55, 200)
    frames.push({data: data});


    for (var i =0; i<20; ++i){
        var Cube6 = new cubeAndArrow(1.5-sep[i],0,1.5-sep[i], lilac, green,white)
        var Cube6 = Cube55.concat(Cube6)
        var data = new blank(Cube6, 200)
        frames.push({data: data});
    }

    var Cube11 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
    var Cube22 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false,true,false)
    var square = new Surface3d(0.51,-0.51,-0.51,0.51,0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51)
    var Cube22 = Cube11.concat(Cube22)
    var Cube22 = Cube22.concat(square)
    var Cube33 = new cubeAndArrow(0,1,0,black,orange,true,false,false)
    var square = new Surface3d(-0.51,0.51,0.51,0.51,0.51,0.51,0.51,0.51,-0.51,-0.51,0.51,-0.51)
    var Cube33 = Cube22.concat(Cube33)
    var Cube33 = Cube33.concat(square)
    var Cube44 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,0.51,-0.51,0.51,0.51,-0.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,1.51,0.51,0.51,1.51,-0.51,0.51,0.51,-0.51)
    var Cube44 = Cube33.concat(Cube44)
    var Cube44 = Cube44.concat(square1)
    var Cube44 = Cube44.concat(square2)
    var Cube55 = new cubeAndArrow(0,0,1,black, orange,true,false,true,true,false)
    var square = new Surface3d(0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,-0.51,0.51)
    var Cube55 = Cube44.concat(Cube55)
    var Cube55 = Cube55.concat(square)
    var Cube66 = new cubeAndArrow(1,0,1,black,orange,false,true,true,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,1.51,0.51,0.51,1.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,-0.51,0.51,1.51,-0.51,0.51,1.51,0.51,0.51)
    var Cube66 = Cube55.concat(Cube66)
    var Cube66 = Cube66.concat(square1)
    var Cube66 = Cube66.concat(square2)
    var data = new blank(Cube66, 200)
    frames.push({data: data});


    for (var i =0; i<20; ++i){
        var Cube7 = new cubeAndArrow(0,1.5-sep[i],1.5-sep[i],lilac, green, white)
        var Cube7 = Cube66.concat(Cube7)
        var data = new blank(Cube7, 200)
        frames.push({data: data});
    }
    var Cube11 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
    var Cube22 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false,true,false)
    var square = new Surface3d(0.51,-0.51,-0.51,0.51,0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51)
    var Cube22 = Cube11.concat(Cube22)
    var Cube22 = Cube22.concat(square)
    var Cube33 = new cubeAndArrow(0,1,0,black,orange,true,false,false,true,true,false)
    var square = new Surface3d(-0.51,0.51,0.51,0.51,0.51,0.51,0.51,0.51,-0.51,-0.51,0.51,-0.51)
    var Cube33 = Cube22.concat(Cube33)
    var Cube33 = Cube33.concat(square)
    var Cube44 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,0.51,-0.51,0.51,0.51,-0.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,1.51,0.51,0.51,1.51,-0.51,0.51,0.51,-0.51)
    var Cube44 = Cube33.concat(Cube44)
    var Cube44 = Cube44.concat(square1)
    var Cube44 = Cube44.concat(square2)
    var Cube55 = new cubeAndArrow(0,0,1,black, orange,true,false,true,false,false)
    var square = new Surface3d(0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,-0.51,0.51)
    var Cube55 = Cube44.concat(Cube55)
    var Cube55 = Cube55.concat(square)
    var Cube66 = new cubeAndArrow(1,0,1,black,orange,false,true,true,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,1.51,0.51,0.51,1.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,-0.51,0.51,1.51,-0.51,0.51,1.51,0.51,0.51)
    var Cube66 = Cube55.concat(Cube66)
    var Cube66 = Cube66.concat(square1)
    var Cube66 = Cube66.concat(square2)
    var Cube77 = new cubeAndArrow(0,1,1,black,orange,true,true,false,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,0.51,1.51,0.51,0.51,1.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,1.51,0.51,-0.51,1.51,0.51,-0.51,0.51,0.51)
    var Cube77 = Cube66.concat(Cube77)
    var Cube77 = Cube77.concat(square1)
    var Cube77 = Cube77.concat(square2)
    var data = new blank(Cube77, 200)
    frames.push({data: data});


    for (var i =0; i<20; ++i){
        var Cube8 = new cubeAndArrow(1.5-sep[i],1.5-sep[i],1.5-sep[i],lilac, green, white)
        var Cube8 = Cube77.concat(Cube8)
        var data = new blank(Cube8, 200)
        frames.push({data: data});
    }
    var Cube11 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
    var Cube22 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false,true,false)
    var square = new Surface3d(0.51,-0.51,-0.51,0.51,0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51)
    var Cube22 = Cube11.concat(Cube22)
    var Cube22 = Cube22.concat(square)
    var Cube33 = new cubeAndArrow(0,1,0,black,orange,true,false,false,true,true,false)
    var square = new Surface3d(-0.51,0.51,0.51,0.51,0.51,0.51,0.51,0.51,-0.51,-0.51,0.51,-0.51)
    var Cube33 = Cube22.concat(Cube33)
    var Cube33 = Cube33.concat(square)
    var Cube44 = new cubeAndArrow(1,1,0,black,orange,false,true,false,true,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,0.51,-0.51,0.51,0.51,-0.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,1.51,0.51,0.51,1.51,-0.51,0.51,0.51,-0.51)
    var Cube44 = Cube33.concat(Cube44)
    var Cube44 = Cube44.concat(square1)
    var Cube44 = Cube44.concat(square2)
    var Cube55 = new cubeAndArrow(0,0,1,black, orange,true,false,true,false,false)
    var square = new Surface3d(0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,-0.51,0.51)
    var Cube55 = Cube44.concat(Cube55)
    var Cube55 = Cube55.concat(square)
    var Cube66 = new cubeAndArrow(1,0,1,black,orange,false,true,true,false,false)
    var square1 = new Surface3d(0.51,0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,1.51,0.51,0.51,1.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,-0.51,0.51,1.51,-0.51,0.51,1.51,0.51,0.51)
    var Cube66 = Cube55.concat(Cube66)
    var Cube66 = Cube66.concat(square1)
    var Cube66 = Cube66.concat(square2)
    var Cube77 = new cubeAndArrow(0,1,1,black,orange,true,false,false,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,0.51,1.51,0.51,0.51,1.51)
    var square2 = new Surface3d(0.51,0.51,0.51,0.51,1.51,0.51,-0.51,1.51,0.51,-0.51,0.51,0.51)
    var Cube77 = Cube66.concat(Cube77)
    var Cube77 = Cube77.concat(square1)
    var Cube77 = Cube77.concat(square2)
    var Cube88 = new cubeAndArrow(1,1,1,black,orange,false,true,false,true,false)
    var square1 = new Surface3d(0.51,0.51,0.51,0.51,0.51,1.51,0.51,1.51,1.51,0.51,1.51,0.51)
    var square2 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,1.51,0.51,0.51,1.51,0.51)
    var square3 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,0.51,1.51,0.51,0.51,1.51)
    var Cube88 = Cube77.concat(Cube88)
    var Cube88 = Cube88.concat(square1)
    var Cube88 = Cube88.concat(square2)
    var Cube88 = Cube88.concat(square3)
    var data = new blank(Cube88, 200)
    frames.push({data: data});


    var Cube9 = new Sphere(0.5,0.5,0.5,1.1)
    var Cube = Cube88.concat(Cube9)
    frames.push({data: Cube});
    initAnimation("animate", frames, [], layout,1);
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

    getCubes();

}
$(document).ready(main);
