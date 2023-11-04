import house from "./house";
import * as d3 from "d3";

const timeDiff = (d) => {
  if (!d.hasOwnProperty("updated")) return "NA";
  let now = Math.floor(new Date() / 1000.0);
  let seconds = now - d.updated.getTime() / 1000.0;
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let minutesLeft = minutes & 60;
  if (hours > 6) {
    return hours + "h";
  }
  if (hours > 0) {
    return hours + "h " + minutesLeft + "min";
  }
  return minutes + " min";
};
const width = 300;
const height = 950;
const floorWidth = width;
const margin = 10;
const floorStart = (i) => (2 - i) * (floorWidth + margin) + margin;
const x = d3.scaleLinear().domain([0, 650]).range([0, floorWidth]);
const y = d3.scaleLinear().domain([0, 500]).range([floorWidth, 0]);
const colorRoom = (data, d) => {
  // console.log("Look for ", d);
  let s = getState(data, d);
  if (s.state && s.state === "on") return "#99cc99";
  if (s.state && s.state === "off") return "#777777";
  return "#d5d5d5";
};
const getState = (data, d) => {
  if (d.hasOwnProperty("p")) {
    if (data.hasOwnProperty(d.p)) {
      return data[d.p];
    }
  }
  return {};
};

export default class FloorMap {
  container;
  svg;
  constructor(container) {
    this.container = container;
    this.svg = null;

    // console.log("Floormap yay, house is", house);
    // console.log("container", container);
    this.init();
  }

  init() {
    this.svg = d3
      .select(this.container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px");
  }

  update(data) {
    console.log("Update", data);
    let houseg = this.svg
      .selectAll("g.floor")
      .data(house.floors)
      .join("g")
      .attr("class", "floor")
      .attr("transform", (d, i) => "translate(0, " + floorStart(i) + ")");

    houseg
      .append("text")
      .attr("x", (d, i) => 0)
      .attr("y", (d, i) => 30)
      .attr("font-size", 14)
      .text((d) => d.name);

    let g = houseg
      .selectAll("g.room")
      .data((d) => d.rooms)
      .join("g")
      .attr("class", "room");

    g.append("polygon")
      .attr("points", (d) => d.path.map((c) => x(c[0]) + "," + y(c[1])))
      .attr("stroke", "#ccc")
      .attr("fill", (d) => colorRoom(data, d));

    /*    .attr("cy", height / 2)
      .attr("r", d => Math.random() * 20)
      .attr("fill", "hsl(216deg 100% 13%)");*/

    g.append("text")
      .attr("x", (d) => x(d.path[0][0] + 10))
      .attr("y", (d) => y(d.path[0][1] + 10))
      .text((d) => d.name);

    g.append("text")
      .attr("x", (d) => x(d.path[0][0] + 10))
      .attr("y", (d) => y(d.path[0][1] + 10) - 10)
      .text((d) => timeDiff(getState(data, d)));

    let dg = houseg
      .selectAll("rect")
      .data((d) => d.doors)
      .join("rect")
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => y(d[1]))
      .attr("width", (d) => x(d[2]) - x(0))
      .attr("height", (d) => y(0) - y(d[3]))
      .attr("stroke", "#d5d5d5")
      .attr("fill", "#fafafa");
  }
}
