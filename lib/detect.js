exports.cells = function(image, colorRange, cellSize) {
  var cellArea  = cellSize * cellSize;
  var grid      = new Grid(image.width(), image.height(), cellSize);
  var cells     = [];
  var threshold = cellArea / 2;

  var cell;
  while (cell = grid.nextCell()) {
    var xEnd      = cell.x + cellSize;
    var yEnd      = cell.y + cellSize;
    var matches   = 0;
    var remaining = cellArea;

    for (var x = cell.x; x < xEnd; x++) {
      for (var y = cell.y; y < yEnd; y++) {
        remaining--;

        var offset = (png.width * y + x) << 2;

        var i     = 0;
        var match = true;
        for (var color in colorRange) {
          var colorOffset = offset + i++;
          var range       = colorRange[color];
          var value       = png.data[colorOffset];

          match = match && value >= range[0] && value <= range[1];
        }

        if (match) {
          matches++;
        }

        // optimization: check if this cell could still be a match
        if (matches + remaining < threshold) {
          // break loop
          x = xEnd;
          y = yEnd;
        }

        if (matches >= threshold) {
          // break loop
          x = xEnd;
          y = yEnd;

          cells.push(cell);
        }
      }

    }

  }

  return cells;
};

function Grid(width, height, cellSize) {
  this._width    = width;
  this._height   = height;
  this._cellSize = cellSize;
  this._x        = 0;
  this._y        = 0;
}

Grid.prototype.nextCell = function() {
  if (this._y + this._cellSize > this._height) {
    return;
  }

  var cell = new Cell(this._x, this._y);

  if (this._x + this._cellSize < this._width) {
    this._x += this._cellSize;
  } else {
    this._x = 0;
    this._y += this._cellSize;
  }

  return cell;
};

function Cell(x, y) {
  this.x = x;
  this.y = y;
}
