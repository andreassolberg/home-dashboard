import * as d3 from "d3";

const width = 400;
const height = 300;
const margin = 10;

export default class FondChart {
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

  init() {
    this.svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);
    this.container.append(this.svg.node());
  }

  update(fond) {
    let yScale = d3
      .scaleLinear()
      .domain([0.9, 1.1]) // Input range
      .range([height, 0]); // Output range

    let xScale = d3
      .scaleLinear()
      .domain([0, fond.totalWidth]) // Input range
      .range([0, width]); // Output range

    this.svg
      .selectAll("rect")
      .data(fond)
      .join("rect")
      .attr("x", (d) => xScale(d.cummulative))
      .attr("y", (d) => Math.min(yScale(1), yScale(d.annual)))
      .attr(
        "width",
        (d) => xScale(d.cummulative + d.unit) - xScale(d.cummulative)
      )
      .attr("height", (d) => Math.abs(yScale(1) - yScale(d.annual)))
      .attr("fill", "steelblue")
      .attr("stroke", "black");

    this.svg
      .selectAll("text.l")
      .data(fond)
      .join("text")
      .attr("class", "l")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", 10)
      .attr(
        "x",
        (d) =>
          xScale(d.cummulative) +
          (xScale(d.cummulative + d.unit) - xScale(d.cummulative)) / 2
      )
      .attr("y", (d) => yScale(d.annual) + (d.annual > 1 ? -1 : 1) * 10)
      .text((d) => d.label);

    this.svg
      .selectAll("text.p")
      .data(fond)
      .join("text")
      .attr("class", "p")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr(
        "x",
        (d) =>
          xScale(d.cummulative) +
          (xScale(d.cummulative + d.unit) - xScale(d.cummulative)) / 2
      )
      .attr("y", (d) => yScale(d.annual) + (d.annual > 1 ? -1 : 1) * 20)
      .text((d) => ((d.annual - 1) * 100).toFixed(1) + " %");
  }
}
