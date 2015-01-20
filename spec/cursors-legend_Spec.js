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

    it('should show the name of the cursor as the first entry on the grid', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                }
            ],
            cursorsLegendDiv: 'cursorsLegend'
        });

        jasmine.clock().tick(20);

        var name = $('#row0jqxgrid').children('.jqx-grid-cell').first().text();

        expect(name).toBe('Blue cursor');
    });

    it('should show the new name of the cursor when the name changes', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                }
            ],
            cursorsLegendDiv: 'cursorsLegend'
        });

        jasmine.clock().tick(20);

        plot.setCursor(plot.getCursors()[0], {
            name: 'Red cursor'
        });

        jasmine.clock().tick(20);

        var name = $('#row0jqxgrid').children('.jqx-grid-cell').first().text();
        expect(name).toBe('Red cursor');
    });

    it('should show the x and y coordinates of the cursor as the second and third value on the grid', function () {
        plot = $.plot("#placeholder", [sampledata], {
            cursors: [
                {
                    name: 'Blue cursor',
                    color: 'blue',
                    position: {
                        x: 1,
                        y: 1.1
                    }
                }
            ],
            cursorsLegendDiv: 'cursorsLegend'
        });

        jasmine.clock().tick(20);

        var row0 = $('#row0jqxgrid');
        var x = row0.children('.jqx-grid-cell').eq(1).text();
        var y = row0.children('.jqx-grid-cell').last().text();

        expect(parseFloat(x)).toBe(1);
        expect(parseFloat(y)).toBe(1.1);
    });

    describe('Interaction', function () {
        it('should open the context menu on right clicking on a cursor row', function () {
            plot = $.plot("#placeholder", [sampledata], {
                cursors: [
                    {
                        name: 'Blue cursor',
                        color: 'blue',
                        position: {
                            x: 1,
                            y: 1.1
                        }
                    }
                ],
                cursorsLegendDiv: 'cursorsLegend'
            });

            var element = $('#row0jqxgrid');

            var name = $('#row0jqxgrid').children('.jqx-grid-cell').first();

            name.trigger({
                type: 'mousedown',
                pageX: name.offset().left,
                clientX: name.offset().left,
                pageY: name.offset().top,
                clientY: name.offset().top,
                which: 3
            });

            jasmine.clock().tick(1000);

            expect(true).toBe(false);
        });
    });
});