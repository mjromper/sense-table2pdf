define( [
    "jquery",
    "qlik",
    "./makePDF",
    "css!./TablePDFexport.css"    
],

    function ( jquery,qlik, makePDF ) {
        $( '<link href="https://fonts.googleapis.com/icon?family=Material+Icons"rel="stylesheet">' ).appendTo( "head" );

        function toggleId () {
            var cnt = $( ".SmartExport-tooltip" ).remove();
            if ( cnt.length === 0 ) {
                $( '.qv-object, .qv-panel-sheet' ).each( function ( i, el ) {
                    var s = angular.element( el ).scope();
                    if ( s.layout || (s.$$childHead && s.$$childHead.layout) ) {
                        if(s.model.layout.qInfo.qType == 'table' || s.model.layout.qInfo.qType == 'pivot-table'){
                            var layout = s.layout || s.$$childHead.layout, model = s.model || s.$$childHead.model;
                            $( el ).append( '<div class="SmartExport-tooltip">' +
                            '<a class="SmartExport-btn" title="properties"><i class="small material-icons">input</i></a>' +

                            "</div>" );
                        }
                        $( el ).find( '.SmartExport-btn' ).on( 'click', function () {

                            makePDF.do("#QV01", s);

                        })
                    }
                } );
            }
        }

        return {
            initialProperties: {
                version: 1.0,
                showTitles: false
            }, paint: function ( $element ) {
                $( ".SmartExport-btn" ).remove();
                $( document.body ).append( "<button class='SmartExport-btn fab'><i class='material-icons'>get_app</i></button>" );
                $( ".SmartExport-btn" ).on( "click", toggleId );
            }
        };

    } );
