define(["require", "exports"], function (require, exports) {
    "use strict";
    var CsvDownloader = (function () {
        function CsvDownloader() {
        }
        CsvDownloader.prototype.downloadCsv = function (data) {
            var data, filename, link;
            var csv = this.convertArrayOfObjectsToCSV({
                data: data
            });
            if (csv == null)
                return;
            filename = data.filename || 'export.csv';
            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            data = encodeURI(csv);
            link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', filename);
            link.click();
        };
        CsvDownloader.prototype.convertArrayOfObjectsToCSV = function (args) {
            var result, ctr, keys, columnDelimiter, lineDelimiter, data;
            data = args.data || null;
            if (data == null || !data.length) {
                return null;
            }
            columnDelimiter = args.columnDelimiter || ',';
            lineDelimiter = args.lineDelimiter || '\n';
            keys = Object.keys(data[0]);
            result = '';
            result += keys.join(columnDelimiter);
            result += lineDelimiter;
            data.forEach(function (item) {
                ctr = 0;
                keys.forEach(function (key) {
                    if (ctr > 0)
                        result += columnDelimiter;
                    result += item[key];
                    ctr++;
                });
                result += lineDelimiter;
            });
            return result;
        };
        return CsvDownloader;
    }());
    return new CsvDownloader();
});
//# sourceMappingURL=csvDownloader.js.map