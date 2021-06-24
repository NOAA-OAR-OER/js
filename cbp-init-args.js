/*
Useage:
    In HTML:
    <script>
        let currentFilter=".{filtername}"; //(any - default="*")
        let columns="4"; //(between 3 and 8 - default="4")
        let vjs=false; //(true/false - default=false)
    </script>
    Reverts to defaults if args not supplied
*/
(function($, window, document, undefined) {
    'use strict';
    let xlColumns='4'
    let lgColumns='4'
    let mdColumns='3'
    let smColumns='2'
    let xsColumns='1'
    var currentFilter = (typeof currentFilter === 'undefined') ? '*' : currentFilter;
    var vjs = (typeof vjs === 'undefined') ? false : true;
    if(typeof columns !== 'undefined') {
        // console.log(columns)
        switch (columns) {
            case '8':
                xlColumns='8'
                lgColumns='8'
                mdColumns='4'
                smColumns='2'
                xsColumns='1'
            break;
            case '6':
                xlColumns='6'
                lgColumns='6'
                mdColumns='4'
                smColumns='2'
                xsColumns='1'
            break;
            case '5':
                xlColumns='5'
                lgColumns='5'
                mdColumns='4'
                smColumns='2'
                xsColumns='1'
            break;            
            case '4':
                xlColumns='4'
                lgColumns='4'
                mdColumns='3'
                smColumns='2'
                xsColumns='1'
            break;
            case '3':
                xlColumns='3'
                lgColumns='3'
                mdColumns='3'
                smColumns='2'
                xsColumns='1'
            break;  
            case '2':
                xlColumns='2'
                lgColumns='2'
                mdColumns='2'
                smColumns='2'
                xsColumns='1'
            break;                        
        }
    }
    // init cubeportfolio
    $('#js-grid-lightbox-gallery').cubeportfolio({
        filters: '#js-filters-lightbox-gallery',
        loadMore: '#js-loadMore-lightbox-gallery',
        loadMoreAction: 'click',
        layoutMode: 'grid',
        mediaQueries: [{
				width: 1200, //xl
				cols: xlColumns
			}, {
				width: 992, //lg
				cols: lgColumns
			}, {
				width: 768, //md
				cols: mdColumns
			}, {
				width: 480, //sm
				cols: smColumns
			}, {
				width: 320, //xs
				cols: xsColumns,
                options: {
                    caption: ''
            }
        }],
        defaultFilter: currentFilter,
        search: '#js-search',
        animationType: 'fadeOut',
        gapHorizontal: 10,
        gapVertical: 10,
        gridAdjustment: 'responsive',
        caption: 'overlayBottom',
        displayType: 'default',
        displayTypeSpeed: 100,
        // lightbox
        lightboxDelegate: '.cbp-lightbox',
        lightboxGallery: true,
        lightboxTitleSrc: 'data-title',
        lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
        // singlePageInline
        singlePageInlineDelegate: '.cbp-singlePageInline',
		singlePageInlineDeeplinking: true,
        singlePageInlinePosition: 'below',
        singlePageInlineInFocus: true,
        singlePageInlineCallback: function(url, vjs) {
            // to update singlePageInline content use the following method: this.updateSinglePageInline(yourContent)
            var t = this;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                timeout: 30000
            })
            .done(function(result) {
                t.updateSinglePageInline(result);
                console.log("cbp done", $('.video-js'), vjs)
                if(vjs) {
                    var players = $('.video-js');
                    if(players.length) {
                        for(var i = 0; i < players.length; i++){
                            videojs(players[i]).ready(function() {
                                (this).videoJsResolutionSwitcher()
                            })
                        }
                    }
                }
            })
            .fail(function() {
                t.updateSinglePageInline('AJAX Error! Please refresh the page!')
            });
        },
        plugins: {
            sort: {
                element: '#js-sort',
             }
        },
    });
})(jQuery, window, document);