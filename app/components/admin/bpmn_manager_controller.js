/**
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 *
 * @author Evren Kutar
 */

angular.module('ulakbus')
    //.constant('require', require)
    .controller('BpmnManagerController', function ($scope) {

        var fs = require('fs');

        var $ = require('jquery'),
            BpmnModeler = require('bpmn-js/lib/Modeler');

        var propertiesPanelModule = require('bpmn-js-properties-panel'),
            propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda'),
            camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda');

        var container = $('#js-drop-zone');

        var canvas = $('#js-canvas');

        var bpmnModeler = new BpmnModeler({
            container: canvas,
            propertiesPanel: {
                parent: '#js-properties-panel'
            },
            additionalModules: [
                propertiesPanelModule,
                propertiesProviderModule
            ],
            moddleExtensions: {
                camunda: camundaModdleDescriptor
            }
        });

        var newDiagramXML = fs.readFileSync(__dirname + 'new.bpmn', 'utf-8');

        function createNewDiagram() {
            openDiagram(newDiagramXML);
        }

        function openDiagram(xml) {

            bpmnModeler.importXML(xml, function (err) {

                if (err) {
                    container
                        .removeClass('with-diagram')
                        .addClass('with-error');

                    container.find('.error pre').text(err.message);

                    console.error(err);
                } else {
                    container
                        .removeClass('with-error')
                        .addClass('with-diagram');
                }


            });
        }

        function saveSVG(done) {
            bpmnModeler.saveSVG(done);
        }

        function saveDiagram(done) {

            bpmnModeler.saveXML({format: true}, function (err, xml) {
                done(err, xml);
            });
        }

        function registerFileDrop(container, callback) {

            function handleFileSelect(e) {
                e.stopPropagation();
                e.preventDefault();

                var files = e.dataTransfer.files;

                var file = files[0];

                var reader = new FileReader();

                reader.onload = function (e) {

                    var xml = e.target.result;

                    callback(xml);
                };

                reader.readAsText(file);
            }

            function handleDragOver(e) {
                e.stopPropagation();
                e.preventDefault();

                e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
            }

            container.get(0).addEventListener('dragover', handleDragOver, false);
            container.get(0).addEventListener('drop', handleFileSelect, false);
        }

        if (!window.FileList || !window.FileReader) {
            window.alert(
                'Looks like you use an older browser that does not support drag and drop. ' +
                'Try using Chrome, Firefox or the Internet Explorer > 10.');
        } else {
            registerFileDrop(container, openDiagram);
        }

        $(document).on('ready', function () {

            $('#js-create-diagram').click(function (e) {
                e.stopPropagation();
                e.preventDefault();

                createNewDiagram();
            });

            var downloadLink = $('#js-download-diagram');
            var downloadSvgLink = $('#js-download-svg');

            $('.buttons a').click(function (e) {
                if (!$(this).is('.active')) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            function setEncoded(link, name, data) {
                var encodedData = encodeURIComponent(data);

                if (data) {
                    link.addClass('active').attr({
                        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                        'download': name
                    });
                } else {
                    link.removeClass('active');
                }
            }

            var debounce = require('lodash/function/debounce');

            var exportArtifacts = debounce(function () {

                saveSVG(function (err, svg) {
                    setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
                });

                saveDiagram(function (err, xml) {
                    setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
                });
            }, 500);

            bpmnModeler.on('commandStack.changed', exportArtifacts);
        });

    });