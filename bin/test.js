#!/usr/bin/env node
var pngPath = process.argv[2];
if (!pngPath) {
  console.log('usage: ./test.js <pngPath>');
  process.exit(1);
}

var outPngPath = 'result.png';
var fs = require('fs');
var async = require('async');
var execFile = require('child_process').execFile;
var Png = require('../lib/png');
var Color = require('../lib/color');

async.waterfall([
  function read(next) {
    var start = Date.now();
    fs.readFile(pngPath, function(err, buffer) {
      console.log('read: %dms', Date.now()-start);
      next(err, buffer);
    });
  },
  function decode(buffer, next) {
    var start = Date.now();
    Png.decodeBuffer(buffer, function(err, png) {
      console.log('decode: %dms', Date.now()-start);
      next(err, png);
    });
  },
  function draw(png, next) {
    var start = Date.now();
    console.log('draw: %dms', Date.now()-start);
    png.line(10, 10, 100, 60, new Color(0, 255, 0), 10);
    next(null, png);
  },
  function encode(png, next) {
    var start = Date.now();
    Png.encodeBuffer(png, function(err, buffer) {
      console.log('encode: %dms', Date.now()-start);
      next(err, buffer);
    });
  },
  function write(buffer, next) {
    var start = Date.now();
    fs.writeFile(outPngPath, buffer, function(err) {
      console.log('write: %dms', Date.now()-start);
      next(err, buffer);
    });
  },
], function(err) {
  if (err) {
    console.log(err.message);
    process.exit(2);
    return;
  }
  execFile('open', [outPngPath]);
});
