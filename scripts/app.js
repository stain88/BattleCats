var MAX_BOXES = 6;

$(function() {
  setupBoard();
  addListeners();
})

function setupBoard() {
  for (var i=0;i<MAX_BOXES;i++) {
    $('tbody').append($(document.createElement('tr')));
    for (var j=0;j<MAX_BOXES;j++) {
      $('tbody').find('tr:last').append($('<td>',{'data-num':"cell"+i+j}));
    }
  }  
}

function addListeners() {
  var isMouseDown = false;
  var startingCell;
  var selectedCells=[];
  $('td').on("click", function() {
    console.log(event.target);
  })
  .on("mousedown", function() {
    isMouseDown = true;
    $(this).toggleClass("placedShip")
  })
  .on("mouseover", function() {
    if (isMouseDown) {
      $(this).toggleClass("placedShip")
    }
  })
  $(document).on("mouseup", function() {
    isMouseDown = false;
  })
  $('#startGame').on("click",toggleSelector)
}

function toggleSelector() {
  $('td').off();
}