var width = 500,
          height = 300,
          radius = Math.min(width, height) / 2;


      var color = d3.scale.ordinal()
          .range(["#becada", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

          d3.csv("carbonEmissionsData.csv", type, function(error, data) {
              if (error) throw error;

                  var arc = d3.svg.arc()
                  .outerRadius(radius - 10)
                  .innerRadius(0);

                  var labelArc = d3.svg.arc()
                  .outerRadius(radius - 40)
                  .innerRadius(radius - 40);

                  var pie = d3.layout.pie()
                  .sort(null)
                  .value(function(d) { return d.percent; });

                  var svg = d3.select(".pie-container").append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(" + (width / 2 + 50) + "," + (height / 2 - 20) + ")");	

                  var g = svg.selectAll(".arc")
                  .data(pie(data))
                  .enter().append("g")
                  .attr("class", "arc")
                  .on("mouseover", function(d) { //on mouseover, should display tooltip 
                      var x = event.clientX;
                      var y = event.clientY; 

                      d3.select("#tooltip-pie")
                      .style("left", x + "px") //tooltip appears where cursor is
                      .style("top", (y + 750) + "px")
                      .select("#id")			//#id defined in html for text label
                      .text(d.data.id);		//displays the id from data set
                      d3.select("#tooltip-pie")
                      .select("#percent")
                      .text(d.data.percent + "%"); //percent
                      d3.select("#tooltip-pie")
                      .select("#number")
                      .text(d.data.number + " pounds");  //pounds of carbon

                      d3.select("#tooltip-pie").classed("hidden", false); }) //actually display the tool tip

                  .on("mouseout", function() { //when no longer hovering over, should hide the tooltip
                      d3.select("#tooltip-pie").classed("hidden", true);
                  });


        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(d.data.number); });

        g.append("text")
            .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .text(function(d) { return d.data.percent + "%"; });
      });

      function type(d) {
        d.percent = +d.percent;
        return d;
      }