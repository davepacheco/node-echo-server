/*
 * echo-server.js: HTTP server that echoes back all of the request parameters.
 */

var mod_http = require('http');
var mod_url = require('url');
var mod_querystring = require('querystring');

var server;

function main()
{
	server = mod_http.createServer(onRequest);
	server.listen(onListening);
}

function onListening()
{
	console.log('listening at ', server.address());
}

function onRequest(request, response)
{
	var rv;

	if (request.method != 'GET') {
		response.writeHeader(405);
		response.end();
	}

	rv = {};
	rv.method = request.method
	rv.url = request.url;
	rv.headers = request.headers;
	rv.nbytesRead = 0;
	rv.urlParsed = mod_url.parse(request.url);
	if (Object.hasOwnProperty.call(rv.urlParsed, 'query')) {
		rv.queryParams = mod_querystring.parse(rv.urlParsed.query);
	}

	request.on('data', function (chunk) {
		rv.nbytes += chunk.length;
	});

	request.on('end', function () {
		response.writeHead(200);
		response.write(JSON.stringify(rv, null, 4));
		response.end();
	});
}

main();
