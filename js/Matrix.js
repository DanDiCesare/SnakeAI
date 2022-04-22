/**
  * @date March 14, 2022
  * @author Austin Bennett
  * @author Daniele Di Cesare
  * @author Rasik Pokharel
 */
class Matrix {
  /**
    * @class
    * @classdesc Represents a matrix and matrix manipulations used in the Neural Network.
    * @param {int} r - The number of rows in the matrix.
    * @param {int} c - The number of columns in the matrix.
  */
  constructor (r, c) {
    if (arguments.length === 2) {
      /**
       * Stores the rows of the matrix.
       * @type {int}
       */
      this.rows = r
      /**
       * Stores the columns of the matrix.
       * @type {int}
       */
      this.cols = c
      /**
       * The values of the matrix are stored using arrays.
       * @type {double[][]}
       */ 
      this.mat = Array(r).fill().map(() => Array(c).fill(0));
    }
    if (arguments.length === 1) {
      this.mat = arguments[0]
      this.rows = this.mat.length
      this.cols = this.mat[0].length
    }
  }

  /**
   * Prints matrix into the console, used for debugging.
   */
  output () {
    let str = "";
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        str+=this.mat[i][j];
        str+=' ';
      }
      str+='\n';
    }
    str+='\n';
    print(str);
  }

  /**
   * Randomize the values in the matrix from -1 to 1.
   */
  randomize () {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.mat[i][j] = random(-1, 1)
      }
    }
  }

  //method for calculating the dot product of a given matrix
  /**
   * 
   * @param {Matrix} n - Matrix to perform dot product with. 
   * @returns {Matrix} - Conatins the result of the dot product.
   */
  dot (n) { //n: matrix
    let result = new Matrix(this.rows, n.cols)
    if (this.cols === n.rows) {
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < n.cols; j++) {
          let sum = 0.0
          for (let k = 0; k < this.cols; k++) {

            sum += this.mat[i][k] * n.mat[k][j]
          }
          result.mat[i][j] = sum
        }
      }
    }
    return result
  }

  /**
   * Converts Matrix to a 1D array of values.
   * @returns {Array}
   */
  toArray () {
    let arr = Array.apply(null, Array(this.rows * this.cols)).map(Number.prototype.valueOf,0)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr[j + i * this.cols] = this.mat[i][j]
      }
    }
    return arr
  }

  /**
   * Transposes a 1D array into a column matrix. 
   * @param {Array} arr - Row Matrix. 
   * @returns 
   */
  singleColumnMatrixFromArray (arr) {
    let n = new Matrix(arr.length, 1)
    for (let i = 0; i < arr.length; i++) {
      n.mat[i][0] = arr[i]
    }
    return n
  }

  /**
   * Adds a bias.
   * @returns {Matrix} A copy of this array with a bias.
   */
  addBias () {
    let n = new Matrix(this.rows + 1, 1)
    for (let i = 0; i < this.rows; i++) {
      n.mat[i][0] = this.mat[i][0]
    }
    n.mat[this.rows][0] = 1
    return n
  }

  /**
   * Checks if positive, if not returns 0.
   * @param {int} x 
   * @returns {int} returns the input if postive, 0 if input is negative 
   */
  relu (x) {
    return max(0, x)
  }

  /**
   * Keeps track of the actived values in the matrix
   * @returns {Matrix} Contains the active values of this matrix.
   */
  activate () {
    let n = new Matrix(this.rows, this.cols)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        n.mat[i][j] = this.relu(this.mat[i][j])
      }
    }
    return n
  }

  /**
   * Mutates the weights of the matrix.
   * @param {double} mutationRate - Mutation rate
   */
  mutate (mutationRate) { //mutationRate is a float
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let rand = random(1)
        if (rand < mutationRate) {
          this.mat[i][j] += randomGaussian() / 5

          if (this.mat[i][j] > 1) {
            this.mat[i][j] = 1
          }
          if (this.mat[i][j] < -1) {
            this.mat[i][j] = -1
          }
        }
      }
    }
  }

  /**
   * ???
   * @param {Matrix} partner 
   * @returns {Matrix} Returns the parnter yee haww
   */
  crossover (partner) { //partner is a matrix
    let child = new Matrix(this.rows, this.cols)

    let randC = floor(random(this.cols))
    let randR = floor(random(this.rows))

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if ((i < randR) || (i === randR && j <= randC)) {
          child.mat[i][j] = this.mat[i][j]
        } else {
          child.mat[i][j] = partner.mat[i][j]
        }
      }
    }
    return child
  }

  /**
   * Clones the matrix as a new object.
   * @returns {Matrix} - Returns a clone of this matrix
   */
  clone () {
    let clone = new Matrix(this.rows, this.cols)
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        clone.mat[i][j] = this.mat[i][j]
      }
    }
    return clone
  }
}

global.Matrix = Matrix
