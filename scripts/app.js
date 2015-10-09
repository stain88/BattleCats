var MAX_BOXES = 6;
var selectedPlayerCells = [];
var playerSelectionBoard;
var playerAttackBoard;
var computerSelectionBoard;
var computerAttackBoard;

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
  playerSelectionBoard = $('#playerBoard');
  playerAttackBoard = playerSelectionBoard.clone();
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
      selectedPlayerCells.push($(event.target).attr("data-num"));
    } else {
      selectedPlayerCells.splice(selectedPlayerCells.indexOf($(event.target).attr("data-num")),1);
    }
  })
  .on("mouseover", function() {
    if (isMouseDown) {
      $(this).toggleClass("placedShip")
      console.log($(event.target).attr("data-num").substr(4,2).split("").map(function(x){return parseInt(x,10)}));
      if ($(this).attr('class')==="placedShip") {
        selectedPlayerCells.push($(event.target).attr("data-num"));
      } else {
        selectedPlayerCells.splice(selectedPlayerCells.indexOf($(event.target).attr("data-num")),1);
      }
    }
  })
  $(document).on("mouseup", function() {
    isMouseDown = false;
  })
  $('#startGame').on("click",startGame)
}

function startGame() {
  $('td').off();
  playerSelectionBoard.animate({transform: 'scale(0.5)'}).animate({transform: 'translateX(-400px) translateY(-100px) scale(0.5)'});
  playerAttackBoard.show().fadeIn(1000);
}
