var MAX_BOXES = 5;

$(function() {
  for (var i=0;i<MAX_BOXES;i++) {
    $('tbody').append($(document.createElement('tr')));
    for (var j=0;j<MAX_BOXES;j++) {
      $('tbody').find('tr:last').append($(document.createElement('td')));
    }
  }
})