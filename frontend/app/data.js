module.exports = {
  scale: 0.25,
  animTextureSize: 2048,
  markerRadius: 100,
  yokoRadius: 100,
  yokoAnimationPeriod: 500,
  counterAnimationPeriod: 2000,
  'map': {
    name: 'map',
    width: 6000,
    height: 3200,
    textureSize: 1024
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
  'animations': {
    'waterfall': {
      isBackground: true,
      width: 950,
      height: 950,
      x: 4000,
      y: 750,
      numFrames: 100
    },
    'water1': {
      isBackground: true,
      width: 1340,
      height: 580,
      x: 3200,
      y: 1480,
      numFrames: 31
    },
    'water2': {
      isBackground: true,
      width: 1600,
      height: 600,
      x: 1100,
      y: 2260,
      numFrames: 31
    },
    'lights': {
      textureSize: 1024,
      isBackground: true,
      width: 420,
      height: 300,
      x: 3840,
      y: 2220,
      numFrames: 15,
      speed: 0.02
    },
    'castle': {
      isBackground: false,
      width: 1060,
      height: 910,
      x: 1560,
      y: 1270,
      numFrames: 30
    },
    'ship': {
      isBackground: false,
      width: 1120,
      height: 830,
      x: 1020,
      y: 1980,
      numFrames: 87
    },
    'statue': {
      isBackground: false,
      width: 1040,
      height: 960,
      x: 2420,
      y: 1400,
      numFrames: 30
    },
    'penguins': {
      textureSize: 1024,      
      isBackground: false,
      width: 580,
      height: 600,
      x: 2840,
      y: 1940,
      numFrames: 45
    },
    'rocket': {
      isBackground: false,
      width: 490,
      height: 610,
      x: 2860,
      y: 950,
      numFrames: 34
    }
  },
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
