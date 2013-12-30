({
    appDir: "src",
    baseUrl: "./js",
    paths: {

        /* List of frameworks/libraries to be included in this architecture. */
            'jquery': '../../bower_components/jquery/jquery.min',
            'underscore': '../../bower_components/underscore/underscore-min',
            'backbone': '../../bower_components/backbone/backbone-min',
            'handlebars': '../../bower_components/handlebars/handlebars.min',
            'moment': '../../bower_components/momentjs/moment',

        /* List of custom files to be loaded in this architecture. */
            'template': '../../bower_components/requirejs-handlebars/hbars',
            'handlebars_Helpers': 'utilities/handlebars-helpers',
            'templates': '../templates',

        /* List of Backbone plugins */
            'modelValidator': '../../bower_components/backbone-validation/src/backbone-validation',
            'modelBinder': '../../bower_components/Backbone.ModelBinder/Backbone.ModelBinder.min',

        /* List of Require plugins */
            'text': '../../bower_components/requirejs-text/text',

        /* List of Bootstrap js plugins */
            'bootstrapAlert': '../../bower_components/bootstrap/js/alert',
            'bootstrapDropdown': '../../bower_components/bootstrap/js/dropdown',
            'bootstrapTransition': '../../bower_components/bootstrap/js/transition',
            'bootstraplightbox': 'vendors/bootstrap/js/bootstrap.lightbox',
            'bootstrapModal': '../../bower_components/bootstrap/js/modal',
            'bootstrapCarousel': '../../bower_components/bootstrap/js/carousel',
            'bootstrapAffix': '../../bower_components/bootstrap/js/affix',
            'bootstrapButton': '../../bower_components/bootstrap/js/button',
            'bootstrapCollapse': '../../bower_components/bootstrap/js/collapse',
            'bootstrapPopOver': '../../bower_components/bootstrap/js/popover',
            'bootstrapScrollSpy': '../../bower_components/bootstrap/js/scrollspy',
            'bootstrapTab': '../../bower_components/bootstrap/js/tab',
            'bootstrapTooltip': '../../bower_components/bootstrap/js/tooltip',

        /* List of jQuery plugins */
            'jqueryCookie': '../../bower_components/jquery-cookie/jquery.cookie',
            'jqueryAjaxForm': '../../bower_components/jquery-form/jquery.form',
            'chosen': '../../bower_components/chosen/public/chosen.jquery.min',
            'prettyPhoto': '../../bower_components/prettyphoto-master/js/jquery.prettyPhoto',

        /* FuelUx */
            'fuelux': '../../bower_components/fuelux/dist/all.min',
            'fueluxDataGrid': '../../bower_components/fuelux/dist/datagrid',
            'fueluxDataSource': '../../bower_components/fuelux/sample/datasource',
            'fueluxComboBox': '../../bower_components/fuelux/dist/combobox',
            'fueluxSelectBox': '../../bower_components/fuelux/dist/select',
            'fueluxSearchBox': '../../bower_components/fuelux/dist/search',
            'util': '../../bower_components/fuelux/dist/util',
            'fueluxWizard': '../../bower_components/fuelux/dist/wizard'
    },
    mainConfigFile: 'src/js/main.js',
    stubModules: ['text', 'hbars'],
    dir: "build",
    preserveLicenseComments: false,
    inlineText: true,
    removeCombined: true,
    findNestedDependencies: true,
    modules: [
        {
            name: "views/greetings/admin/greetingsAdmin",
            include: ["views/greetings/greetingsUser", "views/user/userView"]
        },
        {
            name: "main",
            exclude: ["views/greetings/admin/greetingsAdmin"]
        }
    ],
    onBuildWrite : function(moduleName, path, content){
        // replace handlebars with the runtime version
        if (moduleName === 'Handlebars') {
            path = path.replace('handlebars.js','handlebars.runtime.js');
            content = fs.readFileSync(path).toString();
            content = content.replace(/(define\()(function)/, '$1"handlebars", $2');
        }
        return content;
    }
})