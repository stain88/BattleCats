var MAX_BOXES = 6;
var selectedCells = [];

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
  $('td').on("click", function() {
    console.log(event.target);
  })
  .on("mousedown", function() {
    isMouseDown = true;
    $(this).toggleClass("placedShip")
    if ($(this).attr('class')==="placedShip") {
      selectedCells.push($(event.target).attr("data-num"));
    } else {
      selectedCells.splice(selectedCells.indexOf($(event.target).attr("data-num")),1);
    }
  })
  .on("mouseover", function() {
    if (isMouseDown) {
      $(this).toggleClass("placedShip")
      console.log($(event.target).attr("data-num").substr(4,2).split("").map(function(x){return parseInt(x,10)}));
      if ($(this).attr('class')==="placedShip") {
        selectedCells.push($(event.target).attr("data-num"));
      } else {
        selectedCells.splice(selectedCells.indexOf($(event.target).attr("data-num")),1);
      }
    }
  })
  $(document).on("mouseup", function() {
    isMouseDown = false;
  })
  $('#startGame').on("click",toggleSelector)
}

function toggleSelector() {
  $('td').off();
  // $('#playerBoard').
}
