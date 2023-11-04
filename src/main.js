import "./style.css";
import FloorMap from "./floormap/FloorMap";
import HAData from "./ha/HAData";

function logx(entry) {
  // Get the log output element
  let logOutput = document.getElementById("logoutput");
  if (logOutput === null) return;
  logOutput.innerHTML = "";

  // Create a new text line
  var line = document.createElement("div");

  // Check the type of the entry
  if (typeof entry === "string") {
    // If it's a string, text content is the entry
    line.textContent = entry;
  } else if (entry instanceof Error) {
    // If it's an error, text content is the error message
    line.textContent = entry.toString();
  } else {
    // For objects (like JSON), stringify the object
    try {
      line.textContent = JSON.stringify(entry, null, 2);
    } catch (e) {
      line.textContent = "Error: Could not stringify object.";
    }
  }

  // Append the line to the log output element
  logOutput.appendChild(line);
}

function parseHashFragment() {
  const hash = window.location.hash.substr(1); // Remove the '#' symbol
  const pairs = hash.split("&"); // Split by '&' to get key=value pairs
  const attributes = {};

  pairs.forEach((pair) => {
    const [key, value] = pair.split("="); // Split by '=' to get key and value separately
    attributes[decodeURIComponent(key)] = decodeURIComponent(value); // Decode URI components and store in object
  });

  return attributes;
}

const roomEntities = [
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

try {
  // Preparation
  logx("0");
  const attributes = parseHashFragment();
  if (!attributes.token) throw new Error("No token provided");

  logx("1");

  let c = document.getElementById("box1");
  if (c === null) throw new Error("cannot find #box1");

  logx("2");
  // Initialization
  let fm = new FloorMap(c);
  let ha = new HAData(attributes.token);
  logx("3");
  // Updates
  ha.listen(roomEntities, (data) => {
    console.log("Listen sayts ", data);
    logx(data);
    fm.update(data);
  });
  ha.listen(["sensor.average_power_jan_voigts_vei_10"], (data) => {
    console.log("Listen sayts ", data);
    logx(data);
    // fm.update(data);
  });
  logx("4");
} catch (e) {
  console.error("Error", e);
  logx(e);
}

// const main = (attributes) => {};

//main(attributes);

// Usage Example:
// window.addEventListener("hashchange", () => {
//   const attributes = parseHashFragment();
//   console.log(attributes); // Logs the parsed key-value pairs from the hash
//   //main(attributes);
// });
