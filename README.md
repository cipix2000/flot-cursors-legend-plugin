# flot-cursors-legend-plugin

Provides a legend for flot cursors.

The legend uses jqWidgets which is not free for commercial use. See <http://www.jqwidgets.com/license/> for details.

Usage
=====

*cursorsLegendDiv :* the placeholder for the cursor legend

    var plot = $.plot("#plotDiv", data, {
        cursors: [
            {
                name: 'Blue cursor',
                color: 'blue',
            }
        ],
        cursorsLegendDiv: 'cursorsLegend'
    });

Example
=======

http://cipix2000.github.io/flot-cursors-legend-plugin/example.html

Tests
=====
http://cipix2000.github.io/flot-cursors-legend-plugin/SpecRunner.html
