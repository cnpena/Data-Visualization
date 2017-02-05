/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

//defines the margin object with properties for the four sides
var margin = {top: 10, right: 40, bottom: 150, left: 70},
	//defines width and height as the inner dimensions of the chart area. width and height are total size of the canvas minus the margin space
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together.
// translates the origin to the top-left corner of the chart area.
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.

var xScale = d3.scale.ordinal() //xScale is ordinal ie name of categories rather than numerical
    .rangeRoundBands([0, width], 0.1); //  sets the scale’s range to [0, width], allows rounding of the values

var yScale = d3.scale.linear() //yScale is linear ie continuous
    .range([height, 0]); // sets the range of the scale

// Define X and Y AXIS

var xAxis = d3.svg.axis() // xAxis on the bottom of the graph
    .scale(xScale) //sets scale equal to the xScale of the values
    .orient("bottom"); 

var yAxis = d3.svg.axis() //yAxis on the left side of the graph
    .scale(yScale) //sets scale equal to the yScale of the values
    .orient("left")
    .ticks(5, "$"); //defines tick interval of 5 and units (dollars)


/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// parses csv data ie comma-separated data (key, value)
// data.csv contains the country name(key) and its GDP(value)

d3.csv("GDP2016TrillionUSDollars.csv",function(error, data){ //invokes the d3.csv request. Function is pointed to the data file containing the information for the graph
	
// ensures that all values pulled from the csv file are set and formatted correctly.
    data.forEach(function(d) { //sets the data variable that is being dealt with (data). tells the code that for each group within the data array, carry out function d on them.
        d.key = d.key; //sets the key 
        d.value = +d.value; //sets value, the + operator ensures it is a numeric value
    });

    
// Return X and Y SCALES 
//scale is mathematical relationship with data - not visual
    xScale.domain(data.map(function(d){ return d.key; })); //x domain is just the names of each country
    yScale.domain([0,d3.max(data, function(d) {return d.value ; })]); // y domain goes from 0 to the maximum in the data range
    
// Creates rectangular bars to represent the data. 
  svg.selectAll('rect') //applies this to all rects created
        .data(data) //data from the csv file specified earlier
        .enter() // allows "yet-to-be-added" elements
        .append('rect') //adds a rect
        .attr("height", 0)  
        .attr("y", height)
        .attr({
            "x": function(d) { return xScale(d.key); }, //sets x value of bar
            "y": function(d) { return yScale(d.value); }, //sets y value of bar
            "width": xScale.rangeBand(), 
            "height": function(d) { return  height - yScale(d.value); },
      
// uses the fill attribute to create increasing shade of blue for higher values, closer to black for lower values. Changes the blue value based on the data value
            "fill": function(d) { return "rgb(0, 0, " + Math.floor(d.value * 50) + ")"; }
        });
    
//places white text labels inside each bar containing the value of that bar
   	svg.selectAll("text")
		.data(data) //data from the csv file specified earlier
		.enter()
		.append("text")
		.text(function(d) { return d.value; }) //text should display the value of the data
		.attr("text-anchor", "middle") //centers text inside bar
		.attr("x", function(d) { return xScale(d.key) + 20; }) //sets the x position of each label
		.attr("y", function(d) { return yScale(d.value) + 13; })//sets the y position of each label (based on the scaled height of each bar)
		.attr("font-family", "sans-serif")
		.attr("font-size", "11px")
	    .attr("fill", "white");

//draws xAxis and positions labels
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-60)") // Rotates the labels -60 degrees
        .attr("font-size", "10px");
       
// Draw yAxis and position the label (2 points)
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
//vertical label
        .append("text")
        .attr("transform", "rotate(-90)") //rotate 90 degrees to make vertical
        .attr("dx", -height/2)
        .attr("dy", margin.left-120)
        .style("text-anchor", "middle") //centers label 
        .text("Trillions of US Dollars ($)"); //label text
    
});

        
