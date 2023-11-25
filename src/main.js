import "./style.css";
import FloorMap from "./floormap/FloorMap";
import Energy from "./energy/Energy";
import Water from "./water/Water";
import Temp from "./temp/Temp";
import HAData from "./ha/HAData";

import FondData from "./fond/FondData";
import FondChart from "./fond/FondChart";
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
];

try {
  const attributes = parseHashFragment();
  if (!attributes.token) throw new Error("No token provided");

  if (attributes.hasOwnProperty("dev")) {
    document.addEventListener("DOMContentLoaded", function () {
      document.body.style.backgroundColor = "#777";
    });
  }

  // --- Floormap
  let c = document.getElementById("box1");
  if (c === null) throw new Error("cannot find #box1");
  let fm = new FloorMap(c);
  let ha = new HAData(attributes.token);

  // Updates
  ha.listen(roomEntities, (data) => {
    logx(data);
    fm.update(data);
  });

  // --- Energy
  let c2 = document.getElementById("box2");
  let energy = new Energy(c2);
  ha.listen(
    [
      "sensor.power_jan_voigts_vei_10",
      "sensor.electricity_price_jan_voigts_vei_10",
    ],
    (data) => {
      energy.update(data);
    }
  );

  // Fond chart
  const fond = new FondData();
  let c3 = document.getElementById("box3");
  let fondchart = new FondChart(c3);
  fond.getData().then((fond) => {
    fondchart.update(fonddata);
    console.log("fondata", fonddata);
  });

  // --- Water
  let c4 = document.getElementById("box4");
  let water = new Water(c4);
  ha.listen(["sensor.vannforbruk_3m"], (data) => {
    water.update(data);
  });

  // --- Temp
  let tempConfig = {
    "sensor.netatmo_jan_voigts_v10_indoor_ute_temperature": "Ute",
    "sensor.netatmo_jan_voigts_v10_indoor_drivhus_temperature": "Drivhus",
    "sensor.netatmo_jan_voigts_v10_indoor_temperature": "Stua",
    "sensor.netatmo_jan_voigts_v10_indoor_kjeller_temperature": "Kjellerstua",
  };
  let c5 = document.getElementById("box5");
  let temp = new Temp(c5, tempConfig);
  console.log("tempconfig listen to ", Object.keys(tempConfig));
  ha.listen(Object.keys(tempConfig), (data) => {
    temp.update(data);
  });
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
