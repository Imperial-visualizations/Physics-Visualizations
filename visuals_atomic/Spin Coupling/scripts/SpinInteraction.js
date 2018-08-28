$(window).on('load', function() {//main
    const
    dom = {//assigning switches and slider
        sSwitch:    $("#switch-s input"),
        lSwitch:    $("#switch-l input"),
        msSwitch:   $("#switch-ms input"),
        mlSwitch:   $("#switch-ml input"),
    },
    plt = {//layout of graph
        layout : {
            legend: {x: 0, y: -0.2, orientation: 'h'},
            autosize: true,
            font: {
                family: "Fira Sans",
                size: 16,
            },
            xaxis: {
                title: 'L_x',
                titlefont: {
                    family: "Fira Sans",
                    size: 18,
                    color: '#7f7f7f'
                    },
                range: [-2,2]
            },
            yaxis: {
                title: 'L_z',
                titlefont: {
                    family: "Fira Sans",
                    size: 18,
                    color: '#7f7f7f'
                    },
                range: [-2,2]
            },
            margin: {
                l: 50, r: 20, b: 0, t: 30, pad: 5,
            },
            hovermode: false,
        }
    };

    function get_data() {
        let data = [];
        let ms = +$("input[name = 'switch-ms']:checked").val();
        let ml = +$("input[name = 'switch-ml']:checked").val(); 
        let s = +$("input[name = 'switch-s']:checked").val();
        let l = +$("input[name = 'switch-l']:checked").val();

        let xs = Math.sqrt(s*(+s+1)-Math.pow(ms, 2));
        let xl = Math.sqrt(l*(+l+1)-Math.pow(ml, 2));
        let mj = ms + ml;
        let j = s + l;

        if (xs >= xl) {//position of j vector text
            tj = -0.3;
        } else {
            tj = 0.3;
        };

        data.push({name: "Spin", x: [0, xs], y: [0, ms], mode: "lines", line: {width: 3, color: '50C878'}, legendgroup: "s"});
        draw_arrowtips(data, xs, ms, 7*Math.PI/8, 0.2, '50C878', 's')
        data.push({x: [0, xs], y: [ms, ms], mode: "lines", line: {width: 3, dash: "dash", color: '50C878'}, legendgroup: "s", showlegend: false});
        data.push({x: [+xs +0.3], y: [ms], mode: "text", text: 'm_s', textfont: {color: '50C878'}, legendgroup: "s", showlegend: false});

        data.push({name: "Angular momentum", x: [0,-xl], y: [0, ml], mode: "lines", line: {width: 3, color: '0080FF'}, legendgroup: "l"});
        draw_arrowtips(data, -xl, ml, 7*Math.PI/8, 0.2, '0080FF', 'l')
        data.push({x: [0, -xl], y: [ml, ml], mode: "lines", line: {width: 3, dash: "dash", color: '0080FF'}, legendgroup: "l", showlegend: false});
        data.push({x: [-xl -0.3], y: [ml], mode: "text", text: 'm_l', textfont: {color: '0080FF'}, legendgroup: "l", showlegend: false});

        data.push({name: "Total angular momentum", x: [0,xs-xl], y: [0, mj], mode: "lines", line: {width: 3, color: '9400D3'}, legendgroup: "j"});
        draw_arrowtips(data, xs-xl, mj, 7*Math.PI/8, 0.2, '9400D3', 'j')
        data.push({x: [0, xs-xl], y: [mj, mj], mode: "lines", line: {width: 3, dash: "dash", color: '9400D3'}, legendgroup: "j", showlegend: false});
        data.push({x: [tj], y: [mj], mode: "text", text: 'm_j', textfont: {color: '9400D3'}, legendgroup: "j", showlegend: false});
        
        document.getElementById("mj_variable_text").innerHTML = mj;
        document.getElementById("j_variable_text").innerHTML = j;

        return data;
    };

    function draw_arrowtips(obj, x, y, angle, length_ratio, color, legendgroup) {
        /* rotates the vector -angle and +angle to make the two tips,
        scales down to length_ratio and pushes to obj */
        
        let vec1 = new Vector(Math.cos(angle),Math.sin(angle),0).multiply(x).add(new Vector(-Math.sin(angle),Math.cos(angle),0).multiply(y)).multiply(length_ratio),
            vec2 = new Vector(Math.cos(-angle),Math.sin(-angle),0).multiply(x).add(new Vector(-Math.sin(-angle),Math.cos(-angle),0).multiply(y)).multiply(length_ratio);
        console.log(x, vec1.x+x, y, vec1.y+y);
        obj.push({x: [x, x+vec1.x], y: [y, y+vec1.y], mode: "lines", line: {width: 3, color: color}, legendgroup: legendgroup, showlegend: false});
        obj.push({x: [x, x+vec2.x], y: [y, y+vec2.y], mode: "lines", line: {width: 3, color: color}, legendgroup: legendgroup, showlegend: false});        
    };

    function select_disable() {
        let s = $("input[name = 'switch-s']:checked").val();
        let l = $("input[name = 'switch-l']:checked").val();
        
        for (let i = -2; i <= 2; i++) {
            if (Math.abs(0.5*i % 1) == (s % 1)) {
                document.getElementById("ms"+ 0.5*i).disabled=false;
            } else {
                document.getElementById("ms"+ 0.5*i).disabled=true;
            };
        };
        document.getElementById('ms'+s).checked = true;
        
        for (let i = -3; i <= 3; i++) {
            if (Math.abs(i) <= l) {
                document.getElementById("ml"+i).disabled=false;
            } else {
                document.getElementById("ml"+i).disabled=true;
            };
        };

        if (Math.abs($("input[name='switch-ml']:checked").val()) > l) {
            document.getElementById('ml'+l).checked = true;
        };

        update_graph();
    };

    function initial() {
        Plotly.purge("graph")
        Plotly.newPlot('graph', get_data(), plt.layout)

        $('.container').show();//show container after loading finishes
        $('#spinner').hide();

        $("input[id ^= 'm']").change(update_graph);
        $("input:not([id ^= 'm'])").change(select_disable);
    };

    function rescale_range() {
        let s = $("input[name = 'switch-s']:checked").val();
        let l = $("input[name = 'switch-l']:checked").val();
        let ms = $("input[name = 'switch-ms']:checked").val();
        let ml = $("input[name = 'switch-ml']:checked").val();      

        let xs = Math.sqrt(s*(+s+1)-Math.pow(ms, 2));
        let xl = Math.sqrt(l*(+l+1)-Math.pow(ml, 2));

        if (xl >= 2 || l >= 2) {
            plt.layout.xaxis.range = [-5, 5];
            plt.layout.yaxis.range = [-5, 5];
        } else {
            plt.layout.xaxis.range = [-2.5, 2.5];
            plt.layout.yaxis.range = [-2.5, 2.5];
        };
    };

    function update_graph() {
        rescale_range();

        Plotly.animate("graph", {
            data: get_data(),
            layout: plt.layout
        }, {
            transition: {
                duration: 500,
                easing: 'cubic-in-out'
            }
        });
    };

    initial();
});