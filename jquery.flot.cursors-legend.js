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
        var grid, menu, popup;

        plot.hooks.processOptions.push(function (plot, options) {

            if (options.cursorsLegendDiv === undefined) {
                return;
            }

            if (options.cursorsLegendDiv === null) {
                legendDiv = $('<div id="autoDiv" style="position: absolute; height: 100px;width: 400px; top: ' +
                    (plot.getPlaceholder().offset().top + plot.getPlaceholder().height() + 10) + 'px; left:' +
                    (plot.getPlaceholder().offset().left + 50) + 'px;"\>');
                legendDiv.appendTo(plot.getPlaceholder().parent());
            } else {
                legendDiv = $('#' + options.cursorsLegendDiv);
            }

            if (!legendDiv) {
                return;
            }

            grid = populateLegendDiv(plot, legendDiv);
            popup = populatePopupDiv(plot, legendDiv);
            menu = populateMenuDiv(plot, legendDiv);

            plot.hooks.bindEvents.push(function (plot) {
                plot.getPlaceholder().bind('cursorupdates', onCursorUpdates);
            });

            plot.hooks.shutdown.push(function (plot) {
                plot.getPlaceholder().unbind('cursorupdates');
                grid.jqxGrid('destroy');
                menu.jqxMenu('destroy');
                popup.jqxWindow('destroy');
                //popUp.destroy();
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
        ['Edit Selected Cursor', 'Delete Selected Cursor', 'Add Cursor'].forEach(function (menu, i) {
            $('<li id="item' + i + '">' + menu + '</li>').appendTo(list);
        });

        // create context menu
        var contextMenu = $("#Menu").jqxMenu({
            animationShowDelay: 0,
            animationHideDelay: 0,
            animationShowDuration: 0,
            animationHideDuration: 0,
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
                $('#jqxcheckbox1').val(cursorData.showLabel);
                $('#jqxcheckbox2').val(cursorData.showValuesRelativeToSeries === 0);
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

        return menu;
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
        bodyDiv.append('<br>');
        bodyDiv.append('<span id="modeText">Mode</span>');
        bodyDiv.append('<div id="dropDownList"\>');
        bodyDiv.append('<div id="jqxcheckbox1">Show Label</div>');
        bodyDiv.append('<div id="jqxcheckbox2">Show Value</div>');
        bodyDiv.append('<input style="margin-right: 5px;" type="button" id="Apply" value="Apply" />');
        bodyDiv.append('<input id="Cancel" type="button" value="Cancel" />');

        // initialize the input fields.
        $("#cursorname").addClass('jqx-input');
        $("#cursorname").width(200);
        $("#cursorname").height(23);

        // initialize the popup window and buttons.
        popup.jqxWindow({
            width: 400,
            height: 200,
            resizable: false,
            isModal: true,
            autoOpen: false,
            cancelButton: $("#Cancel"),
            modalOpacity: 0.01
        });
        $("#Cancel").jqxButton({});
        $("#Apply").jqxButton({});

        $("#jqxcheckbox1").jqxCheckBox({
            //width: 120,
            height: 25
        });
        $("#jqxcheckbox2").jqxCheckBox({
            //width: 120,
            height: 25
        });

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
            var rowid = $("#jqxgrid").jqxGrid('getrowid', editrow);
            /*
            var snapToId = $("#jqxsnapdropdownlist").jqxDropDownList('getSelectedItem').index;
            */
            var showLabel = $('#jqxcheckbox1').val();
            var showValue = $('#jqxcheckbox2').val();

            $('#jqxgrid').jqxGrid('updaterow', rowid, row);

            plot.setCursor(plot.getCursors()[rowid], {
                name: row.cursorname,
                mode: mode,
                showLabel: showLabel,
                showValuesRelativeToSeries: showValue ? 0 : null,
                /*
                symbol: shape,
                snapToPlot: [undefined, 0, 1][snapToId]*/
            });

            popup.jqxWindow('hide');
        });

        return popup;
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

        grid.on('contextmenu', function (event) {
            /*
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            $("#Menu").jqxMenu('disable', 'item0', true);
            $("#Menu").jqxMenu('disable', 'item1', true);
            $("#Menu").jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);

            event.stopPropagation();
            event.preventDefault();
            */
            return false;
        });

        grid.on('rowclick', function (event) {
            if (event.args.rightclick) {
                grid.jqxGrid('selectrow', event.args.rowindex);
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                $("#Menu").jqxMenu('disable', 'item0', false);
                $("#Menu").jqxMenu('disable', 'item1', false);
                $("#Menu").jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);

                event.stopPropagation();
                event.preventDefault();

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
})(jQuery);