/**
  * @date March 14, 2022
  * @author Austin Bennett
  * @author Daniele Di Cesare
  * @author Rasik Pokharel
 */
class NeuralNet {
  /**
   * @class
   * @classdesc Represents the neural network
   * @param {int} input Represents the number of inputs to the neural network.
   * @param {int} hidden Number of hidden nodes included in the network.
   * @param {int} output Represents the number of outputs from the neural network.
   * @param {int} hiddenLayers Number of internal layers for the neural network.
   */
  constructor (input, hidden, output, hiddenLayers) {
    /**
     * Input nodes of the neural network
     * @type {int}
     */
    this.iNodes = input
    /**
     * Hidden nodes of the neural network
     * @type {int}
     */
    this.hNodes = hidden
    /**
     * Output nodes of the neural network
     * @type {int}
     */
    this.oNodes = output
    /**
     * Internal layers of the neural network
     * @type {int}
     */
    this.hLayers = hiddenLayers

    /**
     * Float values assigned to each of the neural network nodes.
     * @type {array}
     */

    if (isNaN(input) || isNaN(hidden) || isNaN(output) || isNaN(hiddenLayers)) {
      throw new TypeError('Parameter(s) are not integers')
    }

    this.weights = Array.apply(null, Array(3)).map(Number.prototype.valueOf,0)
    this.weights[0] = new Matrix(this.hNodes, this.iNodes + 1)
    for (let i = 1; i < this.hLayers; i++) {
      this.weights[i] = new Matrix(this.hNodes, this.hNodes + 1)
    }

    this.weights[this.weights.length - 1] = new Matrix(this.oNodes,
      this.hNodes + 1)

    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i].randomize()
    }
  }

  /**
   * Wrapper for Matrix.mutate. Introduces variation in the weights
   * based on the set mutationRate.
   * @param {float} rate
   */
  mutate (rate) {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i].mutate(rate)
    }
  }


  /**
   * Passes inputs through the neural network to create the outputs.
   * @param {Array} inputsArr Vision input from the snake head.
   * @returns output array used for making a movement decision.
   */
  output (inputsArr) {
    let inputs = this.weights[0].singleColumnMatrixFromArray(inputsArr)
    let curr_bias = inputs.addBias()

    for (let i = 0; i < this.hLayers; i++) {
      let hidden_ip = this.weights[i].dot(curr_bias)
      let hidden_op = hidden_ip.activate()
      curr_bias = hidden_op.addBias()
    }

    let output_ip = this.weights[this.weights.length - 1].dot(curr_bias)
    let output = output_ip.activate()
    return output.toArray()
  }

  /**
   * Combine two parent snake neural networks to create a child snake.
   * @param {NeuralNet} partner additional snake's neural network.
   * @returns {NeuralNet} Child snake neural network.
   */
  crossover (partner) {
    let child = new NeuralNet(this.iNodes, this.hNodes, this.oNodes,
      this.hLayers)
    for (let i = 0; i < this.weights; i++) {
      child.weights[i] = this.weights[i].crossover(partner.weights[i])
    }
    return child
  }

  /**
   * Clones this neural network as a new object.
   * @returns {NeuralNet} A Clone of this neural network.
   */
  clone () {
    let clone = new NeuralNet(this.iNodes, this.hNodes, this.oNodes,
      this.hLayers)
    for (let i = 0; i < this.weights.length; i++) {
      clone.weights[i] = this.weights[i].clone()
    }
    return clone
  }

  /**
   * Loads a weight array into a NeuralNet.
   * @param {Array} weight
   */
  load (weight) {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = weight[i]

    }
  }

  /**
   * Converts a NeuralNet to a standard Array.
   * @returns {Array} weight array.
   */
  pull () {
    let model = new Array(this.weights.length)
    for (let i = 0; i < this.weights.length; i++) {
      model[i] = this.weights[i].clone()
    }
    return model
  }

  /**
   * Draws the nodes of the NeuralNet on the canvas.
   * @implements p5.js
   * @param {int} x x-coordinate for NeuralNet
   * @param {int} y y-coordinate for NeuralNet
   * @param {int} w width for NeuralNet
   * @param {int} h height for NeuralNet
   * @param {Array} vision vision input to the NeuralNet
   * @param {Array} decision decision output of the NeuralNet
   */
  show (x, y, w, h, vision, decision) {
    let space = 5
    let nSize = (h - (space * (this.iNodes - 2))) / this.iNodes
    let nSpace = (w - (this.weights.length * nSize)) / this.weights.length
    let hBuff = (h - (space * (this.hNodes - 1)) - (nSize * this.hNodes)) / 2
    let oBuff = (h - (space * (this.oNodes - 1)) - (nSize * this.oNodes)) / 2

    let maxIndex = 0

    for (let i = 0, len = decision.length; i < len; i++) {
      if (decision[i] > decision[maxIndex]) {
        maxIndex = i
      }
    }

    let lc = 0

    for (let i = 0; i < this.iNodes; i++) {  //DRAW INPUTS
      if (vision[i] !== 0) {
        fill('#e5c07b')
      } else {
        fill('#abb2bf')
      }
      noStroke()
      ellipseMode(CORNER)
      ellipse(x, y + (i * (nSize + space)), nSize, nSize)
      textSize(nSize / 2)
      textAlign(CENTER, CENTER)
      noStroke()
      fill('#282c34')
      text(i, x + (nSize / 2), y + (nSize / 2) + (i * (nSize + space)))
    }

    lc++

    for (let a = 0; a < this.hLayers; a++) {
      for (let i = 0; i < this.hNodes; i++) {  //DRAW HIDDEN
        fill('#282c34')
        stroke('#abb2bf')
        ellipseMode(CORNER)
        ellipse(x + (lc * nSize) + (lc * nSpace),
          y + hBuff + (i * (nSize + space)), nSize, nSize)
      }
      lc++
    }

    for (let i = 0; i < this.oNodes; i++) {  //DRAW OUTPUTS
      if (i === maxIndex) {
        fill('#98c379')
      } else {
        fill('#abb2bf')
      }

      noStroke()
      ellipseMode(CORNER)
      ellipse(x + (lc * nSpace) + (lc * nSize),
        y + oBuff + (i * (nSize + space)), nSize, nSize)
    }

    lc = 1

    //DRAW WEIGHTS
    for (let i = 0; i < this.weights[0].rows; i++) {  //INPUT TO HIDDEN
      for (let j = 0; j < this.weights[0].cols - 1; j++) {
        if (this.weights[0].mat[i][j] < 0) {
          stroke('#e06c75')
        } else {
          stroke('#61afef')
        }
        line(x + nSize, y + (nSize / 2) + (j * (space + nSize)),
          x + nSize + nSpace, y + hBuff + (nSize / 2) + (i * (space + nSize)))
      }
    }

    lc++

    for (let a = 1; a < this.hLayers; a++) {
      for (let i = 0; i < this.weights[a].rows; i++) {  //HIDDEN TO HIDDEN
        for (let j = 0; j < this.weights[a].cols - 1; j++) {
          if (this.weights[a].mat[i][j] < 0) {
            stroke('#e06c75')
          } else {
            stroke('#61afef')
          }
          line(x + (lc * nSize) + ((lc - 1) * nSpace),
            y + hBuff + (nSize / 2) + (j * (space + nSize)),
            x + (lc * nSize) + (lc * nSpace),
            y + hBuff + (nSize / 2) + (i * (space + nSize)))
        }
      }
      lc++
    }

    for (let i = 0; i < this.weights[this.weights.length - 1].rows; i++) {  //HIDDEN TO OUTPUT
      for (let j = 0; j < this.weights[this.weights.length - 1].cols - 1; j++) {
        if (this.weights[this.weights.length - 1].mat[i][j] < 0) {
          stroke('#e06c75')
        } else {
          stroke('#61afef')
        }
        line(x + (lc * nSize) + ((lc - 1) * nSpace),
          y + hBuff + (nSize / 2) + (j * (space + nSize)),
          x + (lc * nSize) + (lc * nSpace),
          y + oBuff + (nSize / 2) + (i * (space + nSize)))
      }
    }

    fill(0)
    textSize(15)
    textAlign(CENTER, CENTER)
    const up=String.fromCharCode(0x2191)
    const down=String.fromCharCode(0x2193)
    const left=String.fromCharCode(0x2190)
    const right=String.fromCharCode(0x2192)
    noStroke()
    text(up, x + (lc * nSize) + (lc * nSpace) + nSize / 2,
      y + oBuff + (nSize / 2))
    text(down, x + (lc * nSize) + (lc * nSpace) + nSize / 2,
      y + oBuff + space + nSize + (nSize / 2))
    text(left, x + (lc * nSize) + (lc * nSpace) + nSize / 2,
      y + oBuff + (2 * space) + (2 * nSize) + (nSize / 2))
    text(right, x + (lc * nSize) + (lc * nSpace) + nSize / 2,
      y + oBuff + (3 * space) + (3 * nSize) + (nSize / 2))

  }
}

global.NeuralNet = NeuralNet