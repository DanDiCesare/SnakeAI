function setup () {
    createCanvas(1200, 800)
    background(150)
    frameRate(30)
}

function draw () {
    
    background(150)
    fill(0)
    strokeWeight(1)
    textSize(15)
    textAlign(CENTER,CENTER)
    text("Generation", width/2,height-10)
    translate(10,height/2)
    rotate(PI/2)
    text("Score", 0,0)
    rotate(-PI/2)
    translate(-10,-height/2)
    textSize(10)

    let x = 50
    let y = height-35
    let xbuff = (width-50) / 51.0
    let ybuff = (height-50) / 200.0
    for(let i=0; i<=50; i++) {
       text(i,x,y);
       x+=xbuff
    }
    x = 35
    y = height-50
    let ydif = ybuff * 10.0

    for(let i=0; i<200; i+=10) {
       text(i,x,y)
       line(50,y,width,y)
       y-=ydif
    }
    strokeWeight(2)
    stroke(255,0,0)

    let score = 0
    for(let i=0; i < evolution.length; i++) {
       let newscore = evolution[i]
       line(50+(i*xbuff),height-50-(score*ybuff),50+((i+1)*xbuff),height-50-(newscore*ybuff))
       score = newscore
    }
    stroke(0)
    strokeWeight(5)
    line(50,0,50,height-50)
    line(50,height-50,width,height-50)
}

global.evoSetup = setup
global.evoDraw = draw