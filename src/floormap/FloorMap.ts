import house from "./house";
import * as d3 from "d3";

const timeDiff = (d: any) => {
  if (!d.hasOwnProperty("updated")) return "NA";
  let now = Math.floor(+new Date() / 1000.0);
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
const floorStart = (i: number) => (2 - i) * (floorWidth + margin) + margin;
const x = d3.scaleLinear().domain([0, 650]).range([0, floorWidth]);
const y = d3.scaleLinear().domain([0, 500]).range([floorWidth, 0]);
const colorRoom = (data: any, d: any) => {
  // console.log("Look for ", d);
  let s = getState(data, d);
  if (s.state && s.state === "on") return "#99cc99";
  if (s.state && s.state === "off") return "#777777";
  return "#d5d5d5";
};
const getState = (data: any, d: any) => {
  if (d.hasOwnProperty("p")) {
    if (data.hasOwnProperty(d.p)) {
      return data[d.p];
    }
  }
  return {};
};

export default class FloorMap {
  container: HTMLElement;
  svg: any;
  constructor(container: HTMLElement) {
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

  update(data: any) {
    console.log("Update", data);
    let houseg = this.svg
      .selectAll("g.floor")
      .data(house.floors)
      .join("g")
      .attr("class", "floor")
      .attr(
        "transform",
        (_: any, i: number) => "translate(0, " + floorStart(i) + ")"
      );

    houseg
      .append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("font-size", 14)
      .text((d: any) => d.name);

    let g = houseg
      .selectAll("g.room")
      .data((d: any) => d.rooms)
      .join("g")
      .attr("class", "room");

    g.append("polygon")
      .attr("points", (d: any) =>
        d.path.map((c: any) => x(c[0]) + "," + y(c[1]))
      )
      .attr("stroke", "#ccc")
      .attr("fill", (d: any) => colorRoom(data, d));

    /*    .attr("cy", height / 2)
      .attr("r", d => Math.random() * 20)
      .attr("fill", "hsl(216deg 100% 13%)");*/

    g.append("text")
      .attr("x", (d: any) => x(d.path[0][0] + 10))
      .attr("y", (d: any) => y(d.path[0][1] + 10))
      .text((d: any) => d.name);

    g.append("text")
      .attr("y", (d: any) => y(d.path[0][1] + 10) - 10)
      .attr("x", (d: any) => x(d.path[0][0] + 10))
      .text((d: any) => timeDiff(getState(data, d)));

    houseg
      .selectAll("rect")
      .data((d: any) => d.doors)
      .join("rect")
      .attr("x", (d: any) => x(d[0]))
      .attr("y", (d: any) => y(d[1]))
      .attr("width", (d: any) => x(d[2]) - x(0))
      .attr("height", (d: any) => y(0) - y(d[3]))
      .attr("stroke", "#d5d5d5")
      .attr("fill", "#fafafa");
  }
}
