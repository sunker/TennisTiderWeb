var SystemBuilder = require("systemjs-builder");
var argv = require("yargs").argv;
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

var builder = new SystemBuilder();

builder.loadConfig('./public/js/systemjs.config.js')
  .then(function(){
    process.stdout.write('bundle started');
    var outputFile = argv.prod ? './public/js/bundle.min.js' : './public/js/bundle.js';
    process.stdout.write(outputFile);
    return builder.buildStatic('app', outputFile, {
      minify: argv.prod,
      mangle: argv.prod,
      rollup: argv.prod
    });
  }) 
  .then(function() {
    const gzip = zlib.createGzip();

    const inp = fs.createReadStream(path.resolve(__dirname + '/../public/js/bundle.min.js'));
    const out = fs.createWriteStream(path.resolve(__dirname + '/../public/js/bundle.min.js.gz'));

    process.stdout.write(out);

    inp.pipe(gzip).pipe(out);
    console.log(path.resolve(__dirname + '/../public/js/bundle.min.js'));
    console.log('bundle built successfully!');
  });
