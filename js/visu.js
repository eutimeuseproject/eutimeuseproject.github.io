/**********************************************************
 
                     variables globales

**********************************************************/
let time = [];
let map;
let life_expectancy = [];
let activities = [];
let gender_images = ["images/sex.png","images/men.png","images/women.png"]
let gender_values = ["Both","Males","Females"]
let country_images = [{country: 'Belgium',image: 'images/belgium_small.png'},
                      {country: 'Bulgaria',image: 'images/bulgaria_small.png'},
                      {country: 'Germany',image: 'images/germany_small.png'},
                      {country: 'Estonia',image: 'images/estonia_small.png'},
                      {country: 'Spain',image: 'images/spain_small.png'},
                      {country: 'France',image: 'images/france_small.png'},
                      {country: 'Italy',image: 'images/italy_small.png'},
                      {country: 'Latvia',image: 'images/latvia_small.png'},
                      {country: 'Lithuania',image: 'images/lithuania_small.png'},
                      {country: 'Poland',image: 'images/poland_small.png'},
                      {country: 'Slovenia',image: 'images/slovenia_small.png'},
                      {country: 'Finland',image: 'images/finland_small.png'},
                      {country: 'United Kingdom',image: 'images/united_kingdom_small.png'},
                      {country: 'Norway',image: 'images/norway_small.png'},]

let country_center_coordinates = [
    [250,285],
    [535,395],
    [320,270],
    [540,170],
    [130,420],
    [215,330],
    [330,360],
    [530,195],
    [525,225],
    [450,265],
    [390,350],
    [550,110],
    [165,270],
    [290,140]
]

// Création tooltip
let tooltip = d3.select("section")
    .append("div")
    .style("opacity", 1)
    .style("pointer-events", "none")
    .style("position", "absolute")
    .style("background-color", "#A50")
    .style("color", "#fff")
    .style("padding", "10px")
    .style("font", "12px sans-serif")
    .style("display", "none");


/**********************************************************
 
                     Class Podium

**********************************************************/

class Podium {

    svg_dim = document.querySelector("#svg").getBoundingClientRect() 

    constructor(svg,time ,activities, gender_images, gender_values, country_images,life_expectancy){
        this.time = time;
        this.life_expectancy = life_expectancy;
        this.activities = activities;
        this.gender_images = gender_images;
        this.country_images = country_images;

        // g creations
        this.g_first = svg.append("g")
        this.g_second = svg.append("g")
        this.g_third = svg.append("g")
        this.g_last = svg.append("g")


        // Image podium
        this.image_podium = svg.append("image")
            .attr("href","images/podium.png")
            .attr("x","0")
            .attr("y","0")
            .attr("width","55%")
            .attr("height","55%")
            .attr("id","image_podium")

        this.image_thumb = svg.append("image")
            .attr("href","images/bad2.png")
            .attr("x","1250")
            .attr("y","420")
            .attr("width","10%")
            .attr("height","10%")
        
        this.img_dim = document.querySelector("#image_podium").getBoundingClientRect()

        // Images flags
        this.image_podium_first = this.g_first.append("image")
            .attr("width","7%")
            .attr("height","18%")

        this.image_podium_second = this.g_second.append("image")
            .attr("width","7%")
            .attr("height","18%")

        this.image_podium_thrid = this.g_third.append("image")
            .attr("width","7%")
            .attr("height","18%")

        this.image_podium_last = this.g_last.append("image")
            .attr("width","7%")
            .attr("height","18%")

        //Positionnement
        this.image_podium.attr("transform", "translate(" + 35*this.svg_dim.width/100 + "," + 52*this.svg_dim.height/100 + ")")
        this.g_first.attr("transform", "translate(" + (59*this.svg_dim.width/100) + "," + (39*this.svg_dim.height/100) + ")")
        this.g_second.attr("transform", "translate(" + (45*this.svg_dim.width/100) + "," + (48*this.svg_dim.height/100) + ")")
        this.g_third.attr("transform", "translate(" + (73*this.svg_dim.width/100) + "," + (52*this.svg_dim.height/100) + ")")
        this.g_last.attr("transform", "translate(" + (85*this.svg_dim.width/100) + "," + (65*this.svg_dim.height/100) + ")")
        
        // Update view
        this.updateView(0)

    }


