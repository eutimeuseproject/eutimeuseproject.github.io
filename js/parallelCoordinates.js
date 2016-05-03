var pdata;

var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

d3.csv("data/group-avgs1.csv", function(error, csv) {
  var data = csv;

  for(var i=0; i<data.length; i++){
    data[i].leisure = parseFloat(data[i].leisure)/60;
    data[i].pcare = parseFloat(data[i].pcare)/60;
    data[i].household = parseFloat(data[i].household)/60;
    data[i].travel = parseFloat(data[i].travel)/60;
    data[i].work = parseFloat(data[i].work)/60;
  }

  pdata=data;

  updatePath("gender");
});

// from http://bl.ocks.org/jasondavies/1341281
function updatePath(selectedValue) {

  var displayData = pdata.filter(function(item){
    return (item["type"]==selectedValue);
  });

  // http://stackoverflow.com/questions/14422198/how-do-i-remove-all-children-elements-from-a-node-and-them-apply-them-again-with
  d3.select("#parallel-coordinates").selectAll("*").remove();

  var svg = d3.select("#parallel-coordinates").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions =["leisure","pcare","work","travel","household"]
      //["leisure","pcare","work","travel","household"])
      //d3.keys(pdata[0])
          .filter(function(d) {
    return d != "Group.1" && d != "type" && (y[d] = d3.scale.linear()
        .domain(d3.extent(pdata, function(p) { return +p[d]; }))
        .domain([1,10.5])
        .range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
      .selectAll("path")
      .data(pdata)
      .enter().append("path")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(displayData)
      .enter().append("path")
      //.transition()
      .attr("stroke", function(d, i) {return color(i);})
      .attr("stroke-width", 3)
      .attr("fill", "none")
      .attr("d", path);

  //// Add grey background lines for context.
  //background = svg.append("g")
  //  .attr("class", "background")
  //  .selectAll("path")
  //  .data(pdata)
  //  .enter().append("path")
  //  .attr("d", path);
  //
  //// Add blue foreground lines for focus.
  //foreground = svg.append("g")
  //  .attr("class", "foreground")
  //  .selectAll("path.forepath")
  //  .data(displayData)
  //  .enter().append("path")
  //  //.attr("stroke", function(d, i) {return "#ddd";})
  //  .transition()
  //  .duration(800)
  //  .attr("class", "forepath")
  //  .attr("stroke", function(d, i) {return color(i);})
  //  .attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
      .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
          .origin(function(d) { return {x: x(d)}; })
          .on("dragstart", function(d) {
            dragging[d] = x(d);
            background.attr("visibility", "hidden");
          })
          .on("drag", function(d) {
            dragging[d] = Math.min(width, Math.max(0, d3.event.x));
            foreground.attr("d", path);
            dimensions.sort(function(a, b) { return position(a) - position(b); });
            x.domain(dimensions);
            g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
          })
          .on("dragend", function(d) {
            delete dragging[d];
            transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
            transition(foreground).attr("d", path);
            background
                .attr("d", path)
                .transition()
                .delay(500)
                .duration(0)
                .attr("visibility", null);
          }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return formatLabel(d); })
      .attr("cursor","move");

   //Add and store a brush for each axis.
  //g.append("g")
  //  .attr("class", "brush")
  //  .each(function(d) {
  //    d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
  //  })
  //  .selectAll("rect")
  //  .attr("x", -8)
  //  .attr("width", 16);




}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function formatLabel(d){
  if(d=="pcare"){
    return "Personal Care (hrs/day)"
  }
  else{
    return d.capitalize() + " (hrs/day)";
  }
}

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}