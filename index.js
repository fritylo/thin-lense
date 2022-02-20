//  вогнутая               выпуклая
var LENS_TYPE_CONCAVE = 0, LENS_TYPE_CONVEX = 1;

// ANCHOR: Lense config
var LENS_TYPE = LENS_TYPE_CONVEX;
var LENS_HEIGHT = 200;
var LENS_MAX_WIDTH = 100;
var LENS_MIN_WIDTH = 50;

var LENS_FOCUS = 100;


// ANCHOR: Object config
var OBJECT_BEGIN = [100, view.center.y + 0];
var OBJECT_TARGET = [100, view.center.y - 40];


// ANCHOR: View config
var VIEW_FOCUS_HEIGHT = 20;
var VIEW_OBJECT_WIDTH = 10;
var VIEW_OBJECT_DIRECTION_SIZE = VIEW_OBJECT_WIDTH * 7/5;


// ANCHOR: Draw axis
var yAxis = Path.Line({ 
   from: [view.center.x, view.bounds.top], 
   to: [view.center.x, view.bounds.bottom],
   strokeColor: '#888',
});
var xAxis = Path.Line({ 
   from: [view.bounds.left, view.center.y], 
   to: [view.bounds.right, view.center.y],
   strokeColor: '#888',
});

// ANCHOR: Draw lense
if (LENS_TYPE == LENS_TYPE_CONVEX) {
   var leftArc = new Path.Arc({
      from: [view.center.x - LENS_MIN_WIDTH/2, view.center.y - LENS_HEIGHT/2],
      through: [view.center.x - LENS_MAX_WIDTH/2, view.center.y],
      to: [view.center.x - LENS_MIN_WIDTH/2, view.center.y + LENS_HEIGHT/2],
      strokeColor: 'black',
   });
   var rightArc = new Path.Arc({
      from: [view.center.x + LENS_MIN_WIDTH/2, view.center.y - LENS_HEIGHT/2],
      through: [view.center.x + LENS_MAX_WIDTH/2, view.center.y],
      to: [view.center.x + LENS_MIN_WIDTH/2, view.center.y + LENS_HEIGHT/2],
      strokeColor: 'black',
   });
   var topCap = new Path.Line({
      from: [view.center.x - LENS_MIN_WIDTH/2, view.center.y - LENS_HEIGHT/2],
      to: [view.center.x + LENS_MIN_WIDTH/2, view.center.y - LENS_HEIGHT/2],
      strokeColor: 'black',
   });
   var bottomCap = new Path.Line({
      from: [view.center.x - LENS_MIN_WIDTH/2, view.center.y + LENS_HEIGHT/2],
      to: [view.center.x + LENS_MIN_WIDTH/2, view.center.y + LENS_HEIGHT/2],
      strokeColor: 'black',
   });
}
else if (LENS_TYPE == LENS_TYPE_CONCAVE) {
   var leftArc = new Path.Arc({
      from: [view.center.x - LENS_MAX_WIDTH/2, view.center.y - LENS_HEIGHT/2],
      through: [view.center.x - LENS_MIN_WIDTH/2, view.center.y],
      to: [view.center.x - LENS_MAX_WIDTH/2, view.center.y + LENS_HEIGHT/2],
      strokeColor: 'black',
   });
   var rightArc = new Path.Arc({
      from: [view.center.x + LENS_MAX_WIDTH/2, view.center.y - LENS_HEIGHT/2],
      through: [view.center.x + LENS_MIN_WIDTH/2, view.center.y],
      to: [view.center.x + LENS_MAX_WIDTH/2, view.center.y + LENS_HEIGHT/2],
      strokeColor: 'black',
   });
   var topCap = new Path.Line({
      from: [view.center.x - LENS_MAX_WIDTH/2, view.center.y - LENS_HEIGHT/2],
      to: [view.center.x + LENS_MAX_WIDTH/2, view.center.y - LENS_HEIGHT/2],
      strokeColor: 'black',
   });
   var bottomCap = new Path.Line({
      from: [view.center.x - LENS_MAX_WIDTH/2, view.center.y + LENS_HEIGHT/2],
      to: [view.center.x + LENS_MAX_WIDTH/2, view.center.y + LENS_HEIGHT/2],
      strokeColor: 'black',
   });
}

