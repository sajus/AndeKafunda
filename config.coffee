exports.config =
  modules:
    definition: 'amd'
    wrapper: 'amd'
  paths:
    public: '_public'
  files:
    javascripts:
      joinTo:
        'js/vendor.js': /^bower_components/
        'js/app.js': /^app/
      order:
        before:[
          'bower_components/requirejs/require.js'
        ]
    stylesheets:
      defaultExtension: 'less'
      order:
        before:[
          'app/styles/main.less'
        ]
      joinTo:
        'css/app.css': /^app/
    templates:
      defaultExtension: 'html'
      joinTo:
        'templates/templates.html': /^src\/templates/
  optimize: false
