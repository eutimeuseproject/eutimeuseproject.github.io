// Global datasets
var data;
var femaleData;
var maleData;

// Set ordinal color scale
var colorScale = d3.scale.category20();

// Variables for the visualization instances
var layeredhistogram;

// use the Queue.js library to read multiple files
queue()
  //.defer(d3.csv, "data/datatouse.csv")
  .defer(d3.csv, "data/time_use_average.csv")
  .await(analyze);

function analyze(error, dataToUse){

  //dataByState = dataByStateCSV;
  data=dataToUse;

  for(var i=0; i<dataToUse.length; i++){
    data[i].act_educ = Math.round(+dataToUse[i].study);
    data[i].act_leisure = Math.round(+dataToUse[i].leisure);
    data[i].act_pcare = Math.round(+dataToUse[i].personal_care);
    data[i].act_household= Math.round(+dataToUse[i].household);
    data[i].act_travel = Math.round(+dataToUse[i].travel);
    data[i].act_work = Math.round(+dataToUse[i].work);
    data[i].educ_perc = +dataToUse[i].act_educ;
    data[i].leisure_perc = +dataToUse[i].act_leisure;
    data[i].pcare_perc = +dataToUse[i].act_pcare;
    data[i].work_perc = +dataToUse[i].act_work;
    data[i].household_perc = +dataToUse[i].act_household;
    data[i].travel_perc = +dataToUse[i].act_travel;
    data[i].state = +dataToUse[i].GEO;
  }

  //console.log(dataByState[0]);
  console.log(data[0]);

  // Filter function
  femaleData = data.filter(function(item){
    return item.SEX=="Females";
  });

  maleData = data.filter(function(item){
    return item.SEX=="MaleS";
  });

  colorScale.domain(["act_educ","lact_leisur","act_pcare","act_household","act_travel","act_work"])

  createVis()
}

function createVis() {

  // TO-DO: INSTANTIATE VISUALIZATION
  //bubbleChart = new BubbleChart("bubble-chart",data);
  //femalehistogram = new Histogram("female-histogram",femaleData,"act_leisure");
  //malehistogram = new Histogram("male-histogram",maleData,"act_leisure");
  layeredhistogram = new layeredHistogram("overlapping-histogram",data,"act_leisure");
  //areachart = new StackedAreaChart("stacked-area-chart",data);
}

function updateChart(){
  //bubbleChart.updateVis();
  layeredhistogram.wrangleData();
}