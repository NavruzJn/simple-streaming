const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path");
const url = require('url');

app.use('/static', express.static(path.join(__dirname, 'trailers')));

const mimeTypes = {
    "ts": "video/MP2T",
    "m3u8": "application/vnd.apple.mpegurl"};

app.get('/', function (req, res) {
    fs.readFile( __dirname + "/trailers/trailers.json", 'utf8', function (err, data) {
        res.end( data );
    });
});

app.get('/trailers/:path/:trailerLink', function (req, res) {
    console.log(req.params.path);
    const uri = url.parse(req.url).pathname;
    const filename = path.join(process.cwd(), unescape(uri));
    let stats;

    console.log('filename '+filename);

    try {
        stats = fs.lstatSync(filename); // throws if path doesn't exist
    } catch (e) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
    }


    if (stats.isFile()) {
        // path exists, is a file
        const mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        res.writeHead(200, {'Content-Type': mimeType} );

        const fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    } else {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('500 Internal server error\n');
        res.end();
    }
});


app.listen(8081, () => {
    console.log(`server running on port 8081`)
});