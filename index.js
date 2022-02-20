// Access to Vue
var vm = window.vm;
window.mainPaper = this;

//  вогнутая               выпуклая
var LENS_TYPE_CONCAVE = 0, LENS_TYPE_CONVEX = 1;

// ANCHOR: Lense config
var LENS_TYPE = LENS_TYPE_CONVEX;
var LENS_HEIGHT = 200;
var LENS_MAX_WIDTH = 70;
var LENS_MIN_WIDTH = 20;


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
var lensPaths = [];
function drawLens() {
   var smallerEdge = 1000 / vm.LENS_FOCUS;
   var smallerMiddle = 50 / vm.LENS_FOCUS;

   if (LENS_TYPE == LENS_TYPE_CONVEX) {
      var leftArc = new Path.Arc({
         from: [view.center.x - LENS_MIN_WIDTH/2 - smallerEdge, view.center.y - LENS_HEIGHT/2],
         through: [view.center.x - LENS_MAX_WIDTH/2 - smallerMiddle, view.center.y],
         to: [view.center.x - LENS_MIN_WIDTH/2 - smallerEdge, view.center.y + LENS_HEIGHT/2],
         strokeColor: 'black',
      });
      var rightArc = new Path.Arc({
         from: [view.center.x + LENS_MIN_WIDTH/2 + smallerEdge, view.center.y - LENS_HEIGHT/2],
         through: [view.center.x + LENS_MAX_WIDTH/2 + smallerMiddle, view.center.y],
         to: [view.center.x + LENS_MIN_WIDTH/2 + smallerEdge, view.center.y + LENS_HEIGHT/2],
         strokeColor: 'black',
      });
      var topCap = new Path.Line({
         from: [view.center.x - LENS_MIN_WIDTH/2 - smallerEdge, view.center.y - LENS_HEIGHT/2],
         to: [view.center.x + LENS_MIN_WIDTH/2 + smallerEdge, view.center.y - LENS_HEIGHT/2],
         strokeColor: 'black',
      });
      var bottomCap = new Path.Line({
         from: [view.center.x - LENS_MIN_WIDTH/2 - smallerEdge, view.center.y + LENS_HEIGHT/2],
         to: [view.center.x + LENS_MIN_WIDTH/2 + smallerEdge, view.center.y + LENS_HEIGHT/2],
         strokeColor: 'black',
      });
      lensPaths = [leftArc, rightArc, topCap, bottomCap];
   }
   else if (LENS_TYPE == LENS_TYPE_CONCAVE) {
      var leftArc = new Path.Arc({
         from: [view.center.x - LENS_MAX_WIDTH/2 - smallerEdge, view.center.y - LENS_HEIGHT/2],
         through: [view.center.x - LENS_MIN_WIDTH/2 - smallerMiddle, view.center.y],
         to: [view.center.x - LENS_MAX_WIDTH/2 - smallerEdge, view.center.y + LENS_HEIGHT/2],
         strokeColor: 'black',
      });
      var rightArc = new Path.Arc({
         from: [view.center.x + LENS_MAX_WIDTH/2 + smallerEdge, view.center.y - LENS_HEIGHT/2],
         through: [view.center.x + LENS_MIN_WIDTH/2 + smallerMiddle, view.center.y],
         to: [view.center.x + LENS_MAX_WIDTH/2 + smallerEdge, view.center.y + LENS_HEIGHT/2],
         strokeColor: 'black',
      });
      var topCap = new Path.Line({
         from: [view.center.x - LENS_MAX_WIDTH/2 - smallerEdge, view.center.y - LENS_HEIGHT/2],
         to: [view.center.x + LENS_MAX_WIDTH/2 + smallerEdge, view.center.y - LENS_HEIGHT/2],
         strokeColor: 'black',
      });
      var bottomCap = new Path.Line({
         from: [view.center.x - LENS_MAX_WIDTH/2 - smallerEdge, view.center.y + LENS_HEIGHT/2],
         to: [view.center.x + LENS_MAX_WIDTH/2 + smallerEdge, view.center.y + LENS_HEIGHT/2],
         strokeColor: 'black',
      });
      lensPaths = [leftArc, rightArc, topCap, bottomCap];
   }
}
drawLens();

function removeLens() {
   lensPaths.forEach(function (path) { path.remove(); });
}

