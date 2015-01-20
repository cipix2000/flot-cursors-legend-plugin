/* Flot plugin for adding a legend for cursors to the plot.

Copyright (c) cipix2000@gmail.com.
Licensed under the MIT license.
*/

/*global jQuery*/
/*jshint browser: true*/

(function ($) {
    'use strict';

    var options = {
        cursorsLegendDiv: null
    };

    var cursorColors = ['#FF0000', '#000080', '#FF00FF', '#4B0082', '#DAA520', '#FFC0CB', '#FA8072'];

    var editrow = -1;

    function init(plot) {
        var legendDiv;
        var grid;

        plot.hooks.processOptions.push(function (plot, options) {
            if (!options.cursorsLegendDiv) {
                return;
            }
            legendDiv = $('#' + options.cursorsLegendDiv);
            if (!legendDiv) {
                return;
            }

            grid = populateLegendDiv(plot, legendDiv);
            populatePopupDiv(plot, legendDiv);
            populateMenuDiv(plot, legendDiv);

            plot.hooks.bindEvents.push(function (plot) {
                plot.getPlaceholder().bind('cursorupdates', onCursorUpdates);
            });

            plot.hooks.shutdown.push(function (plot) {
                plot.getPlaceholder().unbind('cursorupdates');
            });
        });

        var onCursorUpdates = function (event, cursordata) {
            var i = 0;
            cursordata.forEach(function (cursor) {
                var row = grid.jqxGrid('getrowdata', i);
                if (row) {
                    row.cursorname = cursor.cursor;
                    row.x = cursor.x;
                    row.y = cursor.y;
                    grid.jqxGrid('updaterow', i, row);
                }
                i++;
            });
        };
    }

    function populateMenuDiv(plot, div) {
        var cursorCounter = 1;
        var menu = $('<div id="Menu"/>');
        menu.appendTo(div);
        var list = $('<ul/>');
        list.appendTo(menu);
        ['Edit Selected Cursor', 'Delete Selected Cursor', 'Add Cursor'].forEach(function (menu) {
            $('<li>' + menu + '</li>').appendTo(list);
        });

        // create context menu
        var contextMenu = $("#Menu").jqxMenu({
            width: 200,
            height: 81,
            autoOpenPopup: false,
            mode: 'popup'
        });

        // handle context menu clicks.
        menu.on('itemclick', function (event) {
            var args = event.args;
            var rowindex = $("#jqxgrid").jqxGrid('getselectedrowindex');
            if ($.trim($(args).text()) == "Edit Selected Cursor") {
                editrow = rowindex;
                var offset = $("#jqxgrid").offset();
                $("#popupWindow").jqxWindow({
                    position: {
                        x: parseInt(offset.left) + 60,
                        y: parseInt(offset.top) + 60
                    }
                });

                // get the clicked row's data and initialize the input fields.
                var dataRecord = $("#jqxgrid").jqxGrid('getrowdata', editrow);

                var cursorData = plot.getCursors()[editrow];
                $("#cursorname").val(dataRecord.cursorname);
                $("#dropDownButton").jqxDropDownButton('setContent', getTextElementByColor(new $.jqx.color({
                    hex: cursorData.color.substring(1)
                })));

                $("#dropDownList").jqxDropDownList('selectItem', cursorData.mode);
                /*
                $("#jqxshapedropdownlist").jqxDropDownList('selectItem', cursorData.symbol);
                $("#jqxsnapdropdownlist").jqxDropDownList('selectItem', (cursorData.snapToPlot !== undefined) ? 'plot ' + (cursorData.snapToPlot + 1) : 'none');
                $('#jqxcheckbox1').val(cursorData.showLabel);
                $('#jqxcheckbox2').val(cursorData.showIntersections);
                */
                // show the popup window.
                $("#popupWindow").jqxWindow('show');
            } else if ($.trim($(args).text()) == "Add Cursor") {
                var x = 33 + cursorCounter * 10;
                var y = 44 + cursorCounter * 10;
                var name = 'Cursor ' + cursorCounter;
                plot.addCursor({
                    name: name,
                    position: {
                        relativeX: x,
                        relativeY: y
                    },
                    showLabel: true,
                    color: cursorColors[cursorCounter]
                });
                $("#jqxgrid").jqxGrid('addrow', null, {
                    cursorname: name,
                    x: x,
                    y: y,
                });

                cursorCounter++;
            } else {
                var rowid = $("#jqxgrid").jqxGrid('getrowid', rowindex);
                $("#jqxgrid").jqxGrid('deleterow', rowid);
                plot.removeCursor(plot.getCursors()[rowid]);
            }
        });
    }

    function populatePopupDiv(plot, div) {
        var cursorModes = [
            "xy",
            "x",
            "y",
        ];

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
        // update the edited row when the user clicks the 'Save' button.
        $("#Apply").click(function () {
            var row = $("#jqxgrid").jqxGrid('getrowdata', editrow);
            row.cursorname = $("#cursorname").val();
            var mode = $('#dropDownList').val();
            //var shape = $('#jqxshapedropdownlist').val();
            var color = $('#dropDownButton').val();
            var rowid = $("#jqxgrid").jqxGrid('getrowid', editrow);
            /*
            var snapToId = $("#jqxsnapdropdownlist").jqxDropDownList('getSelectedItem').index;
            var showLabel = $('#jqxcheckbox1').val();
            var showIntersections = $('#jqxcheckbox2').val();
            */
            $('#jqxgrid').jqxGrid('updaterow', rowid, row);

            plot.setCursor(plot.getCursors()[rowid], {
                name: row.cursorname,
                mode: mode,
                color: color
                /*,
                showLabel: showLabel,
                showIntersections: showIntersections,
                symbol: shape,
                snapToPlot: [undefined, 0, 1][snapToId]*/
            });

            $("#popupWindow").jqxWindow('hide');
        });
    }

    function populateLegendDiv(plot, div) {
        div.empty();
        
        var grid = $('<div id="jqxgrid"/>');
        grid.appendTo(div);

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

        // initialize jqxGrid
        grid.jqxGrid({
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

        grid.on('contextmenu', function () {
            return false;
        });

        grid.on('rowclick', function (event) {
            if (event.args.rightclick) {
                grid.jqxGrid('selectrow', event.args.rowindex);
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                $("#Menu").jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);

                return false;
            }
        });
        
        return grid;
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'cursors-legend',
        version: '0.1'
    });

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