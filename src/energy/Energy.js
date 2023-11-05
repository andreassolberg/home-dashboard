import * as d3 from "d3";

const width = 400;
const height = 300;
const margin = 10;
const marginRight = 70;

export default class Energy {
  container;
  svg;
  data;
  price;
  constructor(container) {
    this.container = container;
    this.svg = null;
    this.data = [];
    this.price = 100;
    this.init();
  }

  addRecord(data) {
    if (typeof data !== "number") {
      return; // Exit the function if data is not a number
    }
    let now = Date.now();
    let old = now - 1000 * 60 * 10; // 10 minutes
    // let old = now - 1000 * 10; // 10 seconds
    this.data.push([now, data]);
    this.data = this.data.filter((d) => d[0] > old);
  }

  setPrice(data) {
    this.price = data;
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
    if (data.hasOwnProperty("sensor.electricity_price_jan_voigts_vei_10")) {
      this.setPrice(
        parseFloat(
          data["sensor.electricity_price_jan_voigts_vei_10"].state,
          10
        ) * 100
      );
    }
    if (data.hasOwnProperty("sensor.power_jan_voigts_vei_10")) {
      this.addRecord(
        parseFloat(data["sensor.power_jan_voigts_vei_10"].state, 10)
      );
    }

    console.log("Energy data", this.data);
    // Scales
    const xScale = d3.scaleTime().rangeRound([0, width - margin - marginRight]);
    const yScale = d3.scaleLinear().rangeRound([height - margin - margin, 0]);

    let now = Date.now();
    let old = now - 1000 * 60 * 10; // 10 minutes
    // let old = now - 1000 * 10; // 10 seconds

    // Set domains for the scales
    xScale.domain([old, now]);
    yScale.domain([0, 12000]);

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

    this.svg
      .selectAll("text.price")
      .data([Math.round(this.price)])
      .join("text")
      .attr("class", "price")
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("x", (width - marginRight - margin) / 2 + margin)
      .attr("y", height - 3 * margin)
      .attr("fill", "white")
      .text((d) => d + " øre / kWh");

    // Add the line path
    let x = this.svg
      .selectAll("g.x2")
      .data([this.data])
      .join("g")
      .attr("class", "x2");

    x.selectAll("path")
      .data((d) => [d])
      .join("path")
      .attr("fill", colorScale(Math.round(this.price)))
      .attr("fill-opacity", 0.4)
      .attr("stroke", colorScale(Math.round(this.price)))
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
      .text((d) => d[d.length - 1][1] + "W");
  }
}
