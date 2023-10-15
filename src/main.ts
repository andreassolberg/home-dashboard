import "./style.css";
import FloorMap from "./floormap/FloorMap";
import HAData from "./ha/HAData";

console.log("App run!");

function parseHashFragment(): { [key: string]: string } {
  const hash: string = window.location.hash.substr(1);
  const pairs: string[] = hash.split("&");
  const attributes: { [key: string]: string } = {};

  pairs.forEach((pair: string) => {
    const [key, value] = pair.split("=");
    attributes[decodeURIComponent(key)] = decodeURIComponent(value);
  });

  return attributes;
}

const roomEntities: string[] = [
  "binary_sensor.presence_ute",
  "binary_sensor.presence_2etg",
  "binary_sensor.presence_yttergang",
  "binary_sensor.presence_kjellergang",
  "binary_sensor.presence_kjellerstua",
  "binary_sensor.presence_linnea",
  "binary_sensor.presence_linus",
  "binary_sensor.presence_bad",
  "binary_sensor.presence_vaskerom",
  "binary_sensor.presence_drivhus",
  "binary_sensor.presence_bod",
  "binary_sensor.presence_gjesterom",
  "binary_sensor.presence_master_bedroom",
  //"sensor.dim2",
  //"sensor.dim1",
  //"sensor.average_power_jan_voigts_vei_10",
];

// Preparation
const attributes = parseHashFragment();
if (!attributes.token) throw new Error("No token provided");
let c = document.getElementById("box1");
if (c === null) throw new Error("cannot find #box1");

// Initialization
let fm = new FloorMap(c);
let ha = new HAData(attributes.token);

// Updates
ha.listen(roomEntities, (data: any) => {
  console.log("Listen sayts ", data);
  fm.update(data);
});

// const main = (attributes) => {};

//main(attributes);

// Usage Example:
// window.addEventListener("hashchange", () => {
//   const attributes = parseHashFragment();
//   console.log(attributes); // Logs the parsed key-value pairs from the hash
//   //main(attributes);
// });
