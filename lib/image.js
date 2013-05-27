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

  // The algorithm below below decides if f(x) or f(y) is a better function
  // (given the slope of the line) and then uses it to draw a line of a given
  // width.
  // @TODO: Fix width algorithm using inverse function.

  // y = f(x) = m*x + y1
  if ((x2-x1) > (y2-y1)) {
    var m = yLen / xLen;
    for (var x = x1; x <= x2; x++) {
      var y = Math.round(m * (x-x1)) + y1;
      for (var i = 0; i < width; i++) {
        this.set(x, y + Math.round(width / 2) + i, color);
      }
    }
  // x = f(y) = m*y + x1
  } else {
    var m = xLen / yLen;
    for (var y = y1; y <= y2; y++) {
      var x = Math.round(m * (y-y1)) + x1;
      for (var i = 0; i < width; i++) {
        this.set(x - Math.round(width / 2) + i, y, color);
      }
    }
  }
};
