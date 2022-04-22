# Snake NEAT (Neuroevolution of Augmenting Topologies)

This project is a reimplementation of [SnakeAI](https://github.com/greerviau/SnakeAI)
---

## Installation Instructions


The finished project can be used at the following url:
## 


### Local
* Install Node.js and npm: https://nodejs.org/en/
* Clone and open the base project directory
* Run ```npm install``` to download all the required dependencies.
* open ```src/index.html``` to view the project

### Testing
* Run ```jest``` from the base directory to execute all automatic testing.

---

## Program Instructions

* **Player**:
  * Toggles between player-controlled and AI-controlled snake.
  * Controls are:
    * Uparrow - move up
    * Downarrow - move down
    * Leftarrow - move left
    * Rightarrow - move right
* **Visible**
  * Toggles the visibility of all snakes in the current generation.
  * If only one snake is visible, it is the recording of the previous generation's best snake.
* Mutation Rate
  * Allows for the mutation rate of the nural network to increase or decrease by factors of two.
  * Increasing the mutation rate will make each generation more distinct from the previous best snake.
* **Save**
  * Saves the current training model to a .csv file.
* **Load**
  * File select for uploading a previously saved model.
  * Training on previous models is not currently supported.
* **Graph**
  * Opens a new tab that displays the training history of the current model.
  * Works with loading in models as well.
