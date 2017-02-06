var margin = {top: 10, right: 40, bottom: 150, left: 70},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var svg = d3.select(".bar-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define X and Y SCALE.
var xScale = d3.scale.ordinal() 
    .rangeRoundBands([0, width], 0.1); 

var yScale = d3.scale.linear() 
    .range([height, 0]);
	

// Define X and Y AXIS
var xAxis = d3.svg.axis()
    .scale(xScale) 
    .orient("bottom"); 

var yAxis = d3.svg.axis() 
    .scale(yScale) 
    .orient("left")
    .ticks(5, ""); 
	
	d3.csv("cropData.csv", function(error, data){
	
    data.forEach(function(d) { 
        d.key = d.key; 
        d.value = +d.value;
    });

// Return X and Y SCALES 
    xScale.domain(data.map(function(d){ return d.key; })); 
    yScale.domain([0,d3.max(data, function(d) {return d.value ; })]);
    
// Creates rectangular bars to represent the data. 
  svg.selectAll('rect') 
        .data(data)
        .enter() 
        .append('rect')
        .attr("height", 0)  
        .attr("y", height)
  		.attr("fill", "#7b6888")
        .attr({
            "x": function(d) { return xScale(d.key) ; },
            "y": function(d) { return yScale(d.value); },
	  		"width": 60,
            "height": function(d) { return  height - yScale(d.value); },
        });
    
//places white text labels inside each bar containing the value of that bar
   	svg.selectAll("text")
		.data(data) 
		.enter()
		.append("text")
		.text(function(d) { return d.value; }) 
		.attr("text-anchor", "middle")
		.attr("x", function(d) { return xScale(d.key)+ 30 ; }) //sets the x position of each label
		.attr("y", function(d) { return yScale(d.value) ; })//sets the y position of each label
		.attr("font-family", "Tahoma")
		.attr("font-size", "10px")
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
        .attr("transform", "rotate(-60)"); // Rotates the labels -60 degrees
       
// Draw yAxis and position the label (2 points)
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
//vertical label
        .append("text")
        .attr("transform", "rotate(-90)") //rotate 90 degrees to make vertical
        .attr("dx", -height/2)
        .attr("dy", margin.left-130)
        .style("text-anchor", "middle") //centers label 
		.style("font-family", "Tahoma")
        .text("Gallons of Freshwater"); //label text
	});	