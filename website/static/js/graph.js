function newPlot(state) {
  d3.csv("static/data/immigration.csv")
    .then(function(immi_data) {
    d3.csv("static/data/emigration.csv")
      .then(function(emi_data) {
        immi_data.forEach(function(datum) {
            datum.flow = +datum.flow;
            datum.year = +datum.year;
          });

        emi_data.forEach(function(datum) {
            datum.flow = +datum.flow;
            datum.year = +datum.year;
          });

        state_immi = immi_data.filter(datum => datum.target.trim() == state.trim());
        state_emi = emi_data.filter(datum => datum.source.trim() == state.trim());

        var immi_trace = {
            x: state_immi.map(datum => datum.year),
            y: state_immi.map(datum => datum.flow),
            type: 'scatter',
            mode: 'lines',
            name: 'Immigration (flow in) '.concat(state)
        };

        var emi_trace = {
            x: state_emi.map(datum => datum.year),
            y: state_emi.map(datum => datum.flow),
            type: 'scatter',
            mode: 'lines',
            name: 'Emigration (flow out) '.concat(state)
        };

        var title = "Population flow";
        var layout = {
            title: {
                text: title
            },
            xaxis: {
                tickformat: 'd',
                title: {
                    text: "Year"
                }
            },
            yaxis: {
                title: {
                    text: "Number of People"
                }
            }
        };

        var data = [immi_trace, emi_trace];

        Plotly.plot("graph", data, layout);
    });
  });
};

function updatePlot(state) {
    d3.csv("static/data/immigration.csv")
      .then(function(immi_data) {
      d3.csv("static/data/emigration.csv")
        .then(function(emi_data) {
          immi_data.forEach(function(datum) {
              datum.flow = +datum.flow;
              datum.year = +datum.year;
            });
  
          emi_data.forEach(function(datum) {
              datum.flow = +datum.flow;
              datum.year = +datum.year;
            });
  
          state_immi = immi_data.filter(datum => datum.target.trim() == state.trim());
          state_emi = emi_data.filter(datum => datum.source.trim() == state.trim());
  
          var immi_trace = {
              x: state_immi.map(datum => datum.year),
              y: state_immi.map(datum => datum.flow),
              type: 'scatter',
              mode: 'lines',
              name: 'Immigration (flow in) '.concat(state)
          };
  
          var emi_trace = {
              x: state_emi.map(datum => datum.year),
              y: state_emi.map(datum => datum.flow),
              type: 'scatter',
              mode: 'lines',
              name: 'Emigration (flow out) '.concat(state)
          };
  
          Plotly.restyle("graph", "x", [immi_trace.x, emi_trace.x]);
          Plotly.restyle("graph", "y", [immi_trace.y, emi_trace.y]);
          Plotly.restyle("graph", "name", [immi_trace.name, emi_trace.name]);
      });
    });
  };

newPlot("Alabama");