module.exports = {
  animationReversePeriod: 5000,
  activationPeriodMin: 5000,
  activationPeriodMax: 10000,
  hintPeriodMin: 7000,
  hintPeriodMax: 15000,
  activationCycle: [
    'statue',
    'ship',
    'penguins',
    'castle',
    'rocket',
    'submarine'
  ],
  markerRadius: 50,
  yokoRadius: 50,
  yokoAnimationPeriod: 500,
  counterAnimationPeriod: 2000,
  hitboxes: {
    rocket: {
      top: 100,
      bottom: 50,
      left: 100,
      right: 80,
    },
    statue: {
      top: 300,
      bottom: 100,
      left: 200,
      right: 200,
    },
    penguins: {
      top: 300,
      bottom: 0,
      left: 200,
      right: 80,
    },
    submarine: {
      top: 200,
      bottom: 250,
      left: 500,
      right: 0,
    },
    ship: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 250,
    },
    castle: {
      top: 200,
      bottom: 100,
      left: 100,
      right: 0,
    }
  },
  'markers': [
    {
      x: 4000,
      y: 2200
    },
    {
      x: 3640,
      y: 2600
    },
    {
      x: 4120,
      y: 1260
    },
    {
      x: 2469,
      y: 1600
    },
    {
      x: 1840,
      y: 2500
    }
  ],
  yoko: [
    { // Left cloud up
      x: 260,
      y: 890,
      type: 'up',
      rotation: -76,
      flip: false
    },
    { // Mid cloud down
      x: 748,
      y: 910,
      type: 'up',
      rotation: 72,
      flip: false
    },
    { // Right cloud down
      x: 1570,
      y: 480,
      type: 'up',
      rotation: 77,
      flip: false
    },
    { // Tower
      x: 2050,
      y: 880,
      type: 'up',
      rotation: 2,
      flip: false
    },
    { // Opera left
      x: 485,
      y: 1720,
      type: 'right',
      rotation: -12,
      flip: true
    },
    { // Opera right
      x: 1160,
      y: 1650,
      type: 'right',
      rotation: 9,
      flip: false
    },
    { // Ice cream
      x: 1760,
      y: 1300,
      type: 'right',
      rotation: 0,
      flip: true
    },
    { // Camp roof
      x: 2645,
      y: 600,
      type: 'up',
      rotation: -120,
      flip: false
    },
    { // Camp side
      x: 2870,
      y: 820,
      type: 'right',
      rotation: 0,
      flip: false
    },
    { // Left hill tree
      x: 3054,
      y: 1340,
      type: 'right',
      rotation: 20,
      flip: true
    },
    { // Mid hill tree
      x: 3595,
      y: 1055,
      type: 'right',
      rotation: 37,
      flip: true
    },
    { // Hill left
      x: 3925,
      y: 750,
      type: 'up',
      rotation: -108,
      flip: false
    },
    { // Hill top
      x: 4970,
      y: 595,
      type: 'up',
      rotation: -90,
      flip: false
    },
    { // Hill rock top
      x: 4453,
      y: 610,
      type: 'right',
      rotation: -4,
      flip: true
    },
    { // Hill rock
      x: 4607,
      y: 1190,
      type: 'right',
      rotation: 15,
      flip: true
    },
    { // Hill right
      x: 5460,
      y: 960,
      type: 'right',
      rotation: -45,
      flip: false
    },
    { // Hill right rock
      x: 5260,
      y: 1575,
      type: 'right',
      rotation: -45,
      flip: false
    },
    { // Waterfall
      x: 4205,
      y: 1520,
      type: 'right',
      rotation: 5,
      flip: false
    },
    { // Waterfall rock
      x: 4050,
      y: 1760,
      type: 'right',
      rotation: 15,
      flip: true
    },
    { // Waterfall lake
      x: 3790,
      y: 1990,
      type: 'up',
      rotation: -71,
      flip: false
    },
    { // House barn
      x: 3775,
      y: 2225,
      type: 'right',
      rotation: 7,
      flip: false
    },
    { // House roof
      x: 4240,
      y: 2310,
      type: 'up',
      rotation: -68,
      flip: false
    },
    { // Telescope
      x: 4740,
      y: 2130,
      type: 'up',
      rotation: -98,
      flip: false
    },
    { // Flowers
      x: 3380,
      y: 2660,
      type: 'up',
      rotation: -70,
      flip: false
    },
    { // Bench
      x: 2270,
      y: 2244,
      type: 'up',
      rotation: -70,
      flip: false
    },
    { // Lake
      x: 1505,
      y: 2745,
      type: 'up',
      rotation: -71,
      flip: false
    },
    { // Right tree
      x: 5220,
      y: 2300,
      type: 'right',
      rotation: 18,
      flip: true
    },
    { // Right rock
      x: 5780,
      y: 1228,
      type: 'up',
      rotation: -81,
      flip: false
    },
    { // Pine
      x: 4895,
      y: 3080,
      type: 'right',
      rotation: 35,
      flip: true
    },
    { // Right pine
      x: 5765,
      y: 3030,
      type: 'right',
      rotation: 33,
      flip: true
    },
  ]
}
