var canvas = document.querySelector('#screen');
var ctx = canvas.getContext('2d');
ctx.strokeStyle='white';

function to_pixels(x,y) {
  var px = (x + 1) * canvas.width/2;
  var py = (-y + 1) * canvas.height/2;
  return [px,py];
}

function draw_pixel(x, y) {
  var px = to_pixels(x,y);
  ctx.fillRect(px[0]-1,px[1]-1,2,2);
}

function draw_line(x1,y1,x2,y2) {
  var px1 = to_pixels(x1,y1);
  var px2 = to_pixels(x2,y2);
  ctx.beginPath();
  ctx.moveTo(px1[0], px1[1]);
  ctx.lineTo(px2[0], px2[1]);
  ctx.stroke();
  ctx.closePath();
}

function cube_points(pt1, pt2, center) {
  pt1 = [pt1[0] + center[0],
         pt1[1] + center[1],
         pt1[2] + center[2]];
  pt2 = [pt2[0] + center[0],
         pt2[1] + center[1],
         pt2[2] + center[2]];
  return [
    pt1, // 0: front lower left
    [pt1[0], pt2[1], pt2[2]], // 1: back upper left
    [pt2[0], pt1[1], pt2[2]], // 2: back lower right
    [pt2[0], pt2[1], pt1[2]], // 3: front upper right
    [pt1[0], pt1[1], pt2[2]], // 4: back lower left
    [pt1[0], pt2[1], pt1[2]], // 5: front upper left
    [pt2[0], pt1[1], pt1[2]], // 6: front lower right
    pt2, // 7: back upper right
  ];
}

function cube_mesh() {
  return [
    // front face
    [0, 5, 6],
    [5, 6, 3],
    // back face
    [1, 7, 4],
    [7, 4, 2],
    // left face
    [0, 4, 5],
    [4, 5, 1],
    // right face
    [7, 2, 6],
    [3, 6, 7],
    // top face
    [3, 5, 7],
    [1, 5, 7],
    // bottom face
    [0, 6, 4],
    [6, 4, 7]
  ];
}

var cube = cube_points([-1,-1,-1], [1,1,1], [0, 0, 3]);
var tris = cube_mesh();

var last = window.performance.now();
var fov = 75* Math.PI/180;
var view_dist = 1/Math.tan(fov/2);

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var now = window.performance.now();
  var x = Math.cos(now/1000)/2;
  var z = Math.sin(now/1000);
  var cube = cube_points([-0.5,-0.5,-0.5], [0.5,0.5,0.5],
                         [x, 0, z+8]);

  for (var i = 0; i<tris.length; i++) {
    for (var j = 0; j<3; j++) {
      var pt = cube[tris[i][j]];
      var lpt = cube[tris[i][(j+1)%3]];
      sx = view_dist*pt[0]/pt[2];
      sy = view_dist*pt[1]/pt[2];
      lx = view_dist*lpt[0]/lpt[2];
      ly = view_dist*lpt[1]/lpt[2];

      draw_line(lx, ly, sx, sy);
    }
  }
  window.requestAnimationFrame(render);
}

render();
