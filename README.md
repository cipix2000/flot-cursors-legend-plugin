# flot-cursors-legend-plugin

Provides a legend for flot cursors.

The legend uses jqWidgets which is not free for commercial use. See <http://www.jqwidgets.com/license/> for details.

Usage
=====

Include both jquery.flot.cursors and jquery.flot.cursors-legend plugins in your page.
The cursor legend is placed into a div that you need to specify by adding cursorsLegendDiv
option to the plot:

*cursorsLegendDiv :* the placeholder div for the cursor legend

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
