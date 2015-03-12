## Installation
`$ npm install accept-webp`

## Overview
This is a piece of middlewear that can be used with [Express](http://expressjs.com/) and [Connect](https://github.com/senchalabs/connect/).

This middlewear first looks at the `Accept` header of the HTTP request, and searches for `image/webp`. If the search is successful, it checks the filesystem for a file of the same name but with the .webp extension (myImage.webp instead of myImage.jpg). If it exists, `req.url` is changed so that other middleware (e.g. `express.static`) will serve webp format.  
`req.originalUrl` is unchanged (unlike the pre-forked version), so all future middlewear can rely on the integrity of the `originalUrl` property.

Also upon success, the `Vary` header is set to `Accept` so that caching
proxies can distingiuish which content to load for the same requested url.

The first argument of accept-webp (required) is the path to your static assets on the filesystem. It should generally be the same path that you pass to `express.static`.
The second argument (optional) is either a single file extension (string) or a list of file extensions (array) for accept-webp to act upon.  
accept-webp will not touch requests for file formats that are not in this list. If this argument omitted, it defaults to `['jpg', 'png', 'jpeg']`.

## Usage
```
var acceptWebp = require('accept-webp');
var express = require('express'); 
var app = express();

var staticPath = __dirname + '/static';

app.use(acceptWebp(staticPath, ['jpg', 'jpeg', 'png']));
app.use(express.static(staticPath));
```

**Warning**: accept-webp should be used before any middleware that is serving files (e.g. `express.static`) so that they know to serve the webp format file.

## Why the fork?
* I didn't like the idea of parsing the User Agent string to determine file format support.
* I wanted the ability to define which file types are looked at, and which are ignored
* The original version didn't allow the module to be used on multiple [apps/routers](http://expressjs.com/4x/api.html#router) each with different static file paths in Express. It shared the same `path` argument across each instance of the middlewear.

## License

The MIT License (MIT)

Copyright (c) 2014 Semenistyi Mykyta nikeiwe@gmail.com
Copyright (c) 2015 Joshua Wise josh@joshuawise.ninja

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
