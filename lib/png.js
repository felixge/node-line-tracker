var PNG = require('pngjs').PNG;
var Image = require('./image');
var Color = require('./color');
var util = require('util');

module.exports = Png;
util.inherits(Png, Image);
function Png(png) {
  this._png = png;
}

Png.prototype.get = function(x, y) {
  var offset = (this.width() * y + x) << 2;
  return new Color(
    this._png.data[offset + 0],
    this._png.data[offset + 1],
    this._png.data[offset + 2]
  );
};

Png.prototype.set = function(x, y, color) {
  var offset = (this.width() * y + x) << 2;
  this._png.data[offset + 0] = color.red || 0;
  this._png.data[offset + 1] = color.green || 0;
  this._png.data[offset + 2] = color.blue || 0;
};

Png.prototype.width = function() {
  return this._png.width;
};

Png.prototype.height = function() {
  return this._png.height;
};


// decodeBuffer parses a given buffer as a png and calls cb with the result
// when done.
Png.decodeBuffer = function(buffer, cb) {
  // not sure what 4 means, but it makes things work : )
  var png = new PNG({filterType: 4});

  // @TODO error handling
  png.on('parsed', function() {
    cb(null, new Png(png));
  });

  png.write(buffer);
  png.end();
}

// encodeBuffer takes a png and calls cb after turning it into a buffer.
Png.encodeBuffer = function(png, cb) {
  var stream = png._png.pack();
  var buffers = [];
  stream
    .on('data', function(buffer) {
      buffers.push(buffer);
    })
    .on('end', function() {
      return cb(null, Buffer.concat(buffers));
    });
};
