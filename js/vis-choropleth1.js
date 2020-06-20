/**
 * Created by tle1925 on 4/16/2016.
 */

// --> CREATE SVG DRAWING AREA
var width = 900,
    height = 500;

var format=d3.format(".1f");

var EUmap;
var timeuse;

// Map data by states
var dataByStates = d3.map();

queue()
    .defer(d3.json, "data/europe.json")
    .defer(d3.csv, "data/time_use_average.csv", processData)
    .await(loaded);

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height)


function processData(d) {
    d.act_work= +d.work;
    d.act_leisure= +d.leisure;
    d.act_pcare= +d.personal_care;
    d.act_educ= +d.study;
    d.act_travel= +d.travel;
    d.act_household= +d.household;
    return d;
}

function loaded(error,map,data) {
    EUmap=map;
    timeuse=data;
    console.log("timeuse",timeuse[0])
    console.log("map",EUmap.features[0].properties.CntryName)
    console.log("max",d3.max(timeuse, function(d) {return +d[selectedActivity('Average Work')]}))
    console.log("min",selectedActivity('Average Work'))
    updateMap();
}


/*function selectedActivity(d) {
    switch (d) {
      case 'Average Work': return "average_work";
      case 'Average Leisure': return "average_leisure";
      case 'Average Personal Care': return "average_pcare";
      case 'Average Educational Time': return "average_educ";   
      case 'Average Household': return "average_household"; 
      case 'Average Travel': return "average_travel"; 
    }
  }*/


/*var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width/2.1, height/2]);

var path = d3.geo.path()
    .projection(projection);*/

var projection = d3.geo.mercator()
    .center([13, 52])
    .scale(350)
    .translate([width/2.1, height/2]);

var path = d3.geo.path()
    .projection(projection);


// Create color scale
var colors = ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"];
// set up a scale that can take data values as input, and will return colors
var color = d3.scale.linear()
    .range(colors);

function getText(d,selectedValue) {
    var summary=
        "<p style='font-size: 20px; text-transform: uppercase; font-weight: bold; color: #ff775c'>" + d.properties.CntryName +"</p>" +
        "<p>" + selectedValue + ": " + d3.round(d.properties[selectedActivity(selectedValue)],2)+ " hours</p>"
    document.getElementById("content-1").innerHTML=summary;
}

function updateMap(){

    layeredhistogram.updateVis();

    // Exit previous objects
    s=d3.selectAll("path.countries")
    s.remove();

    s1=d3.selectAll(".rectangles")
    s1.remove()

    s2=d3.selectAll(".legend-labels")
    s2.remove()

    // Get selected value
    selectedValue=d3.select("#map-type").property("value");
    showExplanation(selectedValue);
    // Get selected value

    var min=d3.min(timeuse, function(d) {return +d[selectedActivity(selectedValue)]})
    var max=d3.max(timeuse, function(d) {return +d[selectedActivity(selectedValue)]})

    console.log("min",d3.max(timeuse, function(d) {return +d[selectedActivity("Average Work")]}))

    // Pass in domain for color scale
    //colorScale.domain(d3.range(min, max, (max-min)/colors.length));
    color.domain(d3.range(min, max, (max-min)/colors.length));

    // Save these labels for legend
    var leg_labels=d3.range(min, max, (max-min)/colors.length);
    leg_labels.unshift("No Data"); // Add item to beginning of array

    var EU = EUmap.features

    // Reference: http://chimera.labs.oreilly.com/books/1230000000345/ch12.html#_choropleth
    // Merge the malaria data and GeoJSON
    for(var i=0; i<timeuse.length; i++){

        //Grab country code, which matches with adm0_a3_is
        var dataCode = timeuse[i].GEO;

        //Find the corresponding country inside the GeoJSON
        for (var j = 0; j < EU.length; j++) {
            var jsonCode = EU[j].properties.CntryName;
            //console.log(dataCode, jsonCode);
            if (dataCode == jsonCode) {
                //Copy the data value into the JSON
                EU[j].properties[selectedValue]= timeuse[i][selectedActivity(selectedValue)];
                //Stop looking through the JSON
                break;
            }
        }
    }
    console.log("eu",EU)
    

    // Draw tip
    tip1 = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return (getText(d,selectedValue));
    });

    svg.call(tip1)

    //console.log(US);
    svg.selectAll('path.countries')
        .data(EU)
        .enter()
        .append('path')
        .attr('class', 'countries')
        .attr('d', path)
        .attr('fill', function(d,i) {
            if(!isNaN(d.properties[selectedValue])){
                return color(d.properties[selectedValue]);
            }
            return "#e5e5e5";
        })
        //.on('mouseover', tip1.show)
        .on('mouseover', function(d){
            layeredhistogram.wrangleData(d.properties.CntryName);
            getText(d,selectedValue);
            //tip1.show;
        })
        //.on('mouseout', tip1.hide)
        .on('mouseout', function(d){
            layeredhistogram.wrangleData("All States");
            document.getElementById("content-1").innerHTML="<p></p><p></p>";
        })

    var legend_group = svg.append("g")
        .attr("class", "map_legend_group")
        .attr("transform", "translate("+(width-120)+","+(height/2.5)+")");

    // Create legend
    var legend = legend_group.selectAll('.rectangles')
        .data(leg_labels)
        .enter()
        .append('rect')
        .attr("class", "rectangles")
        .attr("x", 0)
        .attr("y", function(d, i){
            return i*30;
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d,i){
            if(i==0){
                return "#e5e5e5";
            }
            else{
                return color(d);
            }
        });

    // Add labels for legend
    legend_group.selectAll("text")
        .data(leg_labels)
        .enter()
        .append('text')
        .attr("class", "legend-labels")
        .attr("x", 40)
        .attr("y", function(d, i) {
            return i*30+15;
        })
        .text(function(d,i) {
            if(i<(leg_labels.length-1) && i!=0){
                return ((format(leg_labels[i]))+ "-" + (format(leg_labels[i+1])));
            }
            else if (i==0) {
                return leg_labels[i];
            }
            else{
                return ((format(leg_labels[i])) + "-" + (format(max)));
            }
        });
}


function showExplanation(selectedValue){
    var summary;
    if (selectedValue=="Average Work"){
        summary= "Work"
    }
    if (selectedValue=="Average Leisure"){
        summary= "Leisure"
    }
    if (selectedValue=="Average Educational Time"){
        summary= "Education"
    }
    if (selectedValue=="Average Personal Care"){
        summary= "Personal Care"
	}
    if (selectedValue=="Average Household"){
        summary= "Average Household"
	}
    if (selectedValue=="Average Travel"){
        summary= "Average Travel"
    }	
    document.getElementById("update").innerHTML=summary;
}