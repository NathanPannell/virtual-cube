// Inspiration from https://ruwix.com/online-puzzle-simulators/
// Potential adaptation of https://html5rubik.com/tutorial/

// Accessing all of the faces from the DOM
const faces = document.getElementsByClassName("face")
const frontFace = document.getElementById("front")
const backFace = document.getElementById("back")
const topFace = document.getElementById("top")
const bottomFace = document.getElementById("bottom")
const leftFace = document.getElementById("left")
const rightFace = document.getElementById("right")

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

let edges = []
let corners = []
let centers = []

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
        <div class="sticker none">0</div>
        <div class="sticker none">1</div>
        <div class="sticker none">2</div>
        <div class="sticker none">3</div>
        <div class="sticker none">4</div>
        <div class="sticker none">5</div>
        <div class="sticker none">6</div>
        <div class="sticker none">7</div>
        <div class="sticker none">8</div>`
    }

    // Finish setup by assigning colors to each sticker (according to face)
    setColors()

    // Render colored cube
    renderCube()
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
        let sticker = face.children.item(i)
        sticker.className = "sticker "

        let code = faceCode[i]
        let index = parseInt(code[1], 16)
        let color = parseInt(code[2])
        if(code[0] === "C") {
            // Corners have 3 distinct color values
            if(color === 0) {
                sticker.className += corners[index].color0
            } else if(color === 1) {
                sticker.className += corners[index].color1
            } else {
                sticker.className += corners[index].color2
            }
        } else if(code[0] === "E") {
            // Edges have 2 distinct color values
            if(color === 0) {
                sticker.className += edges[index].color0
            } else {
                sticker.className += edges[index].color1
            }
        } else {
            // Centers have only 1 color value
            sticker.className += centers[index].color
        }   
    }
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

// Rotates cube on keydown
// (u)p, (d)own, (l)eft, (r)ight, (f)ront, (b)ack
// Press key for clockwise, SHIFT for counter-clockwise
document.addEventListener("keydown", function(e) {
    if(e.key === "u") {U()}
    else if(e.key === "U") {U_()}
    else if(e.key === "d") {D()}
    else if(e.key === "D") {D_()}
    else if(e.key === "l") {L()}
    else if(e.key === "L") {L_()}
    else if(e.key === "r") {R()}
    else if(e.key === "R") {R_()}
    else if(e.key === "f") {F()}
    else if(e.key === "F") {F_()}
    else if(e.key === "b") {B()}
    else if(e.key === "B") {B_()}

    // Update the cube after turn
    renderCube()
  });

initializeCube()