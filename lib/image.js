// Defines the Image interface, meant to be sub-classed by specific
// implementations.

module.exports = Image;
function Image() {}

Image.prototype.get = function(x, y) {
  throw new Error('not implemented');
};

Image.prototype.set = function(x, y, color) {
  throw new Error('not implemented');
};

Image.prototype.width = function() {
  throw new Error('not implemented');
};

Image.prototype.height = function() {
  throw new Error('not implemented');
};

Image.prototype.line = function(x1, y1, x2, y2, color, width) {
  width = width || 1

  var tmp;
  if (x1 > x2) {
    tmp = x1;
    x1 = x2;
    x2 = tmp;
  }
  if (y1 > y2) {
    tmp = y1;
    y1 = y2;
    y2 = tmp;
  }

  var xLen = x2 - x1;
  var yLen = y2 - y1;

  if ((x2-x1) > (y2-y1)) {
    var m = yLen / xLen;
    for (var x = x1; x <= x2; x++) {
      var y = y1 + Math.round(m * (x-x1));
      for (var i = 0; i < width; i++) {
        this.set(x, y + Math.round(width / 2) + i, color);
      }
    }
  } else {
    var m = xLen / yLen;
    for (var y = y1; y <= y2; y++) {
      var x = x1 + Math.round(m * (y-y1));
      for (var i = 0; i < width; i++) {
        this.set(x - Math.round(width / 2) + i, y, color);
      }
    }
  }
};

// x1 = 10
// y1 = 10
// x2 = 50
// y2 = 20,
