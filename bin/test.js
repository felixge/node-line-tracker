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
var detect = require('../lib/detect');

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
  function cells(png, next) {
    var start = Date.now();
    var range = [
      new Color(200, 50, 80),
      new Color(255, 160, 180),
    ];

    //var range = [
      //new Color(0, 0, 0),
      //new Color(25, 25, 25),
    //];

    var redCells = [];
    for (var x = 0; x < png.width(); x++) {
      for (var y = 0; y < png.height(); y++) {
        var color = png.get(x, y);
        if (
            color.red < range[0].red ||
            color.red > range[1].red ||
            color.green < range[0].green ||
            color.green > range[1].green ||
            color.blue < range[0].blue ||
            color.blue > range[1].blue
         ) {
           continue;
         }

        redCells.push({x: x, y: y});
      }
    }
    console.log('cells: %dms', Date.now()-start);
    next(null, png, redCells);
  },
  function draw(png, redCells, next) {
    var green = new Color(0, 255, 0);
    //var skip = Math.ceil(redCells.length / 1000);
    var skip = 1;

    var start = Date.now();
    for (var i = 0; i < redCells.length; i = i + skip) {
      var cell = redCells[i];
      png.set(cell.x, cell.y, new Color(255, 0, 0));
    }
    //png.line(249, 0, 267, 359, new Color(0, 255, 0), 20);
    console.log('draw: %dms', Date.now()-start);
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
