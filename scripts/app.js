//create Enter_Frame function handler
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {window.setTimeout(callback,1000/60)};

//

$(function() {
  animate(step);
})


function step (timestamp) {
  console.log(timestamp);
  //window.requestAnimationFrame(animate);
}