// Inspiration from https://ruwix.com/online-puzzle-simulators/
// Accessing all of the elements from the DOM
const faces = $(".face")
const cube = $(".cube")[0]
const frontFace = $("#front")
const backFace = $("#back")
const topFace = $("#top")
const bottomFace = $("#bottom")
const leftFace = $("#left")
const rightFace = $("#right")
const transparentEl = document.getElementById("transparent")
const darkEl = document.getElementById("dark")
let isDark, isTransparent

// Codes representing where to find the color for each sticker on the cube
// C = Corner, E = Edge, M = Middle
// First number is the index of the respective array (Ex. edges[2])
// Second number is the color number (for corner and edge pieces who have more than one side)
const frontCode = ["C32", "E01", "C01", "E70", "M00", "E40", "C71", "E81", "C42"]
const backCode = ["C62", "EA1", "C51", "E60", "M20", "E50", "C21", "E21", "C12"]
const topCode = ["C20", "E20", "C10", "E30", "M40", "E10", "C30", "E00", "C00"]
const bottomCode = ["C70", "E80", "C40", "EB0", "M50", "E90", "C60", "EA0", "C50"]
const leftCode = ["C22", "E31", "C31", "E61", "M30", "E71", "C61", "EB1", "C72"]
const rightCode = ["C02", "E11", "C11", "E41", "M10", "E51", "C41", "E91", "C52"]
const dragCode = {
    "21front": "u", "20front": "u", "10front": "u",
    "21right": "u", "20right": "u", "10right": "u",
    "21left": "u", "20left": "u", "10left": "u",
    "67back": "u", "68back": "u", "78back": "u",
    "12front": "U", "02front": "U", "01front": "U",
    "12right": "U", "02right": "U", "01right": "U",
    "12left": "U", "02left": "U", "01left": "U",
    "76back": "U", "86back": "U", "87back": "U",

    "67front": "d", "78front": "d", "68front": "d",
    "67right": "d", "78right": "d", "68right": "d",
    "67left": "d", "78left": "d", "68left": "d",
    "21back": "d", "20back": "d", "10back": "d",
    "76front": "D", "87front": "D", "86front": "D",
    "76right": "D", "87right": "D", "86right": "D",
    "76left": "D", "87left": "D", "86left": "D",
    "12back": "D", "02back": "D", "01back": "D",

    "25front": "R", "28front": "R", "58front": "R",
    "25top": "R", "28top": "R", "58top": "R",
    "25bottom": "R", "28bottom": "R", "58bottom": "R",
    "25back": "R", "28back": "R", "58back": "R",
    "52front": "r", "82front": "r", "85front": "r",
    "52top": "r", "82top": "r", "85top": "r",
    "52bottom": "r", "82bottom": "r", "85bottom": "r",
    "52back": "r", "82back": "r", "85back": "r",

    "03front": "l", "06front": "l", "36front": "l",
    "03top": "l", "06top": "l", "36top": "l",
    "03bottom": "l", "06bottom": "l", "36bottom": "l",
    "03back": "l", "06back": "l", "36back": "l",
    "30front": "L", "60front": "L", "63front": "L",
    "30top": "L", "60top": "L", "63top": "L",
    "30bottom": "L", "60bottom": "L", "63bottom": "L",
    "30back": "L", "60back": "L", "63back": "L",

    "67top": "f", "68top": "f", "78top": "f",
    "03right": "f", "06right": "f", "36right": "f",
    "21bottom": "f", "20bottom": "f", "10bottom": "f",
    "85left": "f", "82left": "f", "52left": "f",
    "76top": "F", "86top": "F", "87top": "F",
    "30right": "F", "60right": "F", "63right": "F",
    "12bottom": "F", "02bottom": "F", "01bottom": "F",
    "58left": "F", "28left": "F", "25left": "F",

    "21top": "b", "20top": "b", "10top": "b",
    "85right": "b", "82right": "b", "52right": "b",
    "67bottom": "b", "68bottom": "b", "78bottom": "b",
    "03left": "b", "06left": "b", "36left": "b",
    "12top": "B", "02top": "B", "01top": "B",
    "58right": "B", "28right": "B", "25right": "B",
    "76bottom": "B", "86bottom": "B", "87bottom": "B",
    "30left": "B", "60left": "B", "63left": "B",
}

let edges = []
let corners = []
let centers = []

// Drag-to-turn variables
let startSticker;
let endSticker;

// Rotation variables
const sensitivity = {x: 5, y: 5}
let mouseDown = false;
let hovering = false;
let mouseStartPos, startRotation;
let rotation = {x: 0, y: 0, z: 0}
let invertX = false;