    recherche_top(indice_activity){
        let number_country = this.time.length /2
        let diff = []

        let a = time.map(a => a[this.activities[indice_activity]])

        for (let i = 0; i < number_country; i++) {
            diff.push(Math.abs(a[i]- a[i+number_country]))
          }

        const arrayCopy = [...diff];
        const min_1 = diff.indexOf(arrayCopy.sort((a,b) => a-b)[0]) 
        const min_2 = diff.indexOf(arrayCopy.sort((a,b) => a-b)[1])
        const min_3 = diff.indexOf(arrayCopy.sort((a,b) => a-b)[2]) 
        const max = diff.indexOf(Math.max(...diff));
    
        // top1
        let top1 = [time[min_1]["geo"],diff[min_1],time[min_1][this.activities[indice_activity]],time[min_1 + number_country][this.activities[indice_activity]]]
        // top2
        let top2 = [time[min_2]["geo"],diff[min_2],time[min_2][this.activities[indice_activity]],time[min_2 + number_country][this.activities[indice_activity]]]
        // top3
        let top3 = [time[min_3]["geo"],diff[min_3],time[min_3][this.activities[indice_activity]],time[min_3 + number_country][this.activities[indice_activity]]]
        //last     
        let last = [time[max]["geo"],diff[max],time[max][this.activities[indice_activity]],time[max + number_country][this.activities[indice_activity]]]
          
        return  [top1,top2,top3,last]    
    }


    updateView(indice_activity) {

        // Get top3 and last
        let values = this.recherche_top(indice_activity)

        let country_1 = values[0][0]
        let country_2 = values[1][0]
        let country_3 = values[2][0]
        let country_last = values[3][0]

        this.image_podium_first.attr("href",this.country_images.find(o => o.country === country_1).image)
        this.image_podium_second.attr("href",this.country_images.find(o => o.country === country_2).image)
        this.image_podium_thrid.attr("href",this.country_images.find(o => o.country === country_3).image)
        this.image_podium_last.attr("href",this.country_images.find(o => o.country === country_last).image)
    } 
}


/**********************************************************
 
                     Class FunFacts

**********************************************************/

class FunFacts {

    constructor(svg,div, time, activities, life_expectancy){
        this.div = div;
        this.time = time;
        this.activities = activities
        this.life_expectancy = life_expectancy;
        this.svg = svg;

        this.div.style("display","inline")
                .style("opacity", 1)
                .style("pointer-events", "none")
                .style("position", "absolute")
                .style("width","450")
                .style("height","300")
                .style("left", "1030px")
                .style("top", "210px")
        
        this.svg.append("rect")
                .attr("x", 1000)
                .attr("y", 5)
                .attr("width", 465)
                .attr("height", 100)
                .attr("fill","none")
                .attr("stroke","grey")
                .attr("stroke-width","2");
        
        this.svg.append("rect")
                .attr("x", 1000)
                .attr("y", 105)
                .attr("width", 465)
                .attr("height", 20)
                .attr("fill","grey")
                .attr("stroke","grey")
                .attr("stroke-width","2")
        
        this.svg.append("text").attr("x", 1200).attr("y", 120).text("Fun Facts").style("color","white")

        svg.append("image")
            .attr("href","images/refresh.png")
            .attr("x","1400")
            .attr("y","75")
            .attr("width","5%")
            .attr("height","5%")
            .attr("id","refresh")
        
        let self = this
            
        document.getElementById("refresh").onclick = function() {
            self.updateQ()
             };

        // append <p>
        this.q = this.div.append("q")
                .style("font-size","25")

        //Generate fun fact
        this.updateQ()
    }

    getRandomActivities(){
        return this.activities[getRandomInt(this.activities.length)]
    }


    getRandomCountryAndSex(){
        return this.time[getRandomInt(this.time.length)]
    }

    getFunFact(){
        const activity = this.getRandomActivities()
        const country_and_sex = this.getRandomCountryAndSex()
 
        const value = country_and_sex[activity] 
        return [activity,country_and_sex,value]
    }

    getFormatedFunFact(){
        const funFact = this.getFunFact()
        const time = getFormatedDate(funFact[2])
        const year = time[0]
        const month = time[1]
        const days = time[2]
        const hours = time[3]
        const country = funFact[1].geo
        const gender = funFact[1].sex
        const activity = funFact[0].replace(new RegExp('_', 'g'), " ")

        return  "<b>" + gender + "</b> from <b>" + country + "</b> spend, on average, " + year + " year(s) " + month + " month(s) " + days  + " day(s) and " + hours + " hour(s) <b>" + activity + "</b>"
    }