// ANCHOR: Draw lense focus
var focusLines = [];
var leftFocus, leftFocus2, middleFocus, rightFocus, rightFocus2;
function redrawFocus() {
   focusLines.forEach(function (line) { line.remove(); });

   leftFocus = new Path.Line({
      from: [view.center.x - vm.LENS_FOCUS, view.center.y - VIEW_FOCUS_HEIGHT/2],
      to: [view.center.x - vm.LENS_FOCUS, view.center.y + VIEW_FOCUS_HEIGHT/2],
      strokeColor: 'green',
   });
   leftFocus2 = new Path.Line({
      from: [view.center.x - vm.LENS_FOCUS * 2, view.center.y - VIEW_FOCUS_HEIGHT/4],
      to: [view.center.x - vm.LENS_FOCUS * 2, view.center.y + VIEW_FOCUS_HEIGHT/4],
      strokeColor: 'green',
      opacity: 0.7,
   });
   rightFocus = new Path.Line({
      from: [view.center.x + vm.LENS_FOCUS, view.center.y - VIEW_FOCUS_HEIGHT/2],
      to: [view.center.x + vm.LENS_FOCUS, view.center.y + VIEW_FOCUS_HEIGHT/2],
      strokeColor: 'green',
   });
   rightFocus2 = new Path.Line({
      from: [view.center.x + vm.LENS_FOCUS * 2, view.center.y - VIEW_FOCUS_HEIGHT/4],
      to: [view.center.x + vm.LENS_FOCUS * 2, view.center.y + VIEW_FOCUS_HEIGHT/4],
      strokeColor: 'green',
      opacity: 0.7,
   });
   middleFocus = new Path.Line({
      from: [view.center.x, view.center.y - VIEW_FOCUS_HEIGHT/2],
      to: [view.center.x, view.center.y + VIEW_FOCUS_HEIGHT/2],
      strokeColor: 'green',
   });
   
   focusLines = [leftFocus, leftFocus2, middleFocus, rightFocus, rightFocus2];
   
   if (projection) {
      projection.clear();
      projection.draw();
   }

   removeLens();
   drawLens();
}; window.redrawFocus = redrawFocus;
redrawFocus();

// ANCHOR: Draw object
function drawObject(from, to, scale, color) {
   color = color ||  '#a88';

   var objectBody = new Path.Line({
      from: from,
      to: to,
      strokeWidth: VIEW_OBJECT_WIDTH * scale,
      strokeColor: color,
   });
   var objectDirection = new Path.RegularPolygon({
      center: to,
      sides: 3,
      radius: VIEW_OBJECT_DIRECTION_SIZE * scale,
      fillColor: color,
   });
   
   return {
      body: objectBody,
      direction: objectDirection,
   };
}

