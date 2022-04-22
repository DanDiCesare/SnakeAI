/**
 * @date March 14, 2022
 * @author Austin Bennett
 * @author Daniele Di Cesare
 * @author Rasik Pokharel
 */

/**
 * Unit grid size for the game board.
 * @type {int}
 */
const SIZE = 20
/**
 * Internal nodes for the NeuralNet.
 * @type {int}
 */
const hiddenNodes = 16
/**
 * Number of internal layers for the NeuralNet.
 * @type {int}
 */
const hiddenLayers = 2
/**
 * Framerate for the game. Each frame a move is calculated.
 * @type {int}
 */
const fps = 100
/**
 * Width of the p5 canvas.
 * @type {int}
 */
const width = 1200
/**
 * Height of the p5 canvas.
 * @type {int}
 */
const height = 800
/**
 *  High score for the current session.
 * @type {int}
 */
let highscore = 0
/**
 * Rate of mutation for the neural networks.
 * @type {number}
 */
let mutationRate = .10
/**
 * Number of snakes to generate per generation.
 * @type {int}
 */
let popSize = 2000
/**
 * Default mutation rate for the game.
 * @type {int}
 */
let defaultmutation = mutationRate

/**
 * If a human is playing currently.
 * @type {boolean}
 */
let humanPlaying = false
/**
 * If the best shake should be displayed. False shows all snakes.
 * @type {boolean}
 */
let replayBest = true
/**
 * If the best snake's vision should be drawn to the canvas.
 * @type {boolean}
 */
let seeVision = false
/**
 * If a model has been loaded from a file.
 * @type {boolean}
 */
let modelLoaded = false
/**
 * Initialize the playable snake.
 * @type {Snake}
 */
let snake
/**
 * Initialize a model for loading.
 * @type {int}
 */
let model
/**
 * Initialize an array to store evolution scores.
 * @type {Array}
 */
let evolution

/**
 * Initialize a population for the game.
 * @type {Population}
 */
let popu

/**
 * Button identifier for the graph.
 * @type {HTMLElement}
 */
let graphButton
/**
 * Button identifier for loading the model.
 * @type {HTMLElement}
 */
let loadButton
/**
 * Button identifier for saving the model.
 * @type {HTMLElement}
 */
let saveButton
/**
 * Button identifier for toggling player-controlled gameplay.
 * @type {HTMLElement}
 */
let toggleButton
/**
 * Button identifier for toggling the visible population.
 * @type {HTMLElement}
 */
let allSnakeButton

/**
 * Flag indicating if the model is currently being saved.
 * @type {boolean}
 */
let saving = false
/**
 * Model object to store the model export.
 * @type {NeuralNet}
 */
let modelToSave = null

/**
 * Model weights to be saved.
 * @type {NeuralNet}
 */
let modelWeights = null

/**
 * Button to increase the current mutation rate.
 * @type {Button}
 */
let increaseMut
/**
 * Button to decrease the current mutation rate.
 * @type {Button}
 */
let decreaseMut

/**
 * Array to store input weights for trained model.
 * @type {Array}
 */
let inp
/**
 * Table to pull information from input file.
 * @type {object}
 */
let modelTable = null
/**
 * File reader for input file.
 * @type {FileReader}
 */
let read
/**
 * Output from the file reader.
 */
let fileReadout = null

/**
 * Window for the learning rate graph.
 * @type {Window}
 */
let graphWindow

/**
 * Identifies all HTML elements and p5 Canvas parameters,
 * setting them at the start of runtime.
 * @summary P5 canvas setup before the game is executed.
 * @implements p5.js
 */
function setup () {
  createCanvas(width, height)
  evolution = []
  // load button
  loadButton = document.getElementById("loadReal")
  saveButton = document.getElementById("saveReal")
  graphButton = document.getElementById("graphReal")
  toggleButton = document.getElementById("toggleReal")
  allSnakeButton = document.getElementById("allSnakeButton")

  toggleButton.addEventListener('click', toggleHuman)
  saveButton.addEventListener('click', saveFile)
  graphButton.addEventListener('click', openGraph)
  allSnakeButton.addEventListener('click', toggleVisibility)

  frameRate(fps)
  if (humanPlaying) {
    snake = new Snake()
  } else {
    popu = new Population(popSize) //2000
  }
}

