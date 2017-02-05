/* ----------------------------------------------------------------------------
Celine Peña
CMPS 165
scatterplot.js
-----------------------------------------------------------------------------*/ 

//Define Margin
//defines width and height as the inner dimensions of the chart area. width and height are total size of the canvas minus the margin space
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

//Define Color, categorical colors, category20 means there are 20 options total
    var colors = d3.scale.category20();

//Define Scales   
    var xScale = d3.scale.linear()
        .domain([0, 16]) 			//redefined after the data is loaded
        .range([0, width]); 

    var yScale = d3.scale.linear()
        .domain([0, 450]) 			// redefined after the data is loaded
        .range([height, 0]);

//Define Axis
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2); //xAxis is on the bottom of the graph
    var yAxis = d3.svg.axis().scale(yScale).orient("left").tickPadding(2);	//yAxis is on the left of the graph

//Define zoom
	var zoom = d3.behavior.zoom()
    	.x(xScale)
    	.y(yScale)
    	.scaleExtent([1, 32])
    	.on("zoom", zoomed); //calls zoomed function when user zooms on the graph

//Define SVG, acts as canvas to put graph onto
      var svg = d3.select("body")
	  	.call(zoom)			//allows the user to zoom in on the graph
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//clip path so the circles don't move below the axes
	svg.append("clipPath")
		.attr("id", "chart-area")
		.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height);

//Function zoomed
	function zoomed() {
  		svg.select(".x.axis").call(xAxis); //changes the x axis when the user zooms
  		svg.select(".y.axis").call(yAxis); //changes the y axis when the user zooms
		svg.selectAll(".dot").attr("r", function(d) { return Math.sqrt(d.total)/.2; }) //updates the circles when zoomed
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.epc);})
		svg.selectAll(".text").attr("x", function(d) {return xScale(d.gdp);}) //updates the country names when zoomed, moves with the circles (EXTRA CREDIT)
        .attr("y", function(d) {return yScale(d.epc);});
	}

    
//Get Data
	d3.csv("scatterdata.csv", function(error, scatterdataset){ //invokes the d3.csv request to get data
    	scatterdataset.forEach(function(d) { 
        d.country = d.country; //set values from .csv file
		d.gdp = +d.gdp;
		d.population = +d.population;
		d.epc = +d.epc;
		d.total = +d.total;
    });
    
//Define domain for xScale and yScale after the data is loaded 
   		xScale.domain([0, d3.max(scatterdataset, function(d) {return d.gdp + 5; })]);
   		yScale.domain([0, d3.max(scatterdataset, function(d) {return d.epc + 50; })]);
		
//Draw Scatterplot
    svg.selectAll(".dot") 
        .data(scatterdataset)
        .enter().append("circle") //adds circles to the graph
        .attr("class", "dot")
		.attr("clip-path", "url(#chart-area)") //clip path so circles don't move below the axes
        .attr("r", function(d) { return Math.sqrt(d.total)/.2; }) //set radius of circle
        .attr("cx", function(d) {return xScale(d.gdp);}) 		//set x position of circle
        .attr("cy", function(d) {return yScale(d.epc);})		//set y position of circle
        .style("fill", function (d) { return colors(d.country); }) //fill circle with color designated earlier
		.style("stroke", "none")									//no black outline on the circles
		.on("mouseover", function(d) { //on mouseover, should display tooltip that displays name, population, GDP, EPC and TOTAL
		
			//Get this bar's x/y values, then augment for the tooltip
			var xPosition = parseFloat(d3.select(this).attr("cx"));
			var yPosition = parseFloat(d3.select(this).attr("cy"));

			d3.select("#tooltip")
  				.style("left", xPosition + "px") //Update the tooltip position and value
  				.style("top", yPosition + "px")
  				.select("#country")
				.text(d.country);				//country name
			d3.select("#tooltip")
				.select("#population")
				.text("Population: " + d.population + " Million"); //population
			d3.select("#tooltip")
				.select("#gdp")
				.text("GDP: $" + d.gdp + " Trillion");				//GDP
			d3.select("#tooltip")
				.select("#epc")
				.text("EPC: " + d.epc + " Million BTUs");			//EPC
			d3.select("#tooltip")
				.select("#total")
				.text("Total: " + d.total + " Trillion BTUs");		//total energy consumption
		
			d3.select("#tooltip").classed("hidden", false);})       //Show the tooltip
		
		.on("mouseout", function() {								//when no longer hovering over the circle, should hide the tooltip
	
			d3.select("#tooltip").classed("hidden", true);

	});
		

 //Display Country Names
    svg.selectAll(".text")
        .data(scatterdataset) 
        .enter().append("text")
        .attr("class","text")
		.attr("clip-path", "url(#chart-area)") //clip path so the text doesn't move below the axes
        .style("text-anchor", "middle")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc) + 3;})
        .style("fill", "black")
        .text(function (d) { if(d.total > 30) return d.country ; }); //name of each country displayed with the circle if over a certain value in order to make the graph clutter-free.

 //x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("GDP (in Trillion US Dollars) in 2010");

 //y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Energy Consumption per Capita (in Million BTUs per person)");

    
 //draw legend colored rectangles
    svg.append("rect")
        .attr("x", width-250)
        .attr("y", height-190)
        .attr("width", 220)
        .attr("height", 180)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-100)
        .attr("cy", height-175)
        .style("fill", "white");
    
    svg.append("circle")
        .attr("r", 15.8)
        .attr("cx", width-100)
        .attr("cy", height-150)
        .style("fill", "white");

    svg.append("circle")
        .attr("r", 50)
        .attr("cx", width-100)
        .attr("cy", height-80)
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-172)
        .style("text-anchor", "end")
        .text(" 1 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text(" 10 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text(" 100 Trillion BTUs");
    
     svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "steelblue") 
        .attr("font-size", "16px")
        .text("Total Energy Consumption"); 
})