    updateQ(){
        this.q.html(this.getFormatedFunFact())
    }
}
/**********************************************************
 
                     Class SelectActivityAndGender

**********************************************************/

class SelectActivityAndGender {

    indice_gender = 0;
    indice_activity = 0;
    svg_dim = document.querySelector("#svg").getBoundingClientRect() 

    constructor(svg, map, podium, gender_images, activities){
        this.svg = svg;
        this.gender_images = gender_images
        this.activities = activities
        this.map = map;
        this.podium = podium;

        // g creation
        this.g_activity = svg.append("g")

        this.width = (window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth)/25;

        this.height = (window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight)/15;
          
         // Activity polygons
         this.previous_activity = this.g_activity.append("polygon")
             .attr("id","activity_left")
             .attr("class","button")
             .attr("points", -this.width  + " " + this.height/2 + ", " + -this.width/2  + " " + (this.height/2 + this.height/5 ) + ", " + -this.width/2  + " " + (this.height/2 - this.height/5 )  )
 
         this.next_activity = this.g_activity.append("polygon")
             .attr("id","activity_right")
             .attr("class","button")
             .attr("points", (this.width + this.width)  + " " + this.height/2 + ", " + (this.width + this.width/2)  + " " + (this.height/2 + this.height/5 ) + ", " + (this.width + this.width/2)  + " " + (this.height/2 - this.height/5 )  )
         
        this.g_activity.append("rect")
             .attr("x", -75)
             .attr("y", -5)
             .attr("width", 220)
             .attr("height", 60)
             .attr("fill","none")
             .attr("stroke","grey")
             .attr("stroke-width","5");

        // Positionnement
        this.g_activity.attr("transform", "translate(" + 50*this.svg_dim.width/100 + "," + 5*this.svg_dim.height/100 + ")")

        // Update initial view
        this.updateView();

        // Events
        function onMouseLeave(button) {
            button.style("fill","black")
        }
    
        function onMouseMove(button) {
            button.style("fill","red")
        }
    
        function onMouseClick(button) {
            
            if(button === this.previous_activity) {
                this.indice_activity -=1;
                if(this.indice_activity === -1) {this.indice_activity = this.activities.length - 1}
    
            }else if(button === this.next_activity) {
                this.indice_activity +=1;
                if(this.indice_activity === this.activities.length) {this.indice_activity = 0}
            }

            // Suppression text and tspan
            d3.selectAll("tspan").remove();
            d3.selectAll("text").remove();
        
            this.map.updateView(this.indice_activity)
            this.updateView();    
            this.podium.updateView(this.indice_activity)
        }
    
        this.next_activity.on("mouseleave",onMouseLeave.bind(this,this.next_activity));
        this.next_activity.on("mousemove",onMouseMove.bind(this,this.next_activity));
        this.next_activity.on("click", onMouseClick.bind(this,this.next_activity));
        this.previous_activity.on("mouseleave",onMouseLeave.bind(this,this.previous_activity));
        this.previous_activity.on("mousemove",onMouseMove.bind(this,this.previous_activity));
        this.previous_activity.on("click", onMouseClick.bind(this,this.previous_activity));
    }

    updateView(){
        this.UpdateActivityText()
    }

    UpdateActivityText() {
        let text_activity = this.g_activity.append("text")
            .style("font-size", "15px")
            .style("text-anchor", "middle")
            .attr("y", 2*this.height/3)

        let data = cutSentence(this.activities[this.indice_activity].replace(new RegExp('_', 'g'), " "))
        text_activity.selectAll("tspan")
            .data(data)
            .enter()
            .append("tspan")
            .attr("x",this.width/2)
            .attr("dy",function(d,i){ 
                if(i != 0){
                    return "1em";}
                else {
                    
                    return -0.65* (data.length)  +"em"}
                })
            .html(function(d,i){ return d; })
    }
}

/**********************************************************
 
                     Class Map

**********************************************************/


class Map{

    constructor(svg, time, activities, life_expectancy,map, country_images){
        this.svg = svg;
        this.time = time;
        this.activities = activities;
        this.life_expectancy = life_expectancy;
        this.map = map;
        this.country_images = country_images;

        this.path = d3.geoPath();



        const projection = d3.geoEquirectangular()  // Lambert-93
            .center([11, 54])
            .scale(800)
            .translate([350,250])
            
        this.path.projection(projection);
        this.updateView(0)

    }


