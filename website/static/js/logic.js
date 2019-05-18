// Set leaflet map
var map = new L.map('map', {
          center: new L.LatLng(40,-90.58),
          zoom: 4,
          layers: [
            new L.tileLayer('http://{s}tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
              subdomains: ['','a.','b.','c.','d.'],
              attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
            })
          ]
        });

// Initialize the SVG layer
map._initPathRoot()

// Setup svg element to work with
var svg = d3.select("#map").select("svg"),
    linklayer = svg.append("g"),
    nodelayer = svg.append("g");




// Load data asynchronosuly
function graphs(csv){
d3.json("../../data/states.geojson", function(nodes) {
  console.log(nodes);
  d3.csv(csv, function(links) {
    console.log(links);
    // Setup spatialsankey object
    var spatialsankey = d3.spatialsankey()
                            .lmap(map)
                            .nodes(nodes.features)
                            .links(links);

    var mouseover = function(d){
      // Get link data for this node
      var nodelinks = spatialsankey.links().filter(function(link){
        return link.source == d.id;
      });

      // Add data to link layer
      var beziers = linklayer.selectAll("path").data(nodelinks);
      link = spatialsankey.link(options);

      // Draw new links
      beziers.enter()
        .append("path")
        .attr("d", link)
        .attr('id', function(d){return d.id})
        .style("stroke-width", spatialsankey.link().width());

      // Remove old links
      beziers.exit().remove();

      // Hide inactive nodes
      var circleUnderMouse = this;
      circs.transition().style('opacity',function () {
          return (this === circleUnderMouse) ? 0.7 : 0;
      });
    };

    var mouseout = function(d) {
      // Remove links
      linklayer.selectAll("path").remove();
      // Show all nodes
      circs.transition().style('opacity', 0.7);
    };

    // Draw nodes
    var node = spatialsankey.node()
    var circs = nodelayer.selectAll("circle")
      .data(spatialsankey.nodes())
      .enter()
      .append("circle")
      .attr("cx", node.cx)
      .attr("cy", node.cy)
      .attr("r", node.r)
      .style("fill", node.fill)
      .attr("opacity", 0.7)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .on('click', click);

    // Adopt size of drawn objects after leaflet zoom reset
    var zoomend = function(){
        linklayer.selectAll("path").attr("d", spatialsankey.link());

        circs.attr("cx", node.cx)
             .attr("cy", node.cy);
    };

    map.on("zoomend", zoomend);
  });
});

var options = {'use_arcs': false, 'flip': false};
d3.selectAll("input").forEach(function(x){
  options[x.name] = parseFloat(x.value);
})

d3.selectAll("input").on("click", function(){
  options[this.name] = parseFloat(this.value);
});
}

graphs("../../data/2015.csv");
