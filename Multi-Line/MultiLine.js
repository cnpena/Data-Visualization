/* ----------------------------------------------------------------------------
File: MultiLine.js
Contructs a Multi-Line chart using D3
By Celine Pena 1414950 cnpena@ucsc.edu
-----------------------------------------------------------------------------*/ 

/*MARGIN SETUP*/
//defines the margin object with properties for the four sides
var margin = {top: 20, right: 80, bottom: 70, left: 100},
		//defines width and height as the inner dimensions of the chart area. width and height are total size of the canvas minus the margin space
    width = 980 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;


// Define SVG. "g" means group SVG elements together.
// translates the origin to the top-left corner of the chart area.
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*CREATING X and Y SCALES*/
var x = d3.time.scale() //XScale is a time scale of years
    .range([0, width]); //range is from 0 to width of the chart

var y = d3.scale.linear() //yScale is linear ie continuous
    .range([height, 0]); //range is from height to 0

var color = d3.scale.category10(); //Constructs a new ordinal scale with a range of ten categorical colors

/*CREATING X AND Y AXES*/
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom") // x Axis is on the bottom of the chart
	.innerTickSize(-height); //creates the vertical graph lines- negative height so it will be drawn from the bottom to the top

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left") // y Axis is on the left of the chart
	.innerTickSize(-width); //creates the horizontal graph lines- negative so they're drawn from the right to left


/*IMPORTING DATA*/
//getting the data from a .csv file (comma separated file)
d3.csv("EPC_2000_2010_new.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
	var parseDate = d3.time.format("%Y").parse; //time format within the file is "year with century as a decimal number."
    d.date = parseDate(d.date); //parses the date to use as d.date for each key
  });

	// each country has a name and energy value for each year
 var countries = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, energy: +d[name]};
      })
    };
  });
	
	//draws data line
	var line = d3.svg.line()
    .interpolate("basis") //"basis" generally smooths the line out- doesn't allow for sharp curves anywhere
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.energy); });


/*SETS X and Y DOMAIN*/
  x.domain(d3.extent(data, function(d) { return d.date; })); //Returns the minimum and maximum value in the given array using natural order

  y.domain([ 
    d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.energy; }); }),
    d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.energy; }); })
  ]);

/*X axis and the label under the x axis*/
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	  .append("text")
	  .attr("x", width/2)
	  .attr("y", margin.bottom - 20)
	  .text("Year");

/*y axis and the label on the left of the y axis */
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
	  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left-150)
	  .attr("x", -(height/2))
      .style("text-anchor", "middle")
      .text("Million BTUs Per Person");

  var country = svg.selectAll(".country") 
      .data(countries)
  		.enter().append("g")
      .attr("class", "country");

  var path = country.append("path") //creates path for each country
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });
    
    var totalLength = path.node().getTotalLength();
	
/*ANIMATION (essentially shows the creation of the lines when first built) */
    path 
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(2000) // 2 second animation
        .ease("basis")
        .attr("stroke-dashoffset", 0)

	/* commented out because I could not get the labels on the far right working correctly */
//    country.append("text")
//      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
//      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.energy) + ")"; })
//	  .attr("x", 3)
//      .attr("dy", ".35em")
//      .text(function(d) { return d.name; });
	
});