let rotationFunction = {x: [0, 90, 0], y: [90, 0, 0], z: [0, 0, 90]}

initializeCube()

const solvedEdges = JSON.parse(JSON.stringify(edges))
const solvedCorners = JSON.parse(JSON.stringify(corners))
const solvedCenters = JSON.parse(JSON.stringify(centers))

function initializeCube() {
    // Create an array of 12 edges (colorless)
    for (let i = 0; i < 12; i++) {
        let edge = {
            color0: "none",
            color1: "none",
            rotate: function () {
                let temp = this.color0
                this.color0 = this.color1
                this.color1 = temp
            }
        }
        edges.push(edge)
    }
    
    // Create an array of 8 corners (colorless)
    for (let i = 0; i < 8; i++) {
        let corner = {
            color0: "none",
            color1: "none",
            color2: "none",
            rotateA: function () {
                let temp = this.color0
                this.color0 = this.color1
                this.color1 = this.color2
                this.color2 = temp
            },
            rotateB: function () {
                let temp = this.color2
                this.color2 = this.color1
                this.color1 = this.color0
                this.color0 = temp
            }
        }
        corners.push(corner)
    }
    
    // Create an array of 6 centers (colorless)
    for (let i = 0; i < 6; i++) {
        let center = {
            color: "none"
        }
        centers.push(center)
    }

    // Generate blank stickers on each face 
    for (let i = 0; i < faces.length; i++) {
        faces[i].innerHTML = `
        <div class="sticker none" id="0${faces[i].id}"></div>
        <div class="sticker none" id="1${faces[i].id}"></div>
        <div class="sticker none" id="2${faces[i].id}"></div>
        <div class="sticker none" id="3${faces[i].id}"></div>
        <div class="sticker none" id="4${faces[i].id}"></div>
        <div class="sticker none" id="5${faces[i].id}"></div>
        <div class="sticker none" id="6${faces[i].id}"></div>
        <div class="sticker none" id="7${faces[i].id}"></div>
        <div class="sticker none" id="8${faces[i].id}"></div>`
    }

    // Finish setup by assigning colors to each sticker (according to face)
    setColors()
    transparentEl.checked = JSON.parse(localStorage.getItem("isTransparent"))
    darkEl.checked = JSON.parse(localStorage.getItem("isDark"))
    updateDarkMode()
    updateTransparent()

    // Render colored cube
    renderCube()
    rotation = {x:0,y:0,z:0}
    rotateCube([-30,-30,0])
    updateTransparent()
}  

// Initializes the colors for each side
function setColors() {
    setFace(frontCode, "green")
    setFace(backCode, "blue")
    setFace(topCode, "white")
    setFace(bottomCode, "yellow")
    setFace(leftCode, "orange")
    setFace(rightCode, "red")
}

// Accesses elements from centers, edges, or corners and sets to <colorName>
function setFace(faceCode, colorName) {
    for(let i = 0; i < 9; i++) {
        let code = faceCode[i]
        let index = parseInt(code[1], 16)
        let color = parseInt(code[2])
        if(code[0] === "C") {
            // Corners have 3 distinct color values
            if(color === 0) {
                corners[index].color0 = colorName
            } else if(color === 1) {
                corners[index].color1 = colorName
            } else {
                corners[index].color2 = colorName
            }
        } else if(code[0] === "E") {
            // Edges have 2 distinct color values
            if(color === 0) {
                edges[index].color0 = colorName
            } else {
                edges[index].color1 = colorName
            }
        } else {
            // Centers have only 1 color value
            centers[index].color = colorName
        }   
    }
}

// Renders each face on the cube
function renderCube() {
    renderFace(frontFace, frontCode)
    renderFace(backFace, backCode)
    renderFace(topFace, topCode)
    renderFace(bottomFace, bottomCode)
    renderFace(leftFace, leftCode)
    renderFace(rightFace, rightCode)
}

// For each sticker on the face, finds the corresponding item from an array and colors the sticker (updating className)
function renderFace(face, faceCode) {
    for(let i = 0; i < 9; i++) {
        // Reset each sticker's className for repeated calls to renderFace
        let sticker = face.children().eq(i)
        sticker.attr("class","sticker")

        let code = faceCode[i]
        let index = parseInt(code[1], 16)
        let color = parseInt(code[2])
        if(code[0] === "C") {
            // Corners have 3 distinct color values
            if(color === 0) {
                sticker.addClass(corners[index].color0)
            } else if(color === 1) {
                sticker.addClass(corners[index].color1)
            } else {
                sticker.addClass(corners[index].color2)
            }
        } else if(code[0] === "E") {
            // Edges have 2 distinct color values
            if(color === 0) {
                sticker.addClass(edges[index].color0)
            } else {
                sticker.addClass(edges[index].color1)
            }
        } else {
            // Centers have only 1 color value
            sticker.addClass(centers[index].color)
        }   
    }
}

