function DrawBar(dataset) {
  //our JavaScript section starts and the first thing that happens is that we set the size of the area that we’re going to use for the chart and the margins;
  var margin = { top: 50, right: 20, bottom: 50, left: 100 },
  width = 800,
  height = 400;

  //The next section declares the function to determine positioning in the x and y domain
  var minDate = dataset[0][0].substr(0, 4);
  minDate = new Date(minDate);
  var maxDate = dataset[dataset.length - 1][0].substr(0, 4);
  maxDate = new Date(maxDate);

  // x-axis: start from 0 and keep giong until the last date,
  // if we don't use range everything is upon each other
  var xAxisScale = d3.time.scale().domain([minDate, maxDate]).range([0, width]);
  //y-axis
  var yAxisScale = d3.scale.
  linear().
  domain([
  0,
  d3.max(dataset, function (d) {
    //get the 2nd column of json file
    return d[1];
  })]).

  range([height, 0]);

  //The declarations for our two axes are relatively simple
  //show data (nums) under the x-axis line
  var xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom");
  //show data (nums) left of the y-axis line
  var yAxis = d3.svg.axis().scale(yAxisScale).orient("left");

  var tooltip = d3.select("body").append("div").attr("id", "tooltip").style({
    position: "absolute",
    padding: "4px",
    background: "#fff",
    border: "1px solid #000",
    color: "#000" });


  function mouseoverHandler(d) {
    tooltip.transition().style("opacity", 0.8);
    tooltip.
    style({
      left: d3.event.pageX + 10 + "px",
      top: d3.event.pageY + 15 + "px" }).

    attr("data-date", d[0]).

    html("<p> Date: " + d[0] + "</p>" + "<p> Billions: " + d[1] + "</p>");

    d3.select(this).style("opacity", 0.1);
  }

  function mouseoutHandler(d) {
    tooltip.transition().style("opacity", 0);
    d3.select(this).style("opacity", 1);
  }

  function mouseMoving(d) {
    tooltip.
    style("top", d3.event.pageY - 10 + "px").
    style("left", d3.event.pageX + 10 + "px");
    d3.select(this).style("opacity", 0.8);
  }

  /*
   * The next block of code selects the id #barGraph on the web page
   * and appends an svg object to it of the size
   * that we have set up with our width, height and margin’s.
   *
   * It also adds a g element that provides a reference point for adding our axes.
   */
  var svg = d3.
  select("#barGraph").
  append("svg").
  attr("width", width + margin.left + margin.right).
  attr("height", height + margin.top + margin.bottom).
  attr("class", "graph-svg-component").
  append("g").
  attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /*
   * we add the bars to our chart
   * This block of code creates the bars (selectAll("bar"))
   * and associates each of them with a data set (.data(dataset)).
   * We then append a rectangle (.append("rect"))
   * with values for x/y position and height/width as configured in our earlier code.
   */
  svg.
  selectAll("bar").
  data(dataset).
  enter().
  append("rect").
  style("fill", "orangered").
  attr("class", "bar").
  attr("data-date", function (d, i) {
    return dataset[i][0];
  }).
  attr("data-gdp", function (d, i) {
    return dataset[i][1];
  }).
  attr("x", function (d, i) {
    return xAxisScale(new Date(d[0]));
  }).
  attr("y", function (d) {
    return yAxisScale(d[1]);
  }).
  attr("width", width / dataset.length).
  attr("height", function (d) {
    return height - yAxisScale(d[1]);
  }).
  on("mouseover", mouseoverHandler).
  on("mousemove", mouseMoving).
  on("mouseout", mouseoutHandler);

  //we append our x axis
  /*
   * This is placed in the correct position with:
   * .attr("transform", "translate(0," + height + ")")
   * and the text is positioned (using dx and dy)
   * and rotated:
   * (.attr("transform", "rotate(-45)" );) so that it is aligned vertically.
   */
  svg.
  append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0, " + height + ")").
  call(xAxis).
  selectAll("text").
  style("text-anchor", "end").
  attr("dx", "-0.5em").
  attr("dy", "-.55em").
  attr("y", 30).
  attr("transform", "rotate(-45)");
  //we append our y axis in a similar way and append a label: text("Value (billions)")
  svg.
  append("g").
  attr("id", "y-axis").
  call(yAxis).
  append("text").
  attr("transform", "rotate(-90)").
  attr("y", -85).
  attr("dy", "0.8em").
  attr("text-anchor", "end").
  text("Value (billions)");
}

//we call the data using d3.json and inside the function we call the function DrawBar
d3.json(
"https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
function (data) {
  var dataset = data.data;
  DrawBar(dataset);
});