    updateView(indice_activity) {
        // remove previous view
        d3.selectAll(".map").remove();  

        self = this;
        
        let number_country = this.time.length /2
        let diff = []
        let sex = []

        let a = time.map(a => a[this.activities[indice_activity]])

        for (let i = 0; i < number_country; i++) {
            diff.push(Math.abs(a[i]- a[i+number_country]))
            if(a[i]- a[i+number_country] > 0){
                sex.push(1)
            }else if((a[i]- a[i+number_country] < 0)){
                sex.push(2)
            }else{
                sex.push(0)
            }
          }

        
        let scale_color = d3.scaleLinear()
             .domain([d3.min(diff), d3.max(diff)])
             .range(["white", "blue"])
                 
        
        // PATH
        this.svg.selectAll("path")      
        .data(this.map.features.filter(function(d) { 
            console.log()
            let countries = self.country_images.map(a => a.country);
            return countries.includes(d.properties.NAME_ENGL)  }))
        .enter()
        .append("path")
        .attr("d", this.path)
        .attr("id",function(d) { 
            return d.properties.NAME_ENGL
            })
        .attr("class","map")
        .attr("stroke","grey")
        .attr("fill",(d,i) =>scale_color(diff[time.findIndex(x => x.geo ===d.properties.NAME_ENGL)]))
        .on("mouseover",(d,i) => handleMouseOver(this,tooltip, d,diff[time.findIndex(x => x.geo ===d.properties.NAME_ENGL)]))
        .on("mouseout", (d,i) => handleMouseOut(tooltip, d))
            

        // GENDER
        this.svg.selectAll("test")         
        .data(self.country_images.map(a => a.country))
        .enter()
        .append("image")
        .attr("href",(d,i) => gender_images[sex[i]]) 
        .attr("width",20)
        .attr("height",20)
        .attr("x",function(d,i){
            console.log(country_center_coordinates[i][0])
            return country_center_coordinates[i][0]
        })
        .attr("y",(d,i) => country_center_coordinates[i][1])
        .attr("class","map")


        // LEGEND
     
    let linear_gradient_legend = this.svg.append("linearGradient")
        .attr("id", name + "_gradient_legend")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 30).attr("y1", 30)
        .attr("x2", 30).attr("y2", 130)
        .attr("class","map")

    linear_gradient_legend.append("stop")
        .attr('offset', '0')
        .attr("stop-color", "white")
        .attr("stop-opacity", "0.8")
        .attr("class","map")

    linear_gradient_legend.append("stop")
        .attr('offset', '1')
        .attr("stop-color", "blue")
        .attr("stop-opacity", "0.8")
        .attr("class","map");

    this.svg.append("rect")
        .attr("x", 20)
        .attr("y", 30)
        .attr("width", 20)
        .attr("height", 100)
        .attr("fill", "url(#" + name + "_gradient_legend)")
        .attr("class","map")
        .attr("stroke","grey");

    this.svg.append("rect")
        .attr("x", 10)
        .attr("y", 5)
        .attr("width", 240)
        .attr("height", 130)
        .attr("class","map")
        .attr("fill","none")
        .attr("stroke","grey");
    
    this.svg.append("image")
    .attr("href", gender_images[0]) 
    .attr("width",20)
    .attr("height",20)
    .attr("x", 20)
    .attr("y", 7)

    this.svg.append("text").attr("x", 50).attr("y", 40).text(getFormatedDate(d3.min(diff))[0] + " years " + getFormatedDate(d3.min(diff))[1] + " months")
        .style("font-size", "15px").attr("alignment-baseline", "left").attr("class", "map")
    this.svg.append("text").attr("x", 50).attr("y", 85).text(getFormatedDate(Math.round(d3.mean(diff)))[0] + " years " + getFormatedDate(Math.round(d3.mean(diff)))[1] + " months")
        .style("font-size", "15px").attr("alignment-baseline", "left").attr("class", "map")
    this.svg.append("text").attr("x", 50).attr("y", 130).text(getFormatedDate(d3.max(diff))[0] + " years " + getFormatedDate(d3.max(diff))[1] + " months")
        .style("font-size", "15px").attr("alignment-baseline", "left").attr("class", "map")
    this.svg.append("text").attr("x", 50).attr("y", 18).text("Gender that spend the most time")
        .style("font-size", "15px").attr("alignment-baseline", "left").attr("class", "map")


    }   
}

