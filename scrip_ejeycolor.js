var svg = d3.select("svg");

d3.csv("https://raw.githubusercontent.com/Sig156/actividad1_herramientas/main/data.csv").then(function (data) {

    // agrupar los datos por año y mes
    var nestedData = {};

    data.forEach(function (d) {
        if (!(d.Año in nestedData)) {
            nestedData[d.Año] = {};
        }
        nestedData[d.Año][d.Periodo] = {
            "Año": d.Año,
            "Periodo": d.Periodo,
            "Deuda_publica": +d["Deuda pública"]
        };
    });


    function actualizarGrafica() {
        var dataset = [];
        var datasetx = [];
        for (i in nestedData[document.getElementById("select-year").value]) {
            var data = nestedData[document.getElementById("select-year").value][i];
            dataset.push(Math.abs(data.Deuda_publica * 1000));
            datasetx.push(data.Periodo);
        }
        console.log(dataset);

        var colors = [];
        for (i in dataset) {
            var diff = Math.round((dataset[i] - Math.min.apply(Math, dataset)) / (Math.max.apply(Math, dataset) - Math.min.apply(Math, dataset)) * 100);
            if (diff == 100) {
                diff = 99;
            };
            if (diff < 10) {
                diff = "0" + diff;
            }
            diff = diff.toString()

            colors.push("#aa" + diff + diff);
            console.log(colors[i]);
        }

        var h = Math.round(window.innerHeight * 0.7, 0) - 100;
        var w = Math.round(window.innerWidth * 0.9, 0);

        var yScale = d3.scaleLinear()
            .domain([Math.min.apply(Math, dataset), Math.max.apply(Math, dataset)])
            .range([100, 350]);

        d3.select("svg").remove();

        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        var bars = svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .style("fill", function (d, i) {
                return colors[i];
            })
            .attr("x", function (d, i) {
                return i * (1 + Math.round((w - 350) / dataset.length));
            })
            .attr("y", function (d) {
                return h - (yScale(d));
            })
            .attr("width", function (d) {
                return Math.round((w - 350) / dataset.length);
            })
            .attr("height", function (d) {
                return yScale(d);
            });

        var textos = svg.selectAll("text")
            .data(datasetx)
            .enter()
            .append("text")
            .attr("font-family", "roboto");

        textos
            .text(function (d) {
                return d;
            })
            .attr("y", h)
            .attr("x", function (d, i) {
                return 4 + i * (1 + Math.round((w - 350) / datasetx.length));
            });

        var yTicks = yScale.ticks();
        var yAxis = d3.axisLeft(yScale).tickFormat(d3.format("$,.0f")).tickValues(yTicks);

        svg.append("g")
            .attr("transform", "translate(110,0)")
            .attr("class", "axis")
            .call(yAxis);

        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(122," + (h / 2) + ")rotate(-90)")
            .text("Deuda Pública");
    };


    // generar la gráfica inicialmente con los datos del primer año
    actualizarGrafica();

    // actualizar la gráfica cuando cambia el año seleccionado
    d3.select("#select-year").on("change", actualizarGrafica);

});