// ANCHOR: Object API
function LensObject(from, to, scale, color) {
   var res = drawObject(from, to, scale, color);

   ObjectMerge(this, objectInterface);

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
      
      // 0 is max available value for x coordinate
      if (this.getBodyPoints().target.x + eventDeltaX.x > view.center.x)
         return;

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

var object;
function redrawObject() {
   if (object) {
      var shiftX = object.getBodyPoints().begin.x;
      object.remove();
      object = new LensObject([shiftX, vm.OBJECT_BEGIN[1]], [shiftX, vm.OBJECT_TARGET[1]], 1, 0);
   } else {
      object = new LensObject(vm.OBJECT_BEGIN, vm.OBJECT_TARGET, 1, 0);
   }

   if (projection) {
      projection.clear();
      projection.draw();
   }
}; window.redrawObject = function () { redrawObject() };
redrawObject();

// ANCHOR: Projection API
var projection = {
   paths: [],
   draw: function () {
      this.clear();

      var points = object.getBodyPoints();
      
      var styles = {
         strokeColor: '#aaa',
         dashArray: [4,2],
         opacity: 0.5,
      };
      var addStyles = function (obj) { return Object.assign(obj, styles); };
      
      var line = Path.Line(addStyles({
         from: [points.target.x, points.target.y],
         to: [view.center.x, points.target.y],
      }));
      this.paths.push(line);
      
      var intersections;
      
      if (LENS_TYPE == LENS_TYPE_CONVEX) {
         if (points.target.x <= view.center.x - vm.LENS_FOCUS) {
            var topLineRes = lineThrough(addStyles({
               from: [view.center.x, points.target.y], 
               through: [view.center.x + vm.LENS_FOCUS, view.center.y], 
               toX: view.bounds.right, 
               lineStorage: this.paths,
            }));
         
            var middlePoint = lineThrough(addStyles({
               from: [points.target.x, points.target.y], 
               through: [view.center.x, view.center.y], 
               toX: view.bounds.right, 
               lineStorage: this.paths,
            }));
            
            intersections = middlePoint.lines.toEnd.getIntersections(topLineRes.lines.toEnd);
         } else {
            var topLineRes = lineThrough(addStyles({
               from: [view.center.x, points.target.y], 
               through: [view.center.x + vm.LENS_FOCUS, view.center.y], 
               toX: view.bounds.left, 
               lineStorage: this.paths,
            }));
         
            var middlePoint = lineThrough(addStyles({
               from: [points.target.x, points.target.y], 
               through: [view.center.x, view.center.y], 
               toX: view.bounds.left, 
               lineStorage: this.paths,
            }));
            
            intersections = middlePoint.lines.toEnd.getIntersections(topLineRes.lines.toEnd);
         }
      } 

      else { // CONCAVE
         var topLineRes = lineThrough(addStyles({
            from: [view.center.x, points.target.y], 
            through: [view.center.x - vm.LENS_FOCUS, view.center.y], 
            toX: view.bounds.right, 
            lineStorage: this.paths,
         }));

         var toX = view.bounds.right;
         var middlePoint = lineThrough(addStyles({
            from: [points.target.x, points.target.y], 
            through: [view.center.x, view.center.y], 
            toX: toX, 
            lineStorage: this.paths,
         }));
         
         intersections = middlePoint.lines.toThrough.getIntersections(topLineRes.lines.toEnd);
      }
      
      // draw intersection
      if (intersections.length > 0) {
         var intersection = intersections[0].point;
         var scale = Math.abs(intersection.y - view.center.y) / Math.abs(vm.OBJECT_BEGIN[1] - vm.OBJECT_TARGET[1]);
         
         var projectionObject = new LensObject(
            [intersection.x, view.center.y], 
            [intersection.x, intersection.y], 
            scale,
            (points.begin.x > view.center.x-vm.LENS_FOCUS || LENS_TYPE == LENS_TYPE_CONCAVE) ? '#faa' : undefined
         );
      
         this.paths.push(projectionObject);
      }
   },

   clear: function () {
      this.paths.forEach(function (path) { path.remove() });
      this.paths = [];
   },
};



// ANCHOR: Logic
object.onMove = objectInterface.onMove = function () {
   projection.clear();
   projection.draw();
};
projection.draw();

onButtonClick('buttonToggleLens', function () {
   removeLens();
   // toggle lens type
   LENS_TYPE = LENS_TYPE == LENS_TYPE_CONCAVE ? LENS_TYPE_CONVEX : LENS_TYPE_CONCAVE;
   drawLens();
   // redraw projection
   object.onMove();
});


// ANCHOR: Paper API
function onButtonClick(buttonId, callback) {
   window.document.getElementById(buttonId).addEventListener('click', callback);
}


// ANCHOR: Helpers
function lineThrough(options) {
   var beginCoords = options.from;
   var throughCoords = options.through;
   var lineEndX = options.toX;
   var strokeColor = options.strokeColor;
   var dashArray = options.dashArray ? options.dashArray : [];
   var opacity = options.opacity ? options.opacity : 1;

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
      strokeColor: strokeColor,
      dashArray: dashArray,
      opacity: opacity,
   });
   options.lineStorage.push(line1);
   
   var dx = lineEndX - lineToThrough.to[0];
   var lineTo = [lineEndX, lineToThrough.to[1] + dx / lineToThrough.k];
   var line2 = Path.Line({
      from: lineToThrough.to,
      to: lineTo,
      strokeColor: strokeColor,
      dashArray: dashArray,
      opacity: opacity,
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

// Function for correct object merge. Recursively copy all props.
function ObjectMerge (obj1, obj2) {
   for (var p in obj2) {
      // Property in destination object set; update its value.
      if ((obj2[p] + '') == '[object Object]') {
         if (!obj1[p])
            obj1[p] = {};
         obj1[p] = ObjectMerge(obj1[p], obj2[p]);
      } 
      else
         obj1[p] = obj2[p];
   }

   return obj1;
};