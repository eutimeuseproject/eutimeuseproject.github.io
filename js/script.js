var w = 500;
var	h = 500;

//var colorscale = d3.scale.category20(); 
var colorscale = ["#0070c0", "#ffc23c"];

//Legend titles
var LegendOptions = ['Belgium','Bulgaria'];

//Data
var d = [
		  [
			{axis:"Email",value:0.59},
			{axis:"Social Networks",value:0.56},
			{axis:"Internet Banking",value:0.42},
			{axis:"News Sportsites",value:0.34},
			{axis:"Search Engine",value:0.48},
			{axis:"View Shopping sites",value:0.14},
			{axis:"Paying Online",value:0.11},
			{axis:"Buy Online",value:0.05},
			{axis:"Stream Music",value:0.07},
			{axis:"Online Gaming",value:0.12},
			{axis:"Navigation",value:0.27},
			{axis:"App connected to TV program",value:0.03},
			{axis:"Offline Gaming",value:0.12},
			{axis:"Photo Video",value:0.4},
			{axis:"Reading",value:0.03},
			{axis:"Listen Music",value:0.22},
			{axis:"Watch TV",value:0.03},
			{axis:"TV Movies Streaming",value:0.03},
			{axis:"Listen Radio",value:0.07},
			{axis:"Sending Money",value:0.18},
			{axis:"Other",value:0.07},
			{axis:"Use less Once week",value:0.08}
		  ],[
			{axis:"Email",value:0.48},
			{axis:"Social Networks",value:0.41},
			{axis:"Internet Banking",value:0.27},
			{axis:"News Sportsites",value:0.28},
			{axis:"Search Engine",value:0.46},
			{axis:"View Shopping sites",value:0.29},
			{axis:"Paying Online",value:0.11},
			{axis:"Buy Online",value:0.14},
			{axis:"Stream Music",value:0.05},
			{axis:"Online Gaming",value:0.19},
			{axis:"Navigation",value:0.14},
			{axis:"App connected to TV program",value:0.06},
			{axis:"Offline Gaming",value:0.24},
			{axis:"Photo Video",value:0.17},
			{axis:"Reading",value:0.15},
			{axis:"Listen Music",value:0.12},
			{axis:"Watch TV",value:0.1},
			{axis:"TV Movies Streaming",value:0.14},
			{axis:"Listen Radio",value:0.06},
			{axis:"Sending Money",value:0.16},
			{axis:"Other",value:0.07},
			{axis:"Use less Once week",value:0.17}
		  ]
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.6,
  levels: 6,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
//RadarChart.draw("#chart", d, mycfg);

d3.csv("../data/TimeUse.csv", function(error, data) {

	var categoryNames = {

		'hobbies' : ["Hobbies and games except computing and computer games", /*"Leisure, social and associative life",*/ 
		"Participatory activities", "Visiting and feasts", "Other social life", "Entertainment and culture", "Walking and hiking",
		"Computer games", "Reading books", "TV and video",/* "Radio and music", "Unspecified leisure", */"Travel except travel related to jobs",
		"Travel related to shopping and services", "Travel related to leisure, social and associative life", "Unspecified travel",
		"Unspecified time use"],


		 'transports' : ["Transporting a child", "Travel related to other household purposes", /*"Main and second job and related travel",*/
		 "Travel to/from work", /*"Travel except travel related to jobs"*/, "Travel related to shopping and services", 
		 "Travel related to leisure, social and associative life"],

		 'school' : [/*"Teaching",*/ /*"Food management except dish washing"*/, "Computing",
		 /*"Gardening; other pet care",*/ /* "Employment, related activities and travel as part of/during main and second job",*/
	     /*"Main and second job and related travel",*/ "Activities related to employment and unspecified employment",
	     "Handicraft and producing textiles and other care for textiles", "Travel to/from work", "Homework", "Free time study", "Study", 
	     "School and university except homework", "Organisational work", "Reading, except books", "Travel related to study"],

	     'work' : ["Food management except dish washing", "Computing",
	    "Employment, related activities and travel as part of/during main and second job",
	    "Main and second job and related travel", "Activities related to employment and unspecified employment",
	    "Handicraft and producing textiles and other care for textiles", "Travel to/from work"],

	     'family' : [/*"c, reading and talking with child",*/ "Household management and help family member",/* "Household and family care",*/
	    "Gardening; other pet care", "Tending domestic animals", "Caring for pets", 
	    "Walking the dog", "Childcare, except teaching, reading and talking", /*"c, reading and talking with child",*/
	    "Household management and help family member", "Transporting a child", "Travel related to other household purposes"],

		 'house' :	["Cleaning dwelling", "Household upkeep except cleaning dwelling", "Laundry", "Informal help to other households",
		  "Eating", "Construction and repairs", "Ironing"],

		 'personal_care' : [ "Other and/or unspecified personal care", "Shopping and services", /*"Sleep",*/
		 "Resting", "Sports and outdoor activities except walking and hiking"]
	};


	//var columns_names = Object.keys(data[0]).slice(3, 15);
	var categories = Object.keys(categoryNames);
	var columns_names = categoryNames['work'];
	var countryNames = Array();
	var countryData = {};


	var fillData = function(data, columns_names){

		var countryData = {};

		data.forEach(function(d) {

			//countryNames = Array();
        
	        var country = d["GEO/ACL00"];

	        if(arrayContains(country, countryNames)){
	        	;
	        }
	        else{
	        	countryNames.push(country);
	        }
	        

	        countryData[country] = [];

	        // { cerealName: [ bar1Val, bar2Val, ... ] }
	        columns_names.forEach(function(field) {

	        	var field_data = {
					axis : field,
					value :  convert_to_minutes(d[field])
				};
	            countryData[country].push(field_data);

	        });
	    });

	    return countryData ;

	};

	/*
    
    data.forEach(function(d) {
        
        var country = d["GEO/ACL00"];
        countryNames.push(country);

        countryData[country] = [];

        // { cerealName: [ bar1Val, bar2Val, ... ] }
        columns_names.forEach(function(field) {

        	var field_data = {
				axis : field,
				value :  convert_to_minutes(d[field])/2
			};
            countryData[country].push(field_data);

        });
    }); */

    countryData = fillData(data, columns_names);

    //makeVis(cerealMap);
	var default_data = [countryData["Belgium"],
					countryData["Bulgaria"]];

	// Handler for dropdown value change for country name 1
    var dropdownChange = function() {

        var newCountry = d3.select(this).property('value');
		newData   = countryData[newCountry];
		console.log(newCountry);
		//updateBars(newData);
		default_data[0] = newData;
		LegendOptions[0] = newCountry;

		RadarChart.draw("#chart", default_data, mycfg);
		DrawLengend(LegendOptions)
    }; 

    // Handler for dropdown value change for country name 2
    var dropdownChange_2 = function() {

        var newCountry = d3.select(this).property('value');
        newData   = countryData[newCountry];
        LegendOptions[1] = newCountry;

        console.log(newCountry);

 		 //updateBars(newData);
 		 default_data[1] = newData;
 		 RadarChart.draw("#chart", default_data, mycfg);
 		 DrawLengend(LegendOptions)
    };

    var dropdownChangeCategory = function() {

    	var newCategory = d3.select(this).property('value');

    	columns_names = categoryNames[newCategory];

    	countryData = fillData(data, columns_names);

        console.log(newCategory);

        default_data = [countryData];

        LegendOptions = ['Belgium','Bulgaria'];

        default_data = [countryData["Belgium"],
					   countryData["Bulgaria"]];

 		RadarChart.draw("#chart", default_data, mycfg);
 		DrawLengend(LegendOptions);

    }; 

    var dropdown = d3.select("#vis-container")
                    .insert("select", "svg")
                    .attr("class", "form-control")
                    .on("change", dropdownChange);

	dropdown.selectAll("option")
                    .data(countryNames)
                    .enter().append("option")
                    .attr("class", function(d) { return  "dropdown-content" })
                    .attr("value", function (d) { return d; })
                    .text(function (d) {
                        return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
                    });

    var dropdown2 = d3.select("#vis-container-2")
                    .insert("select", "svg")
                    .attr("class", "form-control")
                    .on("change", dropdownChange_2);

    dropdown2.selectAll("option")
                    .data(countryNames)
                    .enter().append("option")
                    .attr("class", "dropdown-content")
                    .attr("value", function (d) { return d; })
                    .text(function (d) {
                        return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
                    });


    var dropdownCategory = d3.select("#vis-container-3")
                    .insert("select", "svg")
                    .attr("class", "form-control")
                    .on("change", dropdownChangeCategory);


    dropdownCategory.selectAll("option")
                    .data(categories)
                    .enter().append("option")
                    .attr("class", "dropdown-content")
                    .attr("value", function (d) { return d; })
                    .text(function (d) {
                        return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
                    });


    RadarChart.draw("#chart", default_data, mycfg);
    DrawLengend(LegendOptions);
    console.log(default_data);
    console.log(d);
    console.log(countryData);

});

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

function DrawLengend(LegendOptions){


	var svg = d3.select('#body')
	.selectAll('svg')
	.append('svg')
	.attr("width", w+300)
	.attr("height", h)

	//Create the title for the legend
	var text = svg.append("text")
		.attr("class", "title")
		.attr('transform', 'translate(90,0)') 
		.attr("x", w - 70)
		.attr("y", 10)
		.attr("font-size", "12px")
		.attr("fill", "#404040")
		.text("Countries");
			
	//Initiate Legend	
	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		.attr('transform', 'translate(90,20)') ;

		//Create colour squares
		legend.selectAll('rect')
		  .data(LegendOptions)
		  .enter()
		  .append("rect")
		  .attr("x", w - 55)
		  .attr("y", function(d, i){ return i * 20;})
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", function(d, i){ return colorscale[i];})
		  ;
		//Create text next to squares
		legend.selectAll('text')
		  .data(LegendOptions)
		  .enter()
		  .append("text")
		  .attr("x", w - 42)
		  .attr("y", function(d, i){ return i * 20 + 9;})
		  .attr("font-size", "11px")
		  .attr("fill", "#737373")
		  .text(function(d) { return d; })
		  ;	

}


// Function to convert data format "HH:MM" to minutes 
function convert_to_minutes(d){

	if (typeof d === 'undefined') {
	  // color is undefined
	  return 0;
	}
	else{
		var list_hour = d.split(':');
		var minutes = parseInt(list_hour[0], 10) * 60 + parseInt(list_hour[1], 10);
		return minutes;
	}

	

}

function arrayContains(needle, arrhaystack)
{
    return (arrhaystack.indexOf(needle) > -1);
}