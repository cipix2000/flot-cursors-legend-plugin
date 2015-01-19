/* Flot plugin for adding a legend for cursors to the plot.

Copyright (c) cipix2000@gmail.com.
Licensed under the MIT license.
*/

/*global jQuery*/

(function ($) {
    'use strict';

    var options = {
        cursorsLegendDiv: null
    };

    function init(plot) {
        var legendDiv;

        plot.hooks.processOptions.push(function (plot, options) {

            if (!options.cursorsLegendDiv) {
                return;
            }
            legendDiv = $('#' + options.cursorsLegendDiv);
            if (!legendDiv) {
                return;
            }
            populateLegendDiv(plot, legendDiv);

            plot.hooks.bindEvents.push(function (plot, eventHolder) {
                eventHolder.bind('cursorupdates', onCursorUpdates);
            });

            plot.hooks.shutdown.push(function (plot, eventHolder) {
                eventHolder.unbind('cursorupdates');
            });
        });

        var onCursorUpdates = function () {

        };
    }

    function populateLegendDiv(plot, div) {
        var cursorModes = [
            "xy",
            "x",
            "y",
        ];
        
        div.empty();
        div.append('<div id="jqxgrid"/>');
        var popup = $('<div id="popupWindow">').appendTo(div);
        popup.append('<div id="title">Edit cursor</div>');
        var bodyDiv = $('<div id="popupBody" style="overflow: hidden;" />').appendTo(popup);
        bodyDiv.append('<span id="cursorNameText">Name</span>');
        bodyDiv.append('<input id="cursorname" />');
        bodyDiv.append('<span id="colorText">Color</span>');
        $('<div id="dropDownButton"\>').appendTo(bodyDiv)
            .append('<div id="colorPicker">');
        bodyDiv.append('<span id="modeText">Mode</span>');
        bodyDiv.append('<div id="dropDownList"\>');
        bodyDiv.append('<input style="margin-right: 5px;" type="button" id="Apply" value="Apply" />');
        bodyDiv.append('<input id="Cancel" type="button" value="Cancel" />');

        // initialize the input fields.
        $("#cursorname").addClass('jqx-input');
        $("#cursorname").width(200);
        $("#cursorname").height(23);

        var data = [];
        plot.getCursors().forEach(function (cursor) {
            data.push({
                cursorname: cursor.name,
                x: 0,
                y: 0,
            });
        });

        var source = {
            localdata: data,
            datatype: "array",
            datafields: [
                {
                    name: 'cursorname',
                    type: 'string'
                },
                {
                    name: 'x',
                    type: 'number'
                },
                {
                    name: 'y',
                    type: 'number'
                }
            ],
            updaterow: function (rowid, rowdata, commit) {
                commit(true);
            },
            deleterow: function (rowid, commit) {
                commit(true);
            },
            addrow: function (rowid, rowdata, position, commit) {
                commit(true);
            }
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        var editrow = -1;

        // initialize jqxGrid
        $("#jqxgrid").jqxGrid({
            width: div.width(),
            height: div.height(),
            source: dataAdapter,
            autoheight: false,
            columns: [
                {
                    text: 'Cursor Name',
                    datafield: 'cursorname',
                    width: 200
                },
                {
                    text: 'X',
                    datafield: 'x',
                    width: 100,
                    cellsalign: 'left',
                    cellsformat: 'f4'
                },
                {
                    text: 'Y',
                    datafield: 'y',
                    cellsalign: 'left',
                    cellsformat: 'f4'
                }
            ]
        });

        // initialize the popup window and buttons.
        $("#popupWindow").jqxWindow({
            width: 300,
            height: 300,
            resizable: false,
            isModal: true,
            autoOpen: false,
            cancelButton: $("#Cancel"),
            modalOpacity: 0.01
        });
        $("#Cancel").jqxButton({});
        $("#Apply").jqxButton({});
        /*
        $("#jqxcheckbox1").jqxCheckBox({
            //width: 120,
            height: 25
        });
        $("#jqxcheckbox2").jqxCheckBox({
            //width: 120,
            height: 25
        });

        $("#jqxcheckbox3").jqxCheckBox({
            //width: 120,
            height: 25
        });
        */

        $("#colorPicker").on('colorchange', function (event) {
            $("#dropDownButton").jqxDropDownButton('setContent', getTextElementByColor(event.args.color));
        });

        $("#dropDownButton").jqxDropDownButton({
            animationType: 'none',
            width: '100%',
            dropDownHeight: 250,
            height: 30
        });

        $("#colorPicker").jqxColorPicker({
            color: "ffaabb",
            colorMode: 'hue',
            width: '100%',
            height: 242
        });

        $("#dropDownButton").jqxDropDownButton('setContent', getTextElementByColor(new $.jqx.color({
            hex: "ffaabb"
        })));
        
        $("#dropDownList").jqxDropDownList({
            source: cursorModes,
            selectedIndex: 0,
            width: '200px',
            height: '25px'
        });
/*
        $("#jqxshapedropdownlist").jqxDropDownList({
            source: shapes,
            selectedIndex: 0,
            width: '200px',
            height: '25px'
        });

        $("#jqxsnapdropdownlist").jqxDropDownList({
            source: snapTo,
            selectedIndex: 0,
            width: '200px',
            height: '25px'
        });
*/
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'cursors-legend',
        version: '0.1'
    });

    var popUpTemplate = '';

    function getTextElementByColor(color) {
        if (color == 'transparent' || color.hex === "") {
            return $("<div style='text-shadow: none; position: relative; margin: 2px; height: 26px;'><span style='top: 2px; position: relative; font-size: 16px;'>transparent</span></div>");
        }
        var element = $("<div style='text-shadow: none; height: 26px; margin: 2px; position: relative;'><span style='top: 2px; position: relative; font-size: 16px;'>#" + color.hex + "</span></div>");
        var nThreshold = 105;
        var bgDelta = (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114);
        var foreColor = (255 - bgDelta < nThreshold) ? 'Black' : 'White';
        element.css('color', foreColor);
        element.css('background', "#" + color.hex);
        element.addClass('jqx-rc-all');
        return element;
    }
})(jQuery);