function updateTransparent() {
    isTransparent = transparentEl.checked
    if(isTransparent) {
        $("#cube").addClass("clear")
    } else {
        $("#cube").removeClass("clear")
    }
    localStorage.setItem("isTransparent", JSON.stringify(isTransparent))
}

function updateDarkMode() {
    isDark = darkEl.checked
    if(isDark) {
        $("body").addClass("dark-mode")
    } else {
        $("body").removeClass("dark-mode")
    }
    localStorage.setItem("isDark", JSON.stringify(isDark))
}

function cycleEdges(a, b, c, d) {
    let temp = edges[a]
    edges[a] = edges[b]
    edges[b] = edges[c]
    edges[c] = edges[d]
    edges[d] = temp
}

function cycleCorners(a, b, c, d) {
    let temp = corners[a]
    corners[a] = corners[b]
    corners[b] = corners[c]
    corners[c] = corners[d]
    corners[d] = temp
}

// Rotates corners in place, making them face a different direction
// Used for left and right turns
function rotateCorners(a, b, c, d) {
    corners[a].rotateB()
    corners[b].rotateA()
    corners[c].rotateB()
    corners[d].rotateA()
}

// Rotates edges in place, making them face a different direction
// Used for front and back turns
function rotateEdges(a, b, c, d) {
    edges[a].rotate()
    edges[b].rotate()
    edges[c].rotate()
    edges[d].rotate()

}

// Turns top face clockwise
function U() {
    cycleEdges(0, 1, 2, 3)
    cycleCorners(0, 1, 2, 3)
}

// Turns top face counter-clockwise
function U_() {
    cycleEdges(3, 2, 1, 0)
    cycleCorners(3, 2, 1, 0)
}

// Turns bottom face clockwise
function D() {
    cycleEdges(11, 10, 9, 8)
    cycleCorners(7, 6, 5, 4)
}

// Turns bottom face counter-clockwise
function D_() {
    cycleEdges(8, 9, 10, 11)
    cycleCorners(4, 5, 6, 7)
}

// Turns right face clockwise
function R() {
    cycleEdges(4, 9, 5, 1)
    cycleCorners(4, 5, 1, 0)
    rotateCorners(0, 1, 5, 4)
}

// Turns right face counter-clockwise
function R_() {
    cycleEdges(1, 5, 9, 4)
    cycleCorners(0, 1, 5, 4)
    rotateCorners(0, 1, 5, 4)
}

// Turns left face clockwise
function L() {
    cycleEdges(6, 11, 7, 3)
    cycleCorners(6, 7, 3, 2)
    rotateCorners(2, 3, 7, 6)
}

// Turns left face counter-clockwise
function L_() {
    cycleEdges(3, 7, 11, 6)
    cycleCorners(2, 3, 7, 6)
    rotateCorners(2, 3, 7, 6)
}

// Turns front face clockwise
function F() {
    cycleEdges(7, 8, 4, 0)
    rotateEdges(0, 4, 8, 7)
    cycleCorners(7, 4, 0, 3)
    rotateCorners(3, 0, 4, 7)
}

// Turns front face counter-clockwise
function F_() {
    cycleEdges(0, 4, 8, 7)
    rotateEdges(0, 4, 8, 7)
    cycleCorners(3, 0, 4, 7)
    rotateCorners(3, 0, 4, 7)
}

// Turns back face clockwise
function B() {
    cycleEdges(5, 10, 6, 2)
    rotateEdges(2, 6, 10, 5)
    cycleCorners(5, 6, 2, 1)
    rotateCorners(1, 2, 6, 5)
}

// Turns back face counter-clockwise
function B_() {
    cycleEdges(2, 6, 10, 5)
    rotateEdges(2, 6, 10, 5)
    cycleCorners(1, 2, 6, 5)
    rotateCorners(1, 2, 6, 5)
}

function turn(move) {
    if(move === "u") {U()}
    else if(move === "U") {U_()}
    else if(move === "d") {D()}
    else if(move === "D") {D_()}
    else if(move === "l") {L()}
    else if(move === "L") {L_()}
    else if(move === "r") {R()}
    else if(move === "R") {R_()}
    else if(move === "f") {F()}
    else if(move === "F") {F_()}
    else if(move === "b") {B()}
    else if(move === "B") {B_()}
    renderCube()
}

