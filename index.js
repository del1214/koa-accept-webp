/*!
 * accept-web-images
 * Copyright(c) 2014 Mykyta Semenistyi
 * Copyright(c) 2015 Joshua Wise
 * MIT Licensed
 */

var parseurl = require('parseurl'),
	path = require('path'),
	fs = require('fs'),
	ua = require('useragent');
	require('useragent/features');
	
function valueInArray(value, array) {
	for (var i=0, len=array.length; i<len; i++) {
		if (value === array[i]) return true;
	}
	return false;
}

module.exports = function(dirname, extensions) {
	function updateReqUrl(ext, req, res, next, pathname, extpos) { // TODO check this out
		var canBeReplaced = false,
			resultFilename = '',
			tempPathname = pathname.substr(0, extpos) + '.' + ext,
			tempFilename = path.normalize(dirname + tempPathname);
			fs.stat(tempFilename, function(err, stats) {
				if (err) {next();}
				else if (stats.isFile()) {
					req.originalUrl = req.url;
					req.url = req.url.replace(pathname, tempPathname);	
					res.setHeader('Vary', 'Accept');
					next();
				}
			});
	}
	return function(req, res, next) {
		var parsed = parseurl(req),
			pathname = parsed.pathname,
			extpos = pathname.lastIndexOf('.'),
			ext = pathname.substr(extpos + 1);
		if (valueInArray(ext, extensions)) {
			if (req.headers.accept && req.headers.accept.indexOf('image/webp') !== -1) {
				updateReqUrl('webp', req, res, next, pathname, extpos);
			} else if (req.headers['user-agent']) {
				var uaString = req.headers['user-agent'],
					is = ua.is(uaString),
					agent = ua.parse(uaString);
				if ((is.chrome && agent.satisfies('>=23.0.0'))
					||  (is.opera && agent.satisfies('>=12.1'))
					||  (is.android && agent.satisfies('>=4.0'))) {
					
					updateReqUrl('webp', req, res, next, pathname, extpos);

				} else if (is.ie && agent.satisfies('>=9.0')) {
					updateReqUrl('jxr', req, res, next, pathname, extpos);
				}
			}
		}
		next();
	};
};