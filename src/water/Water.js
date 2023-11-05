import * as d3 from "d3";

const width = 400;
const height = 300;
const margin = 10;
const marginRight = 70;

export default class Energy {
  container;
  svg;
  data;
  constructor(container) {
    this.container = container;
    this.svg = null;
    this.data = [];

    this.init();
  }

  addRecord(data) {
    let now = Date.now();
    let old = now - 1000 * 60 * 10; // 10 minutes
    this.data.push([now, data]);
    this.data = this.data.filter((d) => d[0] > old);
  }

  init() {
    this.svg = d3
      .select(this.container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "energy")
      .attr("transform", (d, i) => `translate(${margin}, ${margin} )`);
  }

  update(data) {
    // console.log("Update", data);
    if (data.hasOwnProperty("sensor.vannforbruk_3m")) {
      this.addRecord(parseFloat(data["sensor.vannforbruk_3m"].state, 10));
    }

    console.log("Water data", this.data);
    // console.log("wscg", this.svg);
    // Scales
    const xScale = d3.scaleTime().rangeRound([0, width - margin - marginRight]);
    const yScale = d3.scaleLinear().rangeRound([height - margin - margin, 0]);

    let now = Date.now();
    let old = now - 1000 * 60 * 10; // 10 minutes
    // let old = now - 1000 * 10; // 10 seconds

    // Set domains for the scales
    xScale.domain([old, now]);
    yScale.domain([0, 10]);

    // console.log("wscg", this.svg);
    // Define the line
    const line = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    var colorScale = d3.scaleLinear().domain([0, 250]).range(["green", "red"]);

    const area = d3
      .area()
      .x((d) => xScale(d[0]))
      .y0(height - margin - margin) // this makes the area go down to the x-axis
      .y1((d) => yScale(d[1]));

    // Add the line path
    let x = this.svg
      .selectAll("g.x2")
      .data([this.data])
      .join("g")
      .attr("class", "x2");

    x.selectAll("path")
      .data((d) => [d])
      .join("path")
      .attr("fill", "steelblue")
      .attr("fill-opacity", 0.4)
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)

      .attr("d", area);
    // .attr("d", line);
    x.selectAll("text")
      .data((d) => [d])
      .join("text")
      .attr("font-size", 16)
      .attr("dominant-baseline", "middle")
      .attr("x", width - marginRight)
      .attr("y", (d) => yScale(d[d.length - 1][1]))
      .attr("fill", "white")
      .text((d) => d[d.length - 1][1] + " l/min");
  }
}