/**
 * Main driver of the program. Handles game state changes and
 * redraws the game every frame.
 * @summary Draws and handles the game state.
 * @implements p5.js
 *
 */
function draw () {
  background('#282c34')
  noFill()
  stroke('#abb2bf')
  line(400, 0, 400, height)
  rectMode(CORNER)
  rect(400 + SIZE, SIZE, width - 400 - 40, height - 40)

  // check for saving file
  if (saving === true && modelWeights !== null) {
    saveFile2()
  }

  // check for uploaded file
  if (loadButton.value !== '' && !modelLoaded && modelTable !== null && modelTable.columns.length !== 0) {
    console.log("call2")
    console.log(!modelLoaded, modelTable !== null, modelTable.columns.length === 0)
    fileSelectedIn2()
  }
  else if (!modelLoaded && loadButton.value !== '') {
    if (fileReadout != null)
      fileSelectedIn(fileReadout)
    else {
      console.log("File Uploaded")
      read = new FileReader()
      read.addEventListener('load', (event) => {
        fileReadout = event.target.result;
      });
      read.readAsDataURL(loadButton.files[0])
    }
  }

  // Player Controlled
  if (humanPlaying) {
    snake.move()
    snake.show()
    fill('#abb2bf')
    textSize(20)
    text('SCORE: ' + snake.score, 500, 50)
    if (snake.dead) {
      snake = new Snake()
    }

  } else { // AI Snakes
    if (!modelLoaded) {
      if (popu.done()) {
        highscore = popu.bestSnakeScore
        popu.calculateFitness()
        popu.naturalSelection()
      } else {
        popu.update()
        popu.show()
      }
      fill('#abb2bf')
      textSize(25)
      textAlign(LEFT)
      text("GEN : " + popu.gen, 70, 60)
      text("MUTATION RATE : " + mutationRate * 100 + "%", 70, 90)
      text("BEST FITNESS : " + popu.bestFitness, 70, 120)
      text("MOVES LEFT : "+ popu.bestSnake.lifeLeft,70,150)
      text("SCORE : " + popu.bestSnake.score, 120, height - 45)
      text("HIGHSCORE : " + highscore, 120, height - 15)
      text("ALIVE : " + popu.alive(), 404+SIZE, SIZE + SIZE)
      //increaseMut.show()
      //decreaseMut.show()
    } else {
      model.look()
      model.think()
      model.move()
      model.show()
      model.brain.show(0, 0, 360, 790, model.vision, model.decision)
      if (model.dead) {
        let newmodel = new Snake()
        newmodel.brain = Object.assign(newmodel.brain, model.brain)
        model = newmodel
      }
      textSize(20);
      fill('#56b6c2');
      textAlign(LEFT);
      text("SCORE : " + model.score, 120, height - 45);
    }
    textAlign(LEFT);
    textSize(18);
    fill('#e06c75');
    text("RED < 0",120,height-75);
    fill('#61afef');
    text("BLUE > 0",200,height-75);
  }
}

/**
 * Opens the learning graph window in a new tab.
 */
function openGraph () {
  graphWindow = window.open('EvoGraph.html', '_blank')
  graphWindow.evolution = evolution
}

/**
 * Toggles human/AI controlled gameplay.
 */
function toggleHuman () {
  console.log("Toggle Human")
  if (humanPlaying) {
    humanPlaying = false
    popu = new Population(popSize)
    snake = null
    frameRate(fps)
    redraw()
  }
  else {
    humanPlaying = true
    snake = new Snake()
    popu = null
    frameRate(20)
  }
}


function toggleVisibility () {
  console.log("Toggle visible population")
  if (!humanPlaying) {
    replayBest = !replayBest
  }
}


/**
 * Initializes the file loading process.
 * @param {string} selection file contents selected for model upload read in as
 * a URL.
 */
function fileSelectedIn (selection) {
  if (selection == null) {
    print("Windows was closed or the user hit cancel")
  } else {
    modelTable = loadTable(selection, "csv", "header")

    // Kill the current game
    if (!humanPlaying)
      for (let i = 0; i < popu.snakes.length; i++) {
        popu.snakes[i].dead = true
      }
    else {
      snake.dead = true
    }
  }
}

