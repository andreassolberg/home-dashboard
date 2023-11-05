import * as d3 from "d3";

const width = 400;
const height = 300;
const margin = 30;
const marginRight = 70;

export default class Temp {
  container;
  svg;
  data;
  config;
  constructor(container, config) {
    this.container = container;
    this.svg = null;
    this.data = {};
    this.config = config;

    this.init();
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
      .attr("class", "tempc")
      .attr("transform", (d, i) => `translate(${margin}, ${margin} )`);
  }

  getData() {
    let data = [];
    for (let sensor of Object.keys(this.data)) {
      data.push({
        id: sensor,
        value: this.data[sensor],
        label: this.config[sensor] || "NA",
      });
    }
    return data;
  }

  update(data) {
    // console.log("Update", data);
    for (let sensor of Object.keys(data)) {
      console.log("Read ", sensor);
      let val = parseFloat(data[sensor].state);
      console.log("Read ", sensor, val);
      this.data[sensor] = val;
    }

    let tempdata = this.getData();
    console.log("temp data", this.data, tempdata);

    let dy = 60;

    console.log("temp data", tempdata);

    // Add the line path
    this.svg
      .selectAll("text.tempdata")
      .data(tempdata)
      .join("text")
      .attr("font-size", 26)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + margin)
      .attr("y", (_, i) => margin + dy * i)
      .attr("fill", "white")
      .text((d, i) => d.value + " °C");

    this.svg
      .selectAll("text.labels")
      .data(tempdata)
      .join("text")
      .attr("class", "labels")

      .attr("font-size", 14)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + margin)
      .attr("y", (_, i) => margin + dy * i + 22)
      .attr("fill", "white")
      .text((d, i) => d.label);
  }
}
