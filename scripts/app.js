var MAX_BOXES = 6;
var MAX_CATS = Math.floor(Math.pow(MAX_BOXES,2)/5);
var p1CatsLeft = MAX_CATS;
var p2CatsLeft = MAX_CATS;
var opponent;
var turn = 1;
var winner = null;
var myPlayer = myPlayer || {};

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
  setupp1Board();
}

function setupp1Board() {
  var catsLeft = MAX_CATS;
  updateText(catsLeft);
  var isMouseDown = false;
  var startingCell;
  $('#playerOneDefBoard').find('td').on("mousedown", function() {
    isMouseDown = true;
    if ($(this).attr('class')==="placedCat") {
      $(this).toggleClass("placedCat");
      catsLeft++;
      updateText(catsLeft);
    } else {
      if (catsLeft>0) {
        $(this).toggleClass("placedCat");
        catsLeft--;
        updateText(catsLeft)
      }
    }
  })
  .on("mouseover", function() {
    if (isMouseDown) {
      if ($(this).attr('class')==="placedCat") {
        $(this).toggleClass("placedCat");
        catsLeft++;
        updateText(catsLeft);
      } else {
        if (catsLeft>0) {
          $(this).toggleClass("placedCat");
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
    if (catsLeft===0) {(opponent === "Computer")?startGame():setupp2Board();}
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
  $('#playerOneDefBoard').animate({transform: 'scale(0.5)'}).animate({transform: 'translateX(-230px) translateY(-62px) scale(0.5)'}, addAttackBoard);
}

function setupComputerBoard() {
  var i=0;
  while (i<MAX_CATS) {
    var random = Math.floor(Math.random()*Math.pow(MAX_BOXES,2))
    var x=Math.floor(random/MAX_BOXES)+1;
    var y=(random%MAX_BOXES)+1;
    console.log("random: "+random, "x: "+x,"y: "+y);
    if ($('#playerTwoDefBoard').find('tr:nth-child('+x+')').find('td:nth-child('+y+')').attr('class')==="placedCat") {
      continue;
    } else {
      $('#playerTwoDefBoard').find('tr:nth-child('+x+')').find('td:nth-child('+y+')').toggleClass("placedCat");
    }
    i++;
  }
}

function addAttackBoard() {
  $('#playerOneAtkBoard').fadeIn().animate({transform: 'translateY(-300px) translateX(40px)'});
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
    setTimeout(computerPlay,1000);
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
      alert("You win! Congrats");
    } else {
      alert("Player One wins!");
    }
    resetGame();
  }
  if (p1CatsLeft===0) {
    if (opponent==="Computer") {
      alert("You lose! Unlucky");
    } else {
      alert("Player Two wins!");
    }
    resetGame();
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
    clearAll();
  }
}

function clearAll() {
  window.location.reload();
  // $('table').find('td').remove();
  // p1CatsLeft = MAX_CATS;
  // p2CatsLeft = MAX_CATS;
  // $('#restart').fadeOut(500, function() {
  //   $('h2').fadeOut(500, function() {
  //     $('h1').text("Battle Cats").fadeIn(500);
  //     $('#menu-buttons').toggleClass('menu-buttons');
  //     $('#newGame').fadeIn(500, function() {
  //       $('#instructions').fadeIn(500);
  //     })
  //   });
  // })
}