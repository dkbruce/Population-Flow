// Set leaflet map
var flipped = "";
var year = "2015";
var url = "static/data/2015.csv";

var map = new L.map('map', {
          center: new L.LatLng(45,-110.58),
          zoom: 4,
              minZoom: 3,
              maxZoom: 6,
          layers: [
            new L.tileLayer('http://{s}tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
              subdomains: ['','a.','b.','c.','d.'],
              attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
            })
          ]
        });

// Initialize the SVG layer
map._initPathRoot()

//add drop down selector for year
var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'year');
    div.innerHTML = '<select><option>2011</option><option>2012</option><option>2013</option><option>2014</option><option>2015</option><option>2016</option><option>2017</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};

//add drop down selector for Migration Direction
legend.addTo(map);
var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'flipped');
    div.innerHTML = '<select><option>Migration Out</option><option>Migration In</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(map);


var removedata = function() {
  d3.select("#map").select("svg").selectAll("g").remove();
}

var updatedata = function(data) {
// Setup svg element to work with
var svg = d3.select("#map").select("svg"),
    linklayer = svg.append("g"),
    nodelayer = svg.append("g");

// Load data asynchronosuly

  d3.json("static/data/states.geojson", function(nodes) {

    d3.csv(data, function(links) {

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

      //calculate the total flow for this circle
     var totalflow = 0
       for(i in nodelinks){
          totalflow += parseInt(nodelinks[i].flow)
       }

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
      circs.append("svg:title")
        .text(totalflow);
    console.log(circs[0][0]);
    };

    var mouseout = function(d) {
      // Remove links
      linklayer.selectAll("path").remove();
      // Show all nodes
      circs.transition().style('opacity', 0.7);
      //remove title
      circs.selectAll("title").remove();
    };

    // Draw nodes

    var node = spatialsankey.node();
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
      .on('mouseout', mouseout);

    // Adopt size of drawn objects after leaflet zoom reset
    var zoomend = function(){
        linklayer.selectAll("path").attr("d", spatialsankey.link());

        circs.attr("cx", node.cx)
             .attr("cy", node.cy);
    };

    map.on("zoomend", zoomend);
  });
});
};
var options = {'use_arcs': false, 'flip': false};
d3.selectAll("input").forEach(function(x){
  options[x.name] = parseFloat(x.value);
});

d3.selectAll("input").on("click", function(){
  options[this.name] = parseFloat(this.value);
});
// initialize the map with 2015
var initialdata = "static/data/2015.csv";
updatedata(initialdata);

d3.selectAll('div.year')
.selectAll("select")
.on("change",function(d){
  var selected = d3.selectAll('div.year')
  .select("select").node().value;
  year = selected
  //construct url
  url = "static/data/"+String(year)+flipped  + ".csv"
  //remove existing data
  removedata();
  //load in updates data
  updatedata(url);
});

//update the data on Migration Direction Change
d3.selectAll('div.flipped')
.selectAll("select")
.on("change",function(d){
  var selected = d3.selectAll('div.flipped')
  .select("select").node().value;
  if(selected == 'Migration In'){
    flipped = "flipped";
  }
  else {
    flipped = ""
  }
  //construct url
  url = "static/data/"+String(year)+flipped  + ".csv"
  //remove existing data
  removedata();
  //load in updates data
  updatedata(url);
});
