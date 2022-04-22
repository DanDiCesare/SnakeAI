global.p5 = require("./p5")
require('./snakeAI')

global.width = 1200
global.height = 800
global.SIZE = 20
global.hiddenNodes = 16
global.hiddenLayers = 2
global.fps = 100
global.highscore = 0
global.mutationRate = .10
global.popSize = 2000
global.defaultmutation = mutationRate
global.humanPlaying = false
global.replayBest = true
global.seeVision = false
global.modelLoaded = false
global.snake
global.model
global.evolution
global.popu
global.graphButton
global.loadButton
global.saveButton
global.toggleButton
global.saving = false

global.modelToSave = null
global.modelWeights = null
global.increaseMut
global.decreaseMut
global.inp
global.modelTable = null
global.read
global.fileReadout = null
global.graphWindow