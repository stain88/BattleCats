BATTLESHIPS

Initialise player1 board (size 10?)
Place ships by selecting cells
if touching cells
  alert error

if vs ai
  computer places ships
else if vs player2
  hide player1 board, show player2 board, allow selection of ships 

shrink player1 board, show new board for enemyboard

while no winner
  display turn
  user picks square for guess 
  if hit
    background red
  else 
    background X

  if vs ai
    computer make random guess
    edit player1 board accordingly
    (AI: look next to current hits first)
  else
    swap boards 

if all ships sunk, display winner


//make menu, instructions