// ANCHOR: Draw lense focus
var leftFocus = new Path.Line({
   from: [view.center.x - LENS_FOCUS, view.center.y - VIEW_FOCUS_HEIGHT/2],
   to: [view.center.x - LENS_FOCUS, view.center.y + VIEW_FOCUS_HEIGHT/2],
   strokeColor: 'green',
});
var rightFocus = new Path.Line({
   from: [view.center.x + LENS_FOCUS, view.center.y - VIEW_FOCUS_HEIGHT/2],
   to: [view.center.x + LENS_FOCUS, view.center.y + VIEW_FOCUS_HEIGHT/2],
   strokeColor: 'green',
});
var middleFocus = new Path.Line({
   from: [view.center.x, view.center.y - VIEW_FOCUS_HEIGHT/2],
   to: [view.center.x, view.center.y + VIEW_FOCUS_HEIGHT/2],
   strokeColor: 'green',
});

// ANCHOR: Draw object
function drawObject(from, to, scale, rotationDegree) {
   var objectBody = new Path.Line({
      from: from,
      to: to,
      strokeWidth: VIEW_OBJECT_WIDTH * scale,
      strokeColor: '#a88',
   });
   var objectDirection = new Path.RegularPolygon({
      center: to,
      sides: 3,
      radius: VIEW_OBJECT_DIRECTION_SIZE * scale,
      fillColor: '#a88',
   });
   
   return {
      body: objectBody,
      direction: objectDirection,
   };
}

// ANCHOR: Object API
function LensObject(from, to, scale, rotationDegree) {
   var res = drawObject(from, to, scale, rotationDegree);

   Object.assign(this, objectInterface);

   this.direction.path = res.direction;
   this.direction.root = this;
   this.body = res.body;

   this.bodySegments = {
      begin: res.body.segments[0],
      target: res.body.segments[1],
   };
   
   this.init();
}
var objectInterface = {
   direction: {
      path: null,
      root: null,
      
      init: function () {
         this.renderRotate();
      },

      rotation: 0,
      renderRotate: function () {
         var bodyPoints = this.root.getBodyPoints();
         
         var legX = bodyPoints.target.x - bodyPoints.begin.x;
         var legY = bodyPoints.target.y - bodyPoints.begin.y;
         
         var rotation;
         // if target lower than begin
         if (bodyPoints.target.y > bodyPoints.begin.y) {
            rotation = ( this._radianToDegree(Math.atan(legX / legY)) * -1 ) + 180;
         } else {
            rotation = ( this._radianToDegree(Math.atan(legX / legY)) * -1 );
         }

         this.path.rotate(
            rotation - this.rotation, // rotation in degrees
            this._centroid(this.path) // rotation center
         );
         
         this.rotation = rotation;
      },
      
      _centroid: function (triangle) {
         var segments = triangle.segments;
         var vertex = segments[0].point;
         var opposite = segments[1].point - (segments[1].point - segments[2].point) / 2;
         var c = vertex + (opposite - vertex) * 2 / 3;
         return c;
      },
      _radianToDegree: function (n) {
         return  n * 180 / Math.PI;
      },
   },
   
   body: null,

   init: function () {
      this.direction.init();
      
      this.body.sendToBack();
      this.direction.path.sendToBack();

      this.body.onMouseDrag = this.move.bind(this);
   },
   
   move: function (event) {
      var eventDeltaX = new Point(event.delta.x, 0)

      this.moveBeginBy(eventDeltaX);
      this.moveTargetBy(eventDeltaX);

      this.direction.renderRotate();
      
      if (this.onMove)
         this.onMove();
   },
   
   onMove: null,

   moveBeginBy: function (delta) {
      this.getBodySegments().begin.point += delta;
   },
   moveTargetBy: function (delta) {
      this.getBodySegments().target.point += delta;
      this.direction.path.position += delta;
   },

   bodySegments: {
      begin: null,
      target: null,
   },
   getBodySegments: function () {
      return {
         begin: this.bodySegments.begin,
         target: this.bodySegments.target,
      };
   },
   getBodyPoints: function () {
      var segments = this.getBodySegments();
      return {
         begin: segments.begin.point,
         target: segments.target.point,
      };
   },

   _distance: function (point1, point2) {
      return Math.pow(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2), 0.5);
   },
   
   remove: function () {
      this.body.remove();
      this.direction.path.remove();
   }
};
var object = new LensObject(OBJECT_BEGIN, OBJECT_TARGET, 1, 0);

