var MAX_BOXES = 6;
var MAX_CATS = Math.floor(Math.pow(MAX_BOXES,2)/5);
var p1CatsLeft = MAX_CATS;
var p2CatsLeft = MAX_CATS;
var selectedPlayerCells = [];
var playerSelectionBoard;
var playerAttackBoard;
var computerSelectionBoard;
var computerAttackBoard;
var opponent;
var turn = 1;
var winner = null;

$(function() {
  $('#newGame').on('click',chooseOpponent);
  $('#instructions').on('click',showInstructions);
})

function chooseOpponent() {
  event.preventDefault();
  console.log("starting new game");
  $('#newGame').fadeOut(500, function() {
    $('#instructions').fadeOut(500, function() {
      $('h1').append($(document.createElement('br'))).append($(document.createTextNode("Choose your opponent: ")))
      $('#twoPlayer').css('display', 'inline').fadeIn(500, function() {
        $('#computer').fadeIn(500).css('display', 'inline');
      })
    })
  });
  $('#twoPlayer').on("click",playerOneSelect);
  $('#computer').on("click",playerOneSelect);
}

function playerOneSelect() {
  event.preventDefault();
  $('#twoPlayer').off();
  $('#computer').off();
  opponent = event.target.innerText;
  $('h1').fadeOut(1000);
  $('#twoPlayer').fadeOut(500,function() {
    $('#computer').fadeOut(500, function() {
      $('.menu-buttons').toggleClass('menu-buttons');
      $('#startGame').fadeIn(1000);
      $('.whoseTurn').fadeIn(1000);
      $('#playerOneDefBoard').fadeIn(1000);
    });
  });
  drawBoards();
}

function showInstructions() {
  event.preventDefault();
  $('#newGame').off();
  $('#instructions').off();
  console.log("instructions");
  $('#newGame').fadeOut(500, function() {
    $('#instructions').fadeOut(500, function() {
      $('p').fadeIn(800);
      $('#backToMain').fadeIn(1000).on("click", backToMain);
    });
  });
}

function drawBoards() {
  for (var i=0;i<MAX_BOXES;i++) {
    $('tbody').append($(document.createElement('tr')));
    for (var j=0;j<MAX_BOXES;j++) {
      $('tbody').find('tr:last').append($('<td>',{'data-num':"cell"+i+j}));
    }
  }
  setupp1Board();
}

function setupp1Board() {
  var catsLeft = MAX_CATS;
  updateText(catsLeft);
  var isMouseDown = false;
  var startingCell;
  $('#playerOneDefBoard').find('td').on("mousedown", function() {
    console.log(event.target);
    isMouseDown = true;
    if ($(this).attr('class')==="placedCat") {
      $(this).toggleClass("placedCat");
      selectedPlayerCells.splice(selectedPlayerCells.indexOf($(event.target).attr("data-num")),1);
      catsLeft++;
      updateText(catsLeft);
    } else {
      if (catsLeft>0) {
        $(this).toggleClass("placedCat");
        selectedPlayerCells.push($(event.target).attr("data-num"));
        catsLeft--;
        updateText(catsLeft)
      }
    }
  })
  .on("mouseover", function() {
    if (isMouseDown) {
      console.log($(event.target).attr("data-num").substr(4,2).split("").map(function(x){return parseInt(x,10)}));
      if ($(this).attr('class')==="placedCat") {
        $(this).toggleClass("placedCat");
        selectedPlayerCells.splice(selectedPlayerCells.indexOf($(event.target).attr("data-num")),1);
        catsLeft++;
        updateText(catsLeft);
      } else {
        if (catsLeft>0) {
          $(this).toggleClass("placedCat");
          selectedPlayerCells.push($(event.target).attr("data-num"));
          catsLeft--;
          updateText(catsLeft);
        }
      }
    }
  })
  $(document).on("mouseup", function() {
    isMouseDown = false;
  })
  $('#startGame').on("click",function() {
    (opponent === "Computer")?startGame():setupp2Board();
  })
}

function updateText(cats) {
  $('h2').text("Place your cats. "+cats+" left.")
}

function startGame() {
  event.preventDefault();
  setupComputerBoard();
  $('h2').fadeOut(200).text("Pick a square").fadeIn(200);
  $('#playerOneDefBoard').find('td').off();
  $('#playerOneDefBoard').animate({transform: 'scale(0.5)'}).animate({transform: 'translateX(-230px) translateY(-80px) scale(0.5)'}, addAttackBoard);
}

function setupComputerBoard() {
  var i=0;
  while (i<MAX_CATS) {
    var random = Math.floor(Math.random()*Math.pow(MAX_BOXES,2))
    var x=Math.floor(random/MAX_BOXES);
    var y=random%MAX_BOXES;
    console.log("random: "+random, "x: "+x,"y: "+y);
    if ($('#playerTwoDefBoard').find('tr:nth-child('+x+')').find('td:nth-child('+y+')').attr('class')==="placedCat") {
      console.log("same");
      continue;
    } else {
      $('#playerTwoDefBoard').find('tr:nth-child('+x+')').find('td:nth-child('+y+')').toggleClass("placedCat");
    }
    i++;
  }
}

function addAttackBoard() {
  $('#playerOneAtkBoard').fadeIn().animate({transform: 'translateY(-300px) translateX(40px)'});
  $('#startGame').fadeOut(500);
  $('#restart').fadeIn(800);
  $('#restart').on("click",resetGame);
  $('#playerOneAtkBoard').find('td').on("click",playVsComp)
}

function playVsComp() {
  if (turn===1) {
    var choice = $(event.target).attr("data-num");
    if ($('#playerTwoDefBoard').find('td[data-num='+choice+']').hasClass("placedCat")) {
      $(event.target).addClass("hit");
    } else {
      $(event.target).addClass("miss");
    }
  }
}

function backToMain() {
  event.preventDefault();
  $('#backToMain').off();
  $('p').fadeOut(800, function() {
    $('#backToMain').fadeOut(500, function() {
      $('#newGame').fadeIn(500, function() {
        $('#instructions').fadeIn(500);
      })      
    });
  });
  $('#newGame').on("click",chooseOpponent);
  $('#instructions').on('click',showInstructions);
}

function resetGame() {
  var r=confirm("Clear boards and start again?");
  if (r) {
    console.log("start again");
  }
}