let rooms2 = [];
rooms2.push({
  name: "Kjøkken",
  p: "binary_sensor.presence_2etg",
  path: [
    [0, 0],
    [0, 205],
    [630, 205],
    [630, 0],
  ],
});
rooms2.push({
  name: "Stue",
  p: "binary_sensor.presence_2etg",
  path: [
    [140, 205],
    [140, 470],
    [630, 470],
    [630, 205],
  ],
});

let rooms1 = [];

rooms1.push({
  name: "Gang",
  p: "binary_sensor.presence_yttergang",
  path: [
    [0, 180 - 180],
    [0, 375 - 180],
    [140, 375 - 180],
    [140, 650 - 180],
    [270, 650 - 180],
    [270, 455 - 180],
    [250, 455 - 180],
    [250, 375 - 180],
    [490, 375 - 180],
    [490, 310 - 180],
    [235, 310 - 180],
    [235, 180 - 180],
  ],
});

rooms1.push({
  name: "Linus",
  p: "binary_sensor.presence_linus",
  path: [
    [320, 385 - 180],
    [320, 455 - 180],
    [280, 455 - 180],
    [280, 650 - 180],
    [425, 650 - 180],
    [425, 385 - 180],
  ],
});

rooms1.push({
  name: "Master bedroom",
  p: "binary_sensor.presence_master_bedroom",
  path: [
    [435, 385 - 180],
    [435, 650 - 180],
    [630, 650 - 180],
    [630, 385 - 180],
  ],
});

rooms1.push({
  name: "Gjesterom",
  p: "binary_sensor.presence_gjesterom",
  path: [
    [500, 180 - 180],
    [500, 375 - 180],
    [630, 375 - 180],
    [630, 180 - 180],
  ],
});

rooms1.push({
  name: "Bad",
  p: "binary_sensor.presence_bad",
  path: [
    [245, 180 - 180],
    [245, 300 - 180],
    [490, 300 - 180],
    [490, 180 - 180],
  ],
});

let rooms0 = [];
rooms0.push({
  name: "Linnéa",
  p: "binary_sensor.presence_linnea",
  path: [
    [0, 0],
    [0, 205],
    [140, 205],
    [140, 240],
    [235, 240],
    [235, 0],
  ],
});
rooms0.push({
  name: "Gang",
  p: "binary_sensor.presence_kjellergang",
  path: [
    [140, 250],
    [140, 480],
    [280, 480],
    [280, 310],
    [430, 310],
    [430, 225],
    [300, 225],
    [300, 250],
  ],
});
rooms0.push({
  name: "Bod",
  p: "binary_sensor.presence_bod",
  path: [
    [290, 320],
    [290, 480],
    [430, 480],
    [430, 320],
  ],
});
rooms0.push({
  name: "Vaskerom",
  p: "binary_sensor.presence_vaskerom",
  path: [
    [245, 0],
    [245, 215],
    [430, 215],
    [430, 0],
  ],
});
rooms0.push({
  name: "Kjellerstua",
  p: "binary_sensor.presence_kjellerstua",
  path: [
    [440, 0],
    [440, 480],
    [625, 480],
    [625, 0],
  ],
});

const house = {
  floors: [
    {
      name: "Kjeller",
      rooms: rooms0,
      doors: [],
    },
    {
      name: "1. etasje",
      rooms: rooms1,
      doors: [[100, 12, 80, 24]],
    },
    {
      name: "2. etasje",
      rooms: rooms2,
      doors: [],
    },
  ],
};

export default house;
