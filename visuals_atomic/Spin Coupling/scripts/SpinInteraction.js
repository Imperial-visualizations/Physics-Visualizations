$(window).on('load', function() {//main
    const
    dom = {//assigning switches and slider

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
                l: 70, r: 100, b: 0, t: 30, pad: 5,
            },
            hovermode: false,
        }
    };

    function get_data() {
        let data = [];
        let ms = $('#ms').val();
        let ml = $('#ml').val();
        let s = $('#s').val();
        let l = $('#l').val();

        let xs = Math.sqrt(s*(+s+1)-Math.pow(ms, 2));
        let xl = Math.sqrt(l*(+l+1)-Math.pow(ml, 2));
        let mj = +ms + +ml;
        let j = +s + +l;
        if (xs >= xl) {
            tj = -0.3;
        } else {
            tj = 0.3;
        };

        data.push({name: "Spin", x: [0, xs], y: [0, ms], mode: "lines", line: {width: 3, color: '50C878'}, legendgroup: "s"});
        data.push({name: "", x: [0, xs], y: [ms, ms], mode: "lines", line: {width: 3, dash: "dash", color: '50C878'}, legendgroup: "s", showlegend: false});
        data.push({x: [+xs +0.3], y: [ms], mode: "text", text: 'm_s', textfont: {color: '50C878'}, legendgroup: "s", showlegend: false});

        data.push({name: "Angular momentum", x: [0,-xl], y: [0, ml], mode: "lines", line: {width: 3, color: '0080FF'}, legendgroup: "l"});
        data.push({name: "", x: [0, -xl], y: [ml, ml], mode: "lines", line: {width: 3, dash: "dash", color: '0080FF'}, legendgroup: "l", showlegend: false});
        data.push({x: [-xl -0.3], y: [ml], mode: "text", text: 'm_l', textfont: {color: '0080FF'}, legendgroup: "l", showlegend: false});

        data.push({name: "Total angular momentum", x: [0,xs-xl], y: [0, mj], mode: "lines", line: {width: 3, color: '9400D3'}, legendgroup: "j"});
        data.push({name: "", x: [0, xs-xl], y: [mj, mj], mode: "lines", line: {width: 3, dash: "dash", color: '9400D3'}, legendgroup: "j", showlegend: false});
        data.push({x: [tj], y: [mj], mode: "text", text: 'm_j', textfont: {color: '9400D3'}, legendgroup: "j", showlegend: false});

        document.getElementById("mj_variable_text").innerHTML = mj;
        document.getElementById("j_variable_text").innerHTML = j;

        return data;
    };

    function select_disable() {
        let s = $('#s').val();
        let l = $('#l').val();

        for (let i = -2; i <= 2; i++) {
            if (Math.abs(0.5*i % 1) == (s % 1)) {
                document.getElementById("ms"+ 0.5*i).disabled=false;
            } else {
                document.getElementById("ms"+ 0.5*i).disabled=true;
            };
        };
        document.getElementById("ms").selectedIndex = 2*(s % 1);

        for (let i = -3; i <= 3; i++) {
            if (Math.abs(i) <= l) {
                document.getElementById("ml"+i).disabled=false;
            } else {
                document.getElementById("ml"+i).disabled=true;
            };
        };
        if (Math.abs(document.getElementById("ml").value) > l) {
            document.getElementById("ml").value = l;
        };

        update_graph();
    };

    function initial() {
        Plotly.purge("graph")
        Plotly.newPlot('graph', get_data(), plt.layout)

        $('.container').show();//show container after loading finishes
        $('#spinner').hide();
    };

    function rescale_range() {
        let ms = $('#ms').val();
        let ml = $('#ml').val();
        let s = $('#s').val();
        let l = $('#l').val();

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

    $("#ms").on("change", update_graph);
    $("#ml").on("change", update_graph);
    $("#s").on("change", select_disable);
    $("#l").on("change", select_disable);

    initial();
});