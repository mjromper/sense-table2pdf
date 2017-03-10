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

function( jquery, jsPDF, html2canvas, autotable ){


    function getColumns(data) {
        return data[0].map(function(a, pos){
            return "Header "+pos;
        });
    }
    var autoTableFromData = function ( data ) {
        var doc = new jsPDF();
        doc.autoTable(getColumns(data), data, {
            overflow: 'linebreak',
            columnWidth: 'wrap',
            styles: {cellPadding: 0.5, fontSize: 8}
        });
        doc.output('dataurlnewwindow');
    };

    return {

        do:  function( elSelector, scope ){

            var requestPage = [{
                qTop: 0,
                qLeft: 0,
                qWidth: 10, //should be # of columns (it can be worked out from API)
                qHeight: 100 //number of rows to fetch
            }];

            scope.object.backendApi.getData( requestPage )
                .then( function ( dataPage ) {
                    var data =  dataPage[0].qMatrix.map( function(row) {
                        var r = [];
                        row.forEach(function(cell) {
                            r.push(cell.qText);
                        });
                        return r;
                    });
                    autoTableFromData(data);

                } );
        }
    }

});