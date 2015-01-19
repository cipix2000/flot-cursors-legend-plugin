/*global jQuery, $*/
/*jshint browser: true*/

$(function () {
    'use strict';
    var plot;
    var offset = 0.0;
    var sin = [],
        cos = [];

    function updateData() {
        sin = [];
        cos = [];
        offset += 0.025;
        for (var i = 0; i < 14; i += 0.1) {
            sin.push([i, Math.sin(i + offset)]);
            cos.push([i, Math.cos(i + offset)]);
        }
    }

    function updateChart() {
        setTimeout(updateChart, 16);

        if ($('#checkbox').prop('checked')) {
            updateData();

            plot.setData([
                {
                    data: sin,
                    label: "sin(x)"
                },
                {
                    data: cos,
                    label: "cos(x)"
                }
            ]);

            plot.setupGrid();
            plot.draw();
        }
    }

    updateData();
    plot = $.plot("#placeholder", [
        {
            data: sin,
            label: "sin(x)"
        },
        {
            data: cos,
            label: "cos(x)"
        }
    ], {
        series: {
            lines: {
                show: true
            }
        },
        cursors: [
            {
                name: 'Red cursor',
                mode: 'x',
                color: '#ff0000',
                showIntersections: false,
                showLabel: true,
                symbol: 'triangle',
                position: {
                    relativeX: 200,
                    relativeY: 300
                }
            },
            {
                name: 'Blue cursor',
                mode: 'xy',
                color: '#0000ff',
                showIntersections: true,
                snapToPlot: 1,
                symbol: 'diamond',
                position: {
                    relativeX: 400,
                    relativeY: 20
                }
            },
            {
                name: 'Green cursor',
                mode: 'y',
                color: '#00a000',
                showIntersections: true,
                symbol: 'cross',
                showValuesRelativeToSeries: 0,
                showLabel: true,
                position: {
                    relativeX: 100,
                    relativeY: 200
                }
            }
        ],
        cursorsLegendDiv: 'cursorLegend',
        grid: {
            hoverable: true,
            clickable: true,
            autoHighlight: false
        },
        yaxis: {
            min: -1.2,
            max: 1.2
        }
    });

    updateChart();
});