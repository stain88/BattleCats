var MAX_BOXES = 6;
var MAX_CATS = Math.floor(Math.pow(MAX_BOXES,2)/5);
var p1CatsLeft = MAX_CATS;
var p2CatsLeft = MAX_CATS;
var opponent;
var turn = 1;
var winner = null;
var myPlayer = myPlayer || {};
// var kongregate;

$(function() {
  $('#newGame').on('click',chooseOpponent);
  $('#instructions').on('click',showInstructions);
  soundManager.setup({
    url: "/swf/",
    preferFlash: true,
    onready: myPlayer.setup.bind(myPlayer)
  })
})

myPlayer.setup = function() {

}

function chooseOpponent() {
  event.preventDefault();
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
  setupBoard($('#playerOneDefBoard'));
}

function setupBoard(board) {
  var catsLeft = MAX_CATS;
  updateText(catsLeft);
  var isMouseDown = false;
  var startingCell;
  board.find('td').on("mousedown", function() {
    isMouseDown = true;
    if ($(this).attr('class')==="placedCat") {
      $(this).toggleClass("placedCat");
      catsLeft++;
    } else {
      if (catsLeft>0) {
        $(this).toggleClass("placedCat");
        catsLeft--;
      }
    }
    updateText(catsLeft)
  })
  .on("mouseover", function() {
    if (isMouseDown) {
      if ($(this).attr('class')==="placedCat") {
        $(this).toggleClass("placedCat");
        catsLeft++;
      } else {
        if (catsLeft>0) {
          $(this).toggleClass("placedCat");
          catsLeft--;
        }
      }
      updateText(catsLeft);
    }
  })
  $(document).on("mouseup", function() {
    isMouseDown = false;
  })
  $('#startGame').on("click",function() {
    if (catsLeft===0) {
      if ($(board[0]).attr("id")==="playerOneDefBoard") {
        (opponent === "Computer")?startGame():setupp2Board();
      } else {
        prepareGame();
      }
    }
  })
}

function updateText(cats) {
  $('h2').text("Place your cats. "+cats+" left.")
}

function setupp2Board() {
  $('#playerOneDefBoard').find('td').off();
  $('#playerOneDefBoard').fadeOut(function() {
    $('#playerTwoDefBoard').fadeIn(function() {
      setupBoard($('#playerTwoDefBoard'));
    });
  });
}

function prepareGame() {
  $('h2').text("Player One's turn");
  $('#startGame').css('display', 'inline').fadeOut(500);
  $('#restart').css('display', 'inline').fadeIn(800);
  $('#restart').on("click",resetGame);
  $('#playerTwoDefBoard').fadeOut(function() {
    $('#playerOneAtkBoard').fadeIn().animate({transform: 'scale(0.7) translate(-200px, -30px)'}, function() {
      $('#playerTwoAtkBoard').fadeIn().animate({transform: 'scale(0.7) translate(200px, -479px)'}, function() {
          $('.gameSection').prepend($('<div />', {class:'arrow'})).fadeIn(500);
          $('.arrow').animate({transform: 'translateX(-40px) rotate(35deg)'});
      });
    });
  });
  $('#playerOneAtkBoard').find('td').on("click",playVsPlayer);
  $('#playerTwoAtkBoard').find('td').on("click",playVsPlayer);
}

function playVsPlayer() {
  if ($(event.target).hasClass("hit")||$(event.target).hasClass("miss")) return;
  if (turn===1) {
    if ($(event.target).closest($('table')).attr('id')==="playerTwoAtkBoard") return;
    $('.arrow').animate({transform: 'translateX(40px) rotate(-35deg)'});
    var $choice = $('#playerTwoDefBoard').find('td[data-num='+$(event.target).attr("data-num")+']');
    if ($choice.hasClass("placedCat")) {
      playSound();
      $(event.target).addClass("hit");
      p2CatsLeft--;
      checkWinner();
    } else {
      $(event.target).addClass("miss");
    }
    turn*=-1;
    $('h2').text("Player Two's turn");
  } else {
    if ($(event.target).closest($('table')).attr('id')==="playerOneAtkBoard") return;
    $('.arrow').animate({transform: 'translateX(-40px) rotate(35deg)'});
    var $choice = $('#playerOneDefBoard').find('td[data-num='+$(event.target).attr("data-num")+']');
    if ($choice.hasClass("placedCat")) {
      playSound();
      $(event.target).addClass("hit");
      p1CatsLeft--;
      checkWinner();
    } else {
      $(event.target).addClass("miss");
    }
    turn*=-1;
    $('h2').text("Player One's turn");
  }  
}

function startGame() {
  event.preventDefault();
  setupComputerBoard();
  $('h2').fadeOut(200).text("Pick a square").fadeIn(200);
  $('#playerOneDefBoard').find('td').off();
  $('#playerOneDefBoard').animate({transform: 'scale(0.5)'}).animate({transform: 'translate(-190px, -72px) scale(0.5)'}, addAttackBoard);
}

