var path = require('canonical-path');

var Package = require('dgeni').Package;

module.exports = new Package('docs_conf', [
    require('dgeni-packages/base'),
    require('dgeni-packages/jsdoc'),
    require('dgeni-packages/nunjucks'),
    require('dgeni-packages/ngdoc'),
    require('dgeni-packages/links')
])

    .config(function(log, readFilesProcessor, templateFinder, writeFilesProcessor, computeIdsProcessor, computePathsProcessor, getAliases) {

        log.level = 'info';

        readFilesProcessor.basePath = path.resolve(__dirname, '..');
        console.log(readFilesProcessor.basePath);

        readFilesProcessor.sourceFiles = [
            {
                include: ['app/components/**/*.js', 'app/zetalib/*.js', 'app/shared/**/*.js'],
                exclude: 'app/**/*_test.js',
                basePath: 'app'
            }
        ];

        writeFilesProcessor.outputFolder  = 'docs/html';
        templateFinder.templateFolders.push(path.resolve(__dirname, 'templates'));

        templateFinder.templatePatterns.push('common.template.html');

        computeIdsProcessor.idTemplates = [
            {
                docTypes: ['module' ],
                idTemplate: 'module:${name}',
                getAliases: getAliases
            },
            {
                docTypes: ['method', 'property', 'event'],
                getId: function(doc) {
                    var parts = doc.name.split('#');
                    var name = parts.pop();
                    parts.push(doc.docType + ':' + name);
                    return parts.join('#');
                },
                getAliases: getAliases
            },
            {
                docTypes: [ 'controller', 'provider', 'service', 'directive', 'input', 'object', 'function', 'filter', 'type' ],
                idTemplate: 'module:${module}.${docType}:${name}',
                getAliases: getAliases
            }
        ];

        computePathsProcessor.pathTemplates = [
            {
                docTypes: [ 'controller', 'provider', 'service', 'directive', 'input', 'object', 'function', 'filter', 'type' ],
                pathTemplate: '${docType}/${name}.html',
                outputPathTemplate: 'partials/${area}/${module}/${docType}/${name}.html'
            },
            {
                docTypes: ['module' ],
                pathTemplate: '/${area}/${name}',
                outputPathTemplate: 'partials/${area}/${name}/index.html'
            },
            {
                docTypes: ['componentGroup' ],
                pathTemplate: '${area}/${moduleName}/${groupType}',
                outputPathTemplate: 'partials/${area}/${moduleName}/${groupType}/index.html'
            }
        ];
    });