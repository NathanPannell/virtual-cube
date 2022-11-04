// 
const faces = document.getElementsByClassName("face")
const frontFace = document.getElementById("front")
const backFace = document.getElementById("back")
const topFace = document.getElementById("top")
const bottomFace = document.getElementById("bottom")
const leftFace = document.getElementById("left")
const rightFace = document.getElementById("right")

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
    // Create an array of 12 edges (blank)
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
    
    // Create an array of 8 corners (blank)
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
    
    // Create an array of 6 centers (blank)
    for (let i = 0; i < 6; i++) {
        let center = {
            color: "none"
        }
        centers.push(center)
    }

    // Generate stickers on each face (in index.html)
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
    
  
}  

function setColors() {
    setFace(frontCode, "green")
    setFace(backCode, "blue")
    setFace(topCode, "white")
    setFace(bottomCode, "yellow")
    setFace(leftCode, "orange")
    setFace(rightCode, "red")
}

function setFace(faceCode, colorName) {
    for(let i = 0; i < 9; i++) {
        let code = faceCode[i]
        let index = parseInt(code[1], 16)
        let color = parseInt(code[2])
        if(code[0] === "C") {
            if(color === 0) {
                corners[index].color0 = colorName
            } else if(color === 1) {
                corners[index].color1 = colorName
            } else {
                corners[index].color2 = colorName
            }
        } else if(code[0] === "E") {
            if(color === 0) {
                edges[index].color0 = colorName
            } else {
                edges[index].color1 = colorName
            }
        } else {
            centers[index].color = colorName
        }   
    }
}

function renderCube() {
    renderFace(frontFace, frontCode)
    renderFace(backFace, backCode)
    renderFace(topFace, topCode)
    renderFace(bottomFace, bottomCode)
    renderFace(leftFace, leftCode)
    renderFace(rightFace, rightCode)
}

function renderFace(face, faceCode) {
    for(let i = 0; i < 9; i++) {
        let sticker = face.children.item(i)
        sticker.className = "sticker "
        let code = faceCode[i]
        let index = parseInt(code[1], 16)
        let color = parseInt(code[2])
        if(code[0] === "C") {
            if(color === 0) {
                sticker.className += corners[index].color0
            } else if(color === 1) {
                sticker.className += corners[index].color1
            } else {
                sticker.className += corners[index].color2
            }
        } else if(code[0] === "E") {
            if(color === 0) {
                sticker.className += edges[index].color0
            } else {
                sticker.className += edges[index].color1
            }
        } else {
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

function rotateCorners(a, b, c, d) {
    corners[a].rotateB()
    corners[b].rotateA()
    corners[c].rotateB()
    corners[d].rotateA()
}

function rotateEdges(a, b, c, d) {
    edges[a].rotate()
    edges[b].rotate()
    edges[c].rotate()
    edges[d].rotate()

}

function U() {
    cycleEdges(0, 1, 2, 3)
    cycleCorners(0, 1, 2, 3)
}

function U_() {
    cycleEdges(3, 2, 1, 0)
    cycleCorners(3, 2, 1, 0)
}

function D() {
    cycleEdges(11, 10, 9, 8)
    cycleCorners(7, 6, 5, 4)
}

function D_() {
    cycleEdges(8, 9, 10, 11)
    cycleCorners(4, 5, 6, 7)
}

function R() {
    cycleEdges(4, 9, 5, 1)
    cycleCorners(4, 5, 1, 0)
    rotateCorners(0, 1, 5, 4)
}

function R_() {
    cycleEdges(1, 5, 9, 4)
    cycleCorners(0, 1, 5, 4)
    rotateCorners(0, 1, 5, 4)
}

function L() {
    cycleEdges(6, 11, 7, 3)
    cycleCorners(6, 7, 3, 2)
    rotateCorners(2, 3, 7, 6)
}

function L_() {
    cycleEdges(3, 7, 11, 6)
    cycleCorners(2, 3, 7, 6)
    rotateCorners(2, 3, 7, 6)
}

function F() {
    cycleEdges(7, 8, 4, 0)
    rotateEdges(0, 4, 8, 7)
    cycleCorners(7, 4, 0, 3)
    rotateCorners(3, 0, 4, 7)
}

function F_() {
    cycleEdges(0, 4, 8, 7)
    rotateEdges(0, 4, 8, 7)
    cycleCorners(3, 0, 4, 7)
    rotateCorners(3, 0, 4, 7)
}

function B() {
    cycleEdges(5, 10, 6, 2)
    rotateEdges(2, 6, 10, 5)
    cycleCorners(5, 6, 2, 1)
    rotateCorners(1, 2, 6, 5)
}

function B_() {
    cycleEdges(2, 6, 10, 5)
    rotateEdges(2, 6, 10, 5)
    cycleCorners(1, 2, 6, 5)
    rotateCorners(1, 2, 6, 5)
}

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

    renderCube()
  });

initializeCube()
setColors()
renderCube()
console.log(edges)
console.log(corners)
console.log(centers)