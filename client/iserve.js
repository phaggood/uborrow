var static = require('node-static');
var file = new static.Server('./uborrow/www');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
}).listen(8090);
console.log("> node-static is listening on localhost:8090");
