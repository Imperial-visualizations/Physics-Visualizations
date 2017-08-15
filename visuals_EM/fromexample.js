var layout = {
  width: 900,
  height: 450,
  autosize: true,
  scene: {
    xaxis: {range: [-2, 2], autorange:false, zeroline:false},
    yaxis: {range: [-2, 2], autorange:false, zeroline:false},
    zaxis: {range: [-2, 2], autorange:false, zeroline:false},
    aspectmode: 'cube',
    camera: {center: {x:0,y:0,z:0},eye: {x: 1,y: -1,z: 0.1}}
  },
  margin: {},
  showlegend: false,
    
};
// Import data in json file as "frames" variable (same data structure as initially output in Python)

    var ourRequest = new XMLHttpRequest();

    ourRequest.open('GET','https://rawgit.com/amna-askari/JSONfilesforVisualisations/master/BiotAnimate.JSON')

    ourRequest.onload=function(){
        
        var data = JSON.parse(ourRequest.responseText);
        firstframe = data.Frames[0]
        plot_data = [firstframe[0],firstframe[1],firstframe[2],firstframe[3],firstframe[4], firstframe[5]]      
        Plotly.plot(div='graph', plot_data, layout);

        
        $('#position').on('input', function(){
        i = $(this).val();
        Plotly.restyle(graph, {x: [data.Frames[i][0].x], y: [data.Frames[i][0].y],z:[data.Frames[i][0].z]},[0])
        Plotly.restyle(graph, {x: [data.Frames[i][1].x], y: [data.Frames[i][1].y],z:[data.Frames[i][1].z]},[1])    
        Plotly.restyle(graph, {x: [data.Frames[i][2].x], y: [data.Frames[i][2].y],z:[data.Frames[i][2].z]},[2])    
        Plotly.restyle(graph, {x: [data.Frames[i][3].x], y: [data.Frames[i][3].y],z:[data.Frames[i][3].z]},[3])    
        Plotly.restyle(graph, {x: [data.Frames[i][4].x], y: [data.Frames[i][4].y],z:[data.Frames[i][4].z]},[4])    
        Plotly.restyle(graph, {x: [data.Frames[i][5].x], y: [data.Frames[i][5].y],z:[data.Frames[i][5].z]},[5])    
        
        
        
            
        
                                });
      
      // For reference: dI: 0, dB: 1, R:2, Bfield:3, Circle:4, Point:5
        
                                }


        ourRequest.send();
