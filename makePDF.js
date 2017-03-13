require.config({paths: {
    'jspdf': '../extensions/TablePDFexport/jspdf_lib/jspdf.debug',
    'jspdf-autotable': '../extensions/TablePDFexport/jspdf_lib/jspdf.plugin.autotable'
}});

define(
    [
        "jquery",
        "jspdf",
        "jspdf-autotable"
    ],

function( jquery, jsPDF, autotable ){


    var autoTableFromData = function ( headers, data,theme ) {
        var doc = new jsPDF();
		if(theme==1)
		{
        doc.autoTable(headers, data, {
            columnWidth: 'wrap',
            styles: {
                cellPadding: 0.5,
                fontSize: 8,
                overflow: 'linebreak'
            }
        });
		}
		else if( theme ==2)
		{
		doc.autoTable(headers, data, {
	    tableLineColor: [189, 195, 199],
        tableLineWidth: 0.75,
        styles: {
            font: 'courier',
            lineColor: [44, 62, 80],
            lineWidth: 0.75
        },
        headerStyles: {
            fillColor: [44, 62, 80],
            fontSize: 15
        },
        bodyStyles: {
            fillColor: [52, 73, 94],
            textColor: 240
        },
        alternateRowStyles: {
            fillColor: [74, 96, 117]
        },
        columnStyles: {
            email: {
                fontStyle: 'bold'
            }
        },
		});
			
		}

        //doc.output('dataurlnewwindow');
        doc.save("output.pdf");

    };

    var getPageData = function(scope, requestPage ) {
        return scope.object.backendApi.getData( requestPage )
            .then( function ( data ) {
                return pageData = data[0].qMatrix.map( function(row) {
                    var r = [];
                    row.forEach(function(cell) {
                        r.push(cell.qText);
                    });
                    return r;
                });
            } );
    };

    function fetchAllDataPages( scope, arrayOfPages ) {
        return arrayOfPages.reduce(function(promise, page) {
            return promise.then( function(total) {
                return getPageData(scope, page).then(function(data) {
                    return total.concat(data);
                });
            });
        }, Promise.resolve([]));
    }


    return {

        do:  function( scope,theme ){

            //Headers
            var dimensions = scope.object.layout.qHyperCube.qDimensionInfo,
                measures = scope.object.layout.qHyperCube.qMeasureInfo;

            var headers = [];
            dimensions.forEach(function(d){
                headers.push(d.qFallbackTitle);
            });
            measures.forEach(function(m){
                headers.push(m.qFallbackTitle);
            });
            //----


            //Data
            var count = 500,
                numpages = Math.ceil(scope.object.backendApi.getRowCount()/count),
                arrayOfPages = [];

            for ( var i=0; i<numpages; i++){
                var pageRequest = [{
                    qTop: i*count,
                    qLeft: 0,
                    qWidth: scope.object.layout.qHyperCube.qSize.qcx, //should be # of columns (it can be worked out from API)
                    qHeight: count //number of rows to fetch
                }]
                arrayOfPages.push(pageRequest);
            }

            fetchAllDataPages(scope, arrayOfPages).then(function( res ) {
                autoTableFromData(headers, res,theme);
            });
            //-----



        }
    }

});