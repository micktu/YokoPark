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
    {
      x: 3916,
      y: 752,
      type: 'up',
      rotation: -109,
      flip: false
    },
    {
      x: 3054,
      y: 1340,
      type: 'right',
      rotation: 20,
      flip: true
    },
    {
      x: 5220,
      y: 2300,
      type: 'right',
      rotation: 18,
      flip: true
    },
    {
      x: 5780,
      y: 1228,
      type: 'up',
      rotation: -81,
      flip: false
    },
    {
      x: 748,
      y: 912,
      type: 'up',
      rotation: 72,
      flip: false
    },
    {
      x: 2270,
      y: 2244,
      type: 'up',
      rotation: -70,
      flip: false
    }
  ]
}
