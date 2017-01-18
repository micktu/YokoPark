module.exports = {
  npm: {
    globals: {
    }
  },
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^vendor/,
        'app.js': /^app/
      },
      order: {
        before: [
          'vendor/pixi.js',
          'vendor/pixi-compressed-textures.js',
        ]
      }
    },
    stylesheets: { joinTo: 'app.css' }
  },

  plugins: {
    babel: { presets: ['es2015', 'es2016'] }
  },
  server: {
    hostname: '0.0.0.0'
  }
};