var projection = {
   lines: [],
   draw: function () {
      this.clear();

      var points = object.getBodyPoints();
      var color = '#f00';
      
      var line = Path.Line({
         from: [points.target.x, points.target.y],
         to: [view.center.x, points.target.y],
         strokeColor: color,
      });
      this.lines.push(line);
      
      var topLineRes = lineThrough({
         from: [view.center.x, points.target.y], 
         through: [view.center.x + LENS_FOCUS, view.center.y], 
         toX: view.bounds.right, 
         color: color,
         lineStorage: this.lines,
      });

      var toX = view.center.x;
      if (points.target.x > view.center.x - LENS_FOCUS)
         toX = view.bounds.left;
      var middlePoint = lineThrough({
         from: [points.target.x, points.target.y], 
         through: [view.center.x - LENS_FOCUS, view.center.y], 
         toX: toX, 
         color: color,
         lineStorage: this.lines,
      });
      
      var lineHoriz = Path.Line({
         from: [middlePoint.x, middlePoint.y],
         to: [view.bounds.right, middlePoint.y],
         strokeColor: color,
      });
      this.lines.push(lineHoriz);
      
      var intersections = lineHoriz.getIntersections(topLineRes.lines.toEnd);
      if (intersections.length > 0) {
         var intersection = intersections[0].point;
         var scale = Math.abs(intersection.y - view.center.y) / Math.abs(OBJECT_BEGIN[1] - OBJECT_TARGET[1]);
         var projectionObject = new LensObject([intersection.x, view.center.y], [intersection.x, intersection.y], scale, 180);
         this.lines.push(projectionObject);
      }
   },

   clear: function () {
      this.lines.forEach(function (line) { line.remove() });
      this.lines = [];
   },
};



// ANCHOR: Logic
object.onMove = function () {
   projection.clear();
   projection.draw();
};
projection.draw();


// ANCHOR: Paper API
function onButtonClick(buttonId, callback) {
   window.document.getElementById(buttonId).addEventListener('click', callback);
}


// ANCHOR: Helpers
function lineThrough(options) {
   var beginCoords = options.from;
   var throughCoords = options.through;
   var lineEndX = options.toX;
   var color = options.color;

   var lineToThrough = {
      from: beginCoords,
      to: throughCoords,
      init: function () {
         this.dx = (this.from[0] - this.to[0]);
         this.dy = (this.from[1] - this.to[1]);
         this.k = this.dx / this.dy;
      },
   };
   lineToThrough.init();

   var line1 = Path.Line({
      from: lineToThrough.from,
      to: lineToThrough.to,
      strokeColor: color,
   });
   options.lineStorage.push(line1);
   
   var dx = lineEndX - lineToThrough.to[0];
   var lineTo = [lineEndX, lineToThrough.to[1] + dx / lineToThrough.k];
   var line2 = Path.Line({
      from: lineToThrough.to,
      to: lineTo,
      strokeColor: color,
   });
   options.lineStorage.push(line2);

   return {
      x: lineTo[0],
      y: lineTo[1],
      lines: {
         toThrough: line1,
         toEnd: line2,
      },
   };
}