/**
 * Continues the file loading process to avoid asynchronous behaviour.
 * Loads the file contents into a usable model, and restarts the game.
 */
function fileSelectedIn2 () { // continuation of fileSelectedIn, lets the table load
  let weights = new Array(modelTable.getColumnCount()-1)
  let inp = Array(hiddenNodes).fill().map(() => Array(25))
  for (let i = 0; i < hiddenNodes; i++) {
    for (let j = 0; j < 25; j++) {
      inp[i][j] = modelTable.getNum(j+i*25, "L0")
    }
  }
  weights[0] = new Matrix(inp)

  for (let h = 1; h < weights.length-1; h++) {
    let hid = Array(hiddenNodes).fill().map(() => Array(hiddenNodes+1))
    for(let i = 0; i < hiddenNodes; i++) {
      for(let j = 0; j < hiddenNodes + 1; j++) {
        hid[i][j] = modelTable.getNum(j+i*(hiddenNodes+1),"L"+h);
      }
    }
    weights[h] = new Matrix(hid);
  }

  let out = new Array(4).fill().map(() => Array(hiddenNodes+1))
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j< hiddenNodes + 1; j++) {
      out[i][j] = modelTable.getNum(j+i*(hiddenNodes+1),"L"+(weights.length-1));
    }
  }
  weights[weights.length-1] = new Matrix(out);

  evolution = []
  let g = 0;
  let genScore = modelTable.getNum(g,"Graph")
  while(genScore !== 0) {
    // read in evo graph until crash (starts reading NaN)
    evolution.push(genScore);
    g++;
    try {
      genScore = modelTable.getNum(g,"Graph")
    }
    catch (err) {
      break
    }
  }
  modelLoaded = true;
  humanPlaying = false;
  popu = new Population(1)
  model = new Snake("layers", weights.length-1);
  model.brain.load(weights);
  console.log("loaded file")
  console.log("model", model)
}

/**
 * Initializes the save routine for the model. Extracts the current best NeuralNet.
 */
function saveFile () {
  modelTable = new p5.Table()
  modelToSave = popu.bestSnake.clone()
  modelWeights = modelToSave.brain.pull()
  saving = true
}

/**
 * Continues the save routine. Dumps the extracted NeuralNet weights to a csv.
 */
function saveFile2 () {
  console.log("save2", modelWeights)
  saving = false
  let weights = Array.apply(null, Array(modelWeights.length)).map(Array.prototype.valueOf,[]);
  for (let i = 0; i < weights.length; i++) {
    weights[i] = modelWeights[i].toArray()
  }
  for (let i = 0; i < weights.length; i++) {
    modelTable.addColumn("L"+i)
  }
  console.log("weights", weights)
  modelTable.addColumn("Graph")
  let maxLen = weights[0].length
  for (let i = 1; i< weights.length; i++) {
    if (weights[i].length > maxLen) {
      maxLen = weights[i].length
    }
  }
  let g = 0
  for (let i = 0; i < maxLen; i++) {
    let newRow = modelTable.addRow()
    for (let j = 0; j < weights.length+1; j++) {
      if (j === weights.length) {
        if (g < evolution.length) {
          newRow.setNum("Graph", evolution[g])
          g++
        }
      } else if (i < weights[j].length) {
        newRow.setNum("L"+j, weights[j][i])
      }
    }
  }
  console.log("saving file")
  saveTable(modelTable, "model.csv", options="csv")
  modelTable = null
  modelToSave = null
}

/**
 * Tracks mouse movements on the page. Monitors collusion with p5.js buttons.
 */
function incrMut () {
  mutationRate *= 2
  defaultmutation = mutationRate
}
function decrMut () {
  mutationRate /= 2
  defaultmutation = mutationRate
}
/**
 * Tracks keyboard inputs on the page. Player controlled movement monitoring.
 */
function keyPressed () {
  switch (keyCode) {
    case LEFT_ARROW:
      snake.moveLeft()
      break
    case RIGHT_ARROW:
      snake.moveRight()
      break
    case UP_ARROW:
      snake.moveUp()
      break
    case DOWN_ARROW:
      snake.moveDown()
      break
  }
}
