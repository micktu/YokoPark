module.exports = {
  animationReversePeriod: 5000,
  activationPeriodMin: 5000,
  activationPeriodMax: 10000,
  activationCycle: [
    'statue',
    'ship',
    'penguins',
    'castle',
    'rocket',
    'submarine'
  ],
  markerRadius: 50,
  yokoRadius: 100,
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
      x: 1958,
      y: 376,
      type: 'up',
      rotation: -109,
      scale: 0.5,
      flip: false
    },
    {
      x: 1527,
      y: 670,
      type: 'right',
      rotation: 20,
      scale: 0.5,
      flip: true
    },
    {
      x: 2610,
      y: 1150,
      type: 'right',
      rotation: 18,
      scale: 0.5,
      flip: true
    },
    {
      x: 2890,
      y: 614,
      type: 'up',
      rotation: -81,
      scale: 0.5,
      flip: false
    },
    {
      x: 374,
      y: 456,
      type: 'up',
      rotation: 72,
      scale: 0.5,
      flip: false
    },
    {
      x: 1135,
      y: 1122,
      type: 'up',
      rotation: -70,
      scale: 0.5,
      flip: false
    }
  ]
}