// Turns cube on keydown
// (u)p, (d)own, (l)eft, (r)ight, (f)ront, (b)ack
// Press key for clockwise, SHIFT for counter-clockwise
// TODO: Add slice moves
document.addEventListener("keydown", function(e) {
    turn(e.key)
  })

  // Updates rotation vector and applies rotation to the cube
function rotateCube([dy, dx, dz]) {
    rotation.x += dx
    rotation.y += dy
    rotation.z += dz
    cube.style = `
    transition: 1s;
    transform: translateZ(-200px)
    rotateX(${rotation.y}deg)
    rotateY(${rotation.x}deg)
    rotateZ(${rotation.z}deg)
    ;`
}

// Updates/renders the cube when rotation vector is changed manually
// transition time of 0 because this is called live as the user is dragging the cube
function updateRotation() {
    cube.style = `
    transition: 0s;
    transform: translateZ(-200px)
    rotateX(${rotation.y}deg)
    rotateY(${rotation.x}deg)
    rotateZ(${rotation.z}deg)
    ;`
}

        // MOVING CUBE WITH MOUSE




// Event listeners for when mouse is hovering over cube
// Cube cannot be rotated when the mouse is hovering
cube.addEventListener("mouseover", function() {
    hovering = true
})
cube.addEventListener("mouseout", function() {
    hovering = false
})

// Save as above, for mobile
document.addEventListener("touchstart", function(e) {
    let elem = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
    if(elem.className.includes("body") || elem.className.includes("scene")) {
        hovering = false
    } else {
        hovering = true
    }
})

$(document).bind("mousedown", function(e) {
    srx = rotation.x
    sry = rotation.y
    mpx = e.pageX
    mpy = e.pageY
    if(!hovering) {
        mouseDown = true
    }
    invertX = (rotation.y % 360 + 360) % 360 <= 90 || (rotation.y % 360 + 360) % 360 > 270
})

$(document).bind("touchstart", function(e) {
    srx = rotation.x
    sry = rotation.y
    mpx = e.originalEvent.touches[0].pageX
    mpy = e.originalEvent.touches[0].pageY
    console.log(mpx, mpy)
    if(!hovering) {
        mouseDown = true
    }
    invertX = (rotation.y % 360 + 360) % 360 <= 90 || (rotation.y % 360 + 360) % 360 > 270
})

$(document).bind("mouseup touchend", function() {
    mouseDown = false
})

// Calculates the angle of rotation for the cube
$(document).bind('mousemove', function(e) {
        
    if(mouseDown) {
            console.log(e.pointerType)
            let difference = {x: (e.pageX - mpx) / sensitivity.x, y: (e.pageY - mpy) / sensitivity.y}
            rotation.y = (sry - difference.y)

            // When yellow is on top, x is rotated opposite (relative to initial position)
            if(invertX) {
                rotation.x = (srx + difference.x) % 360
            } else {
                rotation.x = (srx - difference.x) % 360
            }
            
            updateRotation()
        }
    })

$(document).bind('touchmove', function(e) {
    e = e.changedTouches[0]
    if(mouseDown) {
            let difference = {x: (e.pageX - mpx) / sensitivity.x, y: (e.pageY - mpy) / sensitivity.y}
            rotation.y = (sry - difference.y)

            // When yellow is on top, x is rotated opposite (relative to initial position)
            if(invertX) {
                rotation.x = (srx + difference.x) % 360
            } else {
                rotation.x = (srx - difference.x) % 360
            }
            
            updateRotation()
        }
    })
    
// This allows tracking of drags (start/end)
const stickers = $(".face").children()
for(let i = 0; i < stickers.length; i++) {
    stickers[i].addEventListener("mousedown", function(e) {
        startSticker = stickers[i].id
    })
    stickers[i].addEventListener("mouseup", function(e) {
        // If drag started off the cube and ends on a sticker, it is not counted
        // For now, the only allowed drags are using the same side stickers
        endSticker = stickers[i].id
        if(startSticker && startSticker.slice(1) === endSticker.slice(1)) {
            key = startSticker[0] + endSticker
            turn(dragCode[key])
        }
        startSticker = null
    })

    // Mobile responiveness
    stickers[i].addEventListener("touchstart", function(e) {
        startSticker = stickers[i].id
    })
    stickers[i].addEventListener("touchcancel", function(e) {
        startSticker = null
    })
}

// Mobile responsiveness (performs twists)
// Finds the sticker at the point where the touch lifted
// Performs a move using start and end stickers of drag
document.addEventListener("touchend", function(e) {
    let elem = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
    if(elem.className.includes("sticker")) {
        endSticker = elem.id
        if(startSticker && startSticker.slice(1) === endSticker.slice(1)) {
            key = startSticker[0] + endSticker
            turn(dragCode[key])
        }
        startSticker = null
    }
})







