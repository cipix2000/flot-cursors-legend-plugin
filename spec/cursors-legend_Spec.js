/* global $, describe, it, xit, after, beforeEach, afterEach, expect, jasmine, spyOn */
/* jshint browser: true*/

describe('Flot cursors legend', function () {
    'use strict';

    var sampledata = [[0, 1], [1, 1.1], [2, 1.2]];
    var plot;

    beforeEach(function () {
        jasmine.clock().install();
    });

    afterEach(function () {
        if (plot) {
            plot.shutdown();
        }
        $('#placeholder').empty();
        $('#cursorsLegend').empty();
        jasmine.clock().uninstall();
    });

    it('should be possible to specify a cursor legend when creating the plot', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                }
            ],
            cursorsLegendDiv: 'cursorsLegend'
        });
    });
    
    it('should clear the content of the div given before populating it', function () {
        var marker = 'abcdefghij';
        $('#cursorsLegend').append(marker);
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                }
            ],
            cursorsLegendDiv: 'cursorsLegend'
        });
        
        expect($('#cursorsLegend').text()).not.toContain(marker);
    });

});