function setupComputerBoard() {
  var i=0;
  while (i<MAX_CATS) {
    var random = Math.floor(Math.random()*Math.pow(MAX_BOXES,2))
    var x=Math.floor(random/MAX_BOXES)+1;
    var y=(random%MAX_BOXES)+1;
    if ($('#playerTwoDefBoard').find('tr:nth-child('+x+')').find('td:nth-child('+y+')').attr('class')==="placedCat") {
      continue;
    } else {
      $('#playerTwoDefBoard').find('tr:nth-child('+x+')').find('td:nth-child('+y+')').toggleClass("placedCat");
    }
    i++;
  }
}

function addAttackBoard() {
  $('#playerOneAtkBoard').fadeIn().animate({transform: 'translate(120px, -310px)'});
  $('#startGame').css('display', 'inline').fadeOut(500);
  $('#restart').css('display', 'inline').fadeIn(800);
  $('#restart').on("click",resetGame);
  $('#playerOneAtkBoard').find('td').on("click",playVsComp)
}

function playVsComp() {
  if (turn===1) {
    if ($(event.target).hasClass("hit")||$(event.target).hasClass("miss")) return;
    var $choice = $('#playerTwoDefBoard').find('td[data-num='+$(event.target).attr("data-num")+']');
    if ($choice.hasClass("placedCat")) {
      playSound();
      $(event.target).addClass("hit");
      p2CatsLeft--;
      checkWinner();
    } else {
      $(event.target).addClass("miss");
    }
    turn*=-1;
    setTimeout(computerPlay,800);
  } else {
    turn*=-1;
  }
}

function computerPlay() {
  var box = getBox();
  while (box.hasClass("hit")||box.hasClass("miss")) {
    box = getBox();
  }
  if (box.hasClass("placedCat")) {
    playSound();
    box.toggleClass("placedCat hit");
    p1CatsLeft--;
  } else {
    box.addClass("miss")
  }
  turn*=-1;
  checkWinner();
}

function playSound() {
  var sound = soundManager.createSound({
    id: "cat",
    url: "/sounds/cat_meow.mp3"
  })
  sound.play();
}

function getBox() {
  var compChoice = Math.floor(Math.random()*Math.pow(MAX_BOXES,2));
  var x=Math.floor(compChoice/MAX_BOXES)+1;
  var y=(compChoice%MAX_BOXES)+1;
  var $box = $('#playerOneDefBoard').find('tr:nth-child('+x+')').find('td:nth-child('+y+')');
  return $box;  
}

function checkWinner() {
  if (p2CatsLeft===0) {
    if (opponent==="Computer") {
      gotoWinScreen("pvc")
    } else {
      gotoWinScreen("p1")
    }
  }
  if (p1CatsLeft===0) {
    if (opponent==="Computer") {
      gotoWinScreen("comp")
    } else {
      gotoWinScreen("p2")
    }
  }
}

function backToMain() {
  event.preventDefault();
  clearAll();
  $('#backToMain').off();
  $('p').fadeOut(800, function() {
    $('p').removeClass("menu-buttons").text("Welcome to Battle Cats, a take on Battleships. Pick your "+
      "opponent, place your cats on the board, and happy hunting!");
    $('#backToMain').fadeOut(500, function() {
      $('h1').text("Battle Cats").fadeIn(500);
      $('#menu-buttons').addClass('menu-buttons');
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
    backToMain();
  }
}

function gotoWinScreen(winner) {
  $('.arrow').fadeOut(300);
  $('table').fadeOut(300, function() {
    $('h2').fadeOut(300);
    $('#restart').fadeOut(300, function() {
      switch (winner) {
        case "comp":
        $('p').text("You lose! Unlucky");
        break;
        case "pvc":
        $('p').text("You win! Congratulations");
        break;
        case "p1":
        $('p').text("Player One wins!");
        break;
        case "p2":
        $('p').text("Player Two wins!");
        break;
      }
      $('p').addClass("menu-buttons").fadeIn(500, function() {
        $('#backToMain').fadeIn(500).on("click", backToMain)
      })
    })
  })
}

function clearAll() {
  $('table').find('tr').fadeOut();
  $('.arrow').animate({transform:''}).fadeOut(100);
  $('button').off();
  p1CatsLeft = MAX_CATS;
  p2CatsLeft = MAX_CATS;
  $('table').animate({transform:''}).css('display', 'none');
  $('#restart').fadeOut(500, function() {
    $('h2').fadeOut(500);
  });
}

// kongregateAPI.loadAPI(onComplete);
// function onComplete() {
//   kongregate = kongregateAPI.getAPI();
// }