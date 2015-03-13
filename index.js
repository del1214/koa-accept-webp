/*!
 * accept-webp
 * Copyright(c) 2014 Mykyta Semenistyi
 * Copyright(c) 2015 Joshua Wise
 * MIT Licensed
 */

var urlParse = require('url').parse;
var pathJoin = require('path').join;
var fsStat = require('fs').stat;
var vary = require('vary');

function valueInArray(value, array) {
	for (var i=0, len=array.length; i<len; i++) {
		if (value === array[i]) return true;
	}
	return false;
}

module.exports = function(dirname, extensions) {
	if (extensions && typeof extensions === 'string') {extensions = [extensions];}
	else if (extensions == undefined) {extensions = ['jpg', 'png', 'jpeg'];}
	return function(req, res, next) {
		var method = req.method.toUpperCase();
		if (method !== 'GET' && method !== 'HEAD') {next(); return;}
		var pathname = urlParse(req.url).pathname;
		var extpos = pathname.lastIndexOf('.');
		var ext = pathname.substr(extpos + 1);
		if (valueInArray(ext, extensions)
			&& req.headers.accept
			&& req.headers.accept.indexOf('image/webp') !== -1) {
			var newPathname = pathname.substr(0, extpos) + '.webp';
			var filePath = pathJoin(dirname, newPathname);
			fsStat(filePath, function(err, stats) {
				if (err) {next();}
				else if (stats.isFile()) {
					req.url = req.url.replace(pathname, newPathname);
					vary(res, 'Accept');
					next();
				} else {
					next();
				}
			});
		} else {
			next();
		}
	};
};