/**********************************************************
 
                     Fonctions

**********************************************************/

function handleMouseOver(obj,tooltip,d,diff){    
    date = getFormatedDate(diff)
    tooltip.html("<strong>Country : </strong>" + d.properties.NAME_ENGL +  "<br>" + 
                 "<strong>Différence :   </strong>" + date[0] + " Year(s) "  +  " " + date[1] + " Month(s) <br>" + 
                 date[2] + " Day(s) :" +  date[3] +" Hour(s)")

    tooltip.style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px")
        .style("display", "inline"); ;
        d3.select(event.currentTarget).attr("stroke","red")
        d3.select(event.currentTarget).attr("stroke-width","1.5")

}

function handleMouseOut(tooltip,d){
    tooltip.style("display", "none");   
    d3.select(event.currentTarget).attr("stroke","grey")
    d3.select(event.currentTarget).attr("stroke-width","0.25")
}

function getFormatedDate(total){
    year =  Math.trunc(total / 525600 )
    month = Math.trunc((total - year * 525600) / 43800)
    days = Math.trunc((total - year * 525600 - month * 43800) / 1440);
    hours = Math.trunc((total - year * 525600 - month *43800 - days * 1440)/60)
    return [year,month,days,hours]
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function getValueTimeYear(data){
    const values = data.split(":")
    return Number(values[1]) + Number(values[0]*60)
}

getValueTimeYear("24:00")

function cutSentence(string){
    return string.match(/.{1,15}(\s|$)/g)
}
 
function draw_section_title(title){
    d3.select("section")
      .append("h1")
      .attr("class", "section_title")
      .html(title)
}

function append_svg(id){
    return d3.select("section")
             .append("svg")
             .attr("id", id)
}

function calculateTimeExpectancy(){
    time.forEach(element => {
        console.log(life_expectancy)
        let expectancy = life_expectancy.find(o => o.country === element["geo"])[element["sex"]];
        console.log(expectancy)
        for (var property in element) {
            if(`${property}` == "sex" || `${property}` == "geo"){
                continue;}
            else{                   
                element[property] *= Math.round(expectancy * 365)
            }            
          }
    });
}

/**********************************************************
 
                Création section et SVG

**********************************************************/

function start(){

    // Calculate expectancy
    calculateTimeExpectancy()

    //Podium
    draw_section_title("<br>Time use in a life time</br>")
    let svg = append_svg("svg")
         
    //Fun facts
    let div_funfacts = d3.select("section")
                         .append("div")
                         .attr("id", "div_funfacts")

    podium = new Podium(svg,time ,activities, gender_images, gender_values, country_images,life_expectancy) 
    funFacts = new FunFacts(svg,div_funfacts, time, activities, life_expectancy)
    map  = new Map(svg, time, activities, life_expectancy, map, country_images)
    select = new SelectActivityAndGender(svg, map, podium, gender_images, activities)

}

    
/**********************************************************
 
                      Imports .csv

**********************************************************/

d3.csv("data/TimeUse.csv")
    .row( (d,i) => {
        return{
            sex: d['SEX'],
            geo: d["GEO/ACL00"],
            total: +getValueTimeYear(d["Total"]),
            //Personal_care: +getValueTimeYear(d["Personal care"]),
            Sleeping: +getValueTimeYear(d["Sleep"]),
            Eating: +getValueTimeYear(d["Eating"]),
            //Other_or_unspecified_personal_care: +getValueTimeYear(d["Other and/or unspecified personal care"]),
            //Employment_related_activities_and_travel: +getValueTimeYear(d["Employment, related activities and travel as part of/during main and second job"]),
            //Main_and_second_job_and_related_travel: +getValueTimeYear(d["Main and second job and related travel"]),
            //Activities_related_to_employment_and_unspecified_employment: +getValueTimeYear(d["Activities related to employment and unspecified employment"]),
            Studing: +getValueTimeYear(d["Study"]),
            //School_and_university_except_homework: +getValueTimeYear(d["School and university except homework"]),
            Doing_homework: +getValueTimeYear(d["Homework"]),
            Doing_free_time_study: +getValueTimeYear(d["Free time study"]),
            //Household_and_family_care: +getValueTimeYear(d["Household and family care"]),
            //Food_management_except_dish_washing: +getValueTimeYear(d["Food management except dish washing"]),
            Washing_dishes: +getValueTimeYear(d["Dish washing"]),
            Cleaning_dwelling: +getValueTimeYear(d["Cleaning dwelling"]),
            //Household_upkeep_except_cleaning_dwelling: +getValueTimeYear(d["Household upkeep except cleaning dwelling"]),
            //Laundry: +getValueTimeYear(d["Laundry"]),
            Ironing: +getValueTimeYear(d["Ironing"]),
            //Handicraft_and_producing_textiles_and_other_care_for_textiles: +getValueTimeYear(d["Handicraft and producing textiles and other care for textiles"]),
            Gardening: +getValueTimeYear(d["Gardening; other pet care"]),
            Tending_domestic_animal: +getValueTimeYear(d["Tending domestic animals"]),
            Caring_for_pets: +getValueTimeYear(d["Caring for pets"]),
            Walking_the_dog: +getValueTimeYear(d["Walking the dog"]),
            //Construction_and_repairs: +getValueTimeYear(d["Construction and repairs "]),
            Doing_shopping_and_services: +getValueTimeYear(d["Shopping and services"]),
            //Childcare_except_teaching_reading_and_talking: +getValueTimeYear(d["Childcare, except teaching, reading and talking"]),
            Teaching_reading_and_talking_with_child: +getValueTimeYear(d["Teaching, reading and talking with child"]),
            //Household_management_and_help_family_member: +getValueTimeYear(d["Household management and help family member"]),
            //Leisure_social_and_associative_life: +getValueTimeYear(d["Leisure, social and associative life"]),
            //Organisational_work: +getValueTimeYear(d["Organisational work"]),
            //Informal_help_to_other_households: +getValueTimeYear(d["Informal help to other households"]),
            Participatory_activities: +getValueTimeYear(d["Participatory activities"]),
            Visiting_and_feast: +getValueTimeYear(d["Visiting and feasts"]),
            //Other_social_life: +getValueTimeYear(d["Other social life"]),
            //Entertainment_and_culture: +getValueTimeYear(d["Entertainment and culture"]),
            Resting: +getValueTimeYear(d["Resting"]),
            Walking_and_hiking: +getValueTimeYear(d["Walking and hiking"]),
            Practicing_sports_and_outdoor_activities_except_walking_and_hiking: +getValueTimeYear(d["Sports and outdoor activities except walking and hiking"]),
            Playing_computer_games: +getValueTimeYear(d["Computer games"]),
            Computing: +getValueTimeYear(d["Computing"]),
            //Hobbies_and_games_except_computing_and_computer_games: +getValueTimeYear(d["Hobbies and games except computing and computer games"]),
            Reading_books: +getValueTimeYear(d["Reading books"]),
            Reading_exept_books: +getValueTimeYear(d["Reading, except books"]),
            Watching_TV_and_video: +getValueTimeYear(d["TV and video"]),
            Listening_radio_and_music: +getValueTimeYear(d["Radio and music"]),
            //Unspecified_leisure: +getValueTimeYear(d["Unspecified leisure "]),
            //Travel_except_travel_related_to_jobs: +getValueTimeYear(d["Travel except travel related to jobs"]),
            //Travel_to_from_work: +getValueTimeYear(d["Travel to/from work"]),
            //Travel_related_to_study: +getValueTimeYear(d["Travel related to study"]),
            //Travel_related_to_shopping_and_services: +getValueTimeYear(d["Travel related to shopping and services"]),
            Transporting_a_child: +getValueTimeYear(d["Transporting a child"]),
            //Travel_related_to_other_household_purposes: +getValueTimeYear(d["Travel related to other household purposes"]),
            //Travel_related_to_leisure_social_and_associative_life: +getValueTimeYear(d["Travel related to leisure, social and associative life"]),
            //Unspecified_travel: +getValueTimeYear(d["Unspecified travel"]),
            //Unspecified_time_use: +getValueTimeYear(d["Unspecified time use"])
        };
}).get( (error, rows) => {
    time = rows    

    let removed = Object.keys(time[0])
    removed.shift()
    removed.shift()
    removed.shift()
    activities = removed

    d3.csv("data/life_expectancy.csv")
    .row( (d,i) => {
        return{
            country: d["country"],
            Males: +d["Males"],
            Females: +d["Females"]

        };
    }).get( (error, rows) => {
        life_expectancy = rows 
        
        d3.json("data/CNTR_RG_20M_2016_4326.geojson")
        .get( (error, rows) => {
            map = rows;
            start()
    
        })
    })
})    
