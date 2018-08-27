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


var isBlackText = false;

var blackTextType = "lines";



//create small cubes with arrow pointing out on each side.
//by defining the position of the cube, the position of the arrows are set such that the arrows on two neighbour side of two cubes won't overlap each other
//by set innerArr = fault, the arrow can be removed


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




//create a blank object to added in frames so that some frames won't be shorter than the others
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

//represents a 3d square with each side being highlighted
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




//creating frames for the animation
function getCubes(frames){
    //create stops for the animation
    var stops = [0];
    var sep = numeric.linspace(0,0.5,20)


    //first frame -- a big cube with six arrows
    var bigCube = new outerCube(0.5,0.5,0.5,1)
    var data = new blank(bigCube, 200)
    frames.push({data: data});

    //second stage -- cutting the big cube to 8 same sized cubes
    for (var i = 0; i < 20; ++i){
        var Cube1 = new cubeAndArrow(0,0,0,black,green)
        var Cube2 = new cubeAndArrow(1+sep[i],0,0,black,green)
        var Cube2 = Cube1.concat(Cube2)
        var Cube3 = new cubeAndArrow(0,1+sep[i],0,black, green)
        var Cube3 = Cube2.concat(Cube3)
        var Cube4 = new cubeAndArrow(1+sep[i],1+sep[i],0,black,green)
        var Cube4 = Cube3.concat(Cube4)
        var Cube5 = new cubeAndArrow(0,0,1+sep[i],black, green)
        var Cube5 = Cube4.concat(Cube5)
        var Cube6 = new cubeAndArrow(1+sep[i],0,1+sep[i], black, green)
        var Cube6 = Cube5.concat(Cube6)
        var Cube7 = new cubeAndArrow(0,1+sep[i],1+sep[i], black, green)
        var Cube7 = Cube6.concat(Cube7)
        var Cube8 = new cubeAndArrow(1+sep[i],1+sep[i],1+sep[i],black, green)
        var Cube8 = Cube7.concat(Cube8)
        var data = new blank(Cube8, 200)
        frames.push({data: data});
    }
    //make the animation stops itself after the second stage
    stops.push(frames.length - 1);

    //third stage -- starting from one small cube, adding one small cube each time, highlight the interface
    //make the arrows in between disappear and make the resulting cube change color


    //one cube
    var Cube1 = new cubeAndArrow(0,0,0,black,green)
    var data = new blank(Cube1, 164)
    frames.push({data: data});


    //two cubes
    for (var i =0; i<22; ++i){
        if (i < 19){
            var Cube2 = new cubeAndArrow(1.5-sep[i],0,0,lilac,green)
            var Cube2 = Cube1.concat(Cube2)
            var data = new blank(Cube2, 151)
            frames.push({data: data});
        }else{
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false)
            var Cube22 = new cubeAndArrow(1,0,0,black,orange,false)
            var square = new Surface3d(0.51,-0.51,-0.51,0.51,0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51)
            var Cube22 = Cube1.concat(Cube22)
            var Cube22 = Cube22.concat(square)
            var data = new blank(Cube22, 146)
            frames.push({data: data});
        }
    }

    //three cubes
    for (var i =0; i<22; ++i){
        if (i < 19){
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false)
            var Cube22 = new cubeAndArrow(1,0,0,black,orange,false)
            var Cube22 = Cube1.concat(Cube22)
            var Cube3 = new cubeAndArrow(0,1.5-sep[i],0,lilac, green)
            var Cube3 = Cube22.concat(Cube3)
            var data = new blank(Cube3, 133)
            frames.push({data: data});
        } else{
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube33= new cubeAndArrow(0,1,0,black,orange,true,true,false)
            var square = new Surface3d(-0.51,0.51,0.51,0.51,0.51,0.51,0.51,0.51,-0.51,-0.51,0.51,-0.51)
            var Cube33 = Cube2.concat(Cube33)
            var Cube33 = Cube33.concat(square)
            var data = new blank(Cube33, 128)
            frames.push({data: data});
        }

    }

    //four cubes
    for (var i =0; i<22; ++i){
        if (i < 19){
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube33= new cubeAndArrow(0,1,0,black,orange,true,true,false)
            var Cube33 = Cube2.concat(Cube33)
            var Cube4 = new cubeAndArrow(1.5-sep[i],1.5-sep[i],0,lilac,green)
            var Cube4 = Cube33.concat(Cube4)
            var data = new blank(Cube4, 115)
            frames.push({data: data});
        }else{
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false)
            var Cube3 = Cube2.concat(Cube3)
            var Cube44 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
            var square1 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,0.51,-0.51,0.51,0.51,-0.51)
            var square2 = new Surface3d(0.51,0.51,0.51,0.51,1.51,0.51,0.51,1.51,-0.51,0.51,0.51,-0.51)
            var Cube44 = Cube3.concat(Cube44)
            var Cube44 = Cube44.concat(square1)
            var Cube44 = Cube44.concat(square2)
            var data = new blank(Cube44, 105)
            frames.push({data: data});
        }
    }


    //five cubes
    for (var i =0; i<22; ++i){
        if (i<19){
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false)
            var Cube3 = Cube2.concat(Cube3)
            var Cube44 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
            var Cube44 = Cube3.concat(Cube44)
            var Cube5 = new cubeAndArrow(0,0,1.5-sep[i],lilac, green)
            var Cube5 = Cube44.concat(Cube5)
            var data = new blank(Cube5, 92)
            frames.push({data: data});
        }else{
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false)
            var Cube3 = Cube2.concat(Cube3)
            var Cube4 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
            var Cube4 = Cube3.concat(Cube4)
            var Cube55 = new cubeAndArrow(0,0,1,black, orange,true,true,true,true,false)
            var square = new Surface3d(0.51,-0.51,0.51,0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,-0.51,0.51)
            var Cube55 = Cube4.concat(Cube55)
            var Cube55= Cube55.concat(square)
            var data = new blank(Cube55, 87)
            frames.push({data: data});
        }

    }


    //six cubes
    for (var i =0; i<22; ++i){
        if (i<19){
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false)
            var Cube3 = Cube2.concat(Cube3)
            var Cube4 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
            var Cube4 = Cube3.concat(Cube4)
            var Cube55 = new cubeAndArrow(0,0,1,black, orange,true,true,true,true,false)
            var Cube55 = Cube4.concat(Cube55)
            var Cube6 = new cubeAndArrow(1.5-sep[i],0,1.5-sep[i], lilac, green)
            var Cube6 = Cube55.concat(Cube6)
            var data = new blank(Cube6, 74)
            frames.push({data: data});
        }else{
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false,true,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false)
            var Cube3 = Cube2.concat(Cube3)
            var Cube4 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
            var Cube4 = Cube3.concat(Cube4)
            var Cube5 = new cubeAndArrow(0,0,1,black, orange,true,false,true,true,false)
            var Cube5 = Cube4.concat(Cube5)
            var Cube66 = new cubeAndArrow(1,0,1,black,orange,false,true,true,true,false)
            var square1 = new Surface3d(0.51,0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,1.51,0.51,0.51,1.51)
            var square2 = new Surface3d(0.51,0.51,0.51,0.51,-0.51,0.51,1.51,-0.51,0.51,1.51,0.51,0.51)
            var Cube66 = Cube5.concat(Cube66)
            var Cube66 = Cube66.concat(square1)
            var Cube66 = Cube66.concat(square2)
            var data = new blank(Cube66, 64)
            frames.push({data: data});
        }

    }


    //seven cubes
    for (var i =0; i<22; ++i){
        if(i<19){
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false,true,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false)
            var Cube3 = Cube2.concat(Cube3)
            var Cube4 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
            var Cube4 = Cube3.concat(Cube4)
            var Cube5 = new cubeAndArrow(0,0,1,black, orange,true,false,true,true,false)
            var Cube5 = Cube4.concat(Cube5)
            var Cube66 = new cubeAndArrow(1,0,1,black,orange,false,true,true,true,false)
            var Cube66 = Cube5.concat(Cube66)
            var Cube7 = new cubeAndArrow(0,1.5-sep[i],1.5-sep[i],lilac, green)
            var Cube7 = Cube66.concat(Cube7)
            var data = new blank(Cube7, 51)
            frames.push({data: data});
        }else{
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false,true,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false,true,true,false)
            var Cube3 = Cube2.concat(Cube3)
            var Cube4 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
            var Cube4 = Cube3.concat(Cube4)
            var Cube5 = new cubeAndArrow(0,0,1,black, orange,true,false,true,false,false)
            var Cube5 = Cube4.concat(Cube5)
            var Cube6 = new cubeAndArrow(1,0,1,black,orange,false,true,true,true,false)
            var Cube6 = Cube5.concat(Cube6)
            var Cube77 = new cubeAndArrow(0,1,1,black,orange,true,true,false,true,false)
            var square1 = new Surface3d(0.51,0.51,0.51,-0.51,0.51,0.51,-0.51,0.51,1.51,0.51,0.51,1.51)
            var square2 = new Surface3d(0.51,0.51,0.51,0.51,1.51,0.51,-0.51,1.51,0.51,-0.51,0.51,0.51)
            var Cube77 = Cube6.concat(Cube77)
            var Cube77 = Cube77.concat(square1)
            var Cube77 = Cube77.concat(square2)
            var data = new blank(Cube77, 41)
            frames.push({data: data});
        }
    }


    //eight cubes
    for (var i =0; i<22; ++i){
        if (i<19){
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false,true,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false,true,true,false)
            var Cube3 = Cube2.concat(Cube3)
            var Cube4 = new cubeAndArrow(1,1,0,black,orange,false,true,false)
            var Cube4 = Cube3.concat(Cube4)
            var Cube5 = new cubeAndArrow(0,0,1,black, orange,true,false,true,false,false)
            var Cube5 = Cube4.concat(Cube5)
            var Cube6 = new cubeAndArrow(1,0,1,black,orange,false,true,true,true,false)
            var Cube6 = Cube5.concat(Cube6)
            var Cube77 = new cubeAndArrow(0,1,1,black,orange,true,true,false,true,false)
            var Cube77 = Cube6.concat(Cube77)
            var Cube8 = new cubeAndArrow(1.5-sep[i],1.5-sep[i],1.5-sep[i],lilac, green)
            var Cube8 = Cube77.concat(Cube8)
            var data = new blank(Cube8, 28)
            frames.push({data: data});
        }else{
            var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
            var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false,true,false)
            var Cube2 = Cube1.concat(Cube2)
            var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false,true,true,false)
            var Cube3 = Cube2.concat(Cube3)
            var Cube4 = new cubeAndArrow(1,1,0,black,orange,false,true,false,true,true,false)
            var Cube4 = Cube3.concat(Cube4)
            var Cube5 = new cubeAndArrow(0,0,1,black, orange,true,false,true,false,false)
            var Cube5 = Cube4.concat(Cube5)
            var Cube6 = new cubeAndArrow(1,0,1,black,orange,false,true,true,false,false)
            var Cube6 = Cube5.concat(Cube6)
            var Cube7 = new cubeAndArrow(0,1,1,black,orange,true,false,false,true,false)
            var Cube7 = Cube6.concat(Cube7)
            var Cube88 = new cubeAndArrow(1,1,1,black,orange,false,true,false,true,false)
            var square1 = new Surface3d(0.51,0.51,0.51,0.51,0.51,1.51,0.51,1.51,1.51,0.51,1.51,0.51)
            var square2 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,1.51,0.51,0.51,1.51,0.51)
            var square3 = new Surface3d(0.51,0.51,0.51,1.51,0.51,0.51,1.51,0.51,1.51,0.51,0.51,1.51)
            var Cube88 = Cube7.concat(Cube88)
            var Cube88 = Cube88.concat(square1)
            var Cube88 = Cube88.concat(square2)
            var Cube88 = Cube88.concat(square3)
            var data = new blank(Cube88, 30)
            frames.push({data: data});
        }
    }


    //fourth stage -- after adding all eight cubes back, add the big cube on the outside
    var Cube1 = new cubeAndArrow(0,0,0,black,orange,true,false,true,false,true,false)
    var Cube2 = new cubeAndArrow(1,0,0,black,orange,false,true,true,false,true,false)
    var Cube2 = Cube1.concat(Cube2)
    var Cube3 = new cubeAndArrow(0,1,0,black,orange,true,false,false,true,true,false)
    var Cube3 = Cube2.concat(Cube3)
    var Cube4 = new cubeAndArrow(1,1,0,black,orange,false,true,false,true,true,false)
    var Cube4 = Cube3.concat(Cube4)
    var Cube5 = new cubeAndArrow(0,0,1,black, orange,true,false,true,false,false)
    var Cube5 = Cube4.concat(Cube5)
    var Cube6 = new cubeAndArrow(1,0,1,black,orange,false,true,true,false,false)
    var Cube6 = Cube5.concat(Cube6)
    var Cube7 = new cubeAndArrow(0,1,1,black,orange,true,false,false,true,false)
    var Cube7 = Cube6.concat(Cube7)
    var Cube8 = new cubeAndArrow(1,1,1,black,orange,false,true,false,true,false)
    var Cube8 = Cube7.concat(Cube8)
    var Cube9 = new outerCube(0.5,0.5,0.5,1)
    var Cube9 = Cube9.concat(Cube8)
    var data = new blank(Cube9, 100)
    frames.push({data: data});

    //return the array that represents stops
    return stops
}

//plots
function initPlot(){
    Plotly.purge("graph");
    var frames = [],

    //load frames and stops
    stops = getCubes(frames);

    //the slider for each frame
    $("#animateSlider").attr("max", frames.length - 1);
    //load animation
    initAnimation("animate", frames, [], layout, 10, stops, true);
    return;
}

//load main
function main() {

    //slider
    $("input[type=range]").each(function () {
        $(this).on('input', function(){
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );
            historyPlot(parseFloat($(this).val()));
        });
    });

    //animation
    $("input[type=submit]").click(function () {
        var idName = $(this).attr("id");
        startAnimation();
    });

    initPlot()

    initGuidance(["graph", "ani", "graph", "ani", "graph", "sli", "graph","text"]);



}
$(document).ready(main);
