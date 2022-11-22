// Inspiration from https://ruwix.com/online-puzzle-simulators/
//TODO: Make multiple saved cubes
//TODO: Create custom color themes (for each saved cube)
//TODO: Generate efficient scrambles (maybe API from cstimer or other)
//TODO: Celebration when solved
//TODO: Download important scrambles (from wca.org or other)
//TODO: Save possibleMoves in solution and play them back
//TODO: Add timer with random scrambled possibleMoves

const faces = $(".face")
const cube = $(".cube")[0] // JQuery is very annoying for what I need to do with this element
const frontFace = $("#front")
const backFace = $("#back")
const topFace = $("#top")
const bottomFace = $("#bottom")
const leftFace = $("#left")
const rightFace = $("#right")
const transparentEl = $("#transparent")
const darkEl = $("#dark")
let isDark, isTransparent
const style = document.createElement("style");
document.head.appendChild(style);

// Mapping of piece objects to colored stickers
// C = Corner, E = Edge, M = Middle
// Read: "<type><index in array><side of piece>"
const frontCode = ["C32", "E01", "C01", "E70", "M00", "E40", "C71", "E81", "C42"]
const backCode = ["C62", "EA1", "C51", "E60", "M20", "E50", "C21", "E21", "C12"]
const topCode = ["C20", "E20", "C10", "E30", "M40", "E10", "C30", "E00", "C00"]
const bottomCode = ["C70", "E80", "C40", "EB0", "M50", "E90", "C60", "EA0", "C50"]
const leftCode = ["C22", "E31", "C31", "E61", "M30", "E71", "C61", "EB1", "C72"]
const rightCode = ["C02", "E11", "C11", "E41", "M10", "E51", "C41", "E91", "C52"]

// Mapping of piece combinations to twists
// Read: "<start sticker id #><end sticker id #><face>"
// At the moment, only possibleMoves along one face are possible
// TODO: Add codes for possibleMoves across faces
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

    "14front": "m", "17front": "m", "47front": "m",
    "14top": "m", "17top": "m", "47top": "m",
    "14bottom": "m", "17bottom": "m", "47bottom": "m",
    "14back": "m", "17back": "m", "47back": "m",
    "41front": "M", "71front": "M", "74front": "M",
    "41top": "M", "71top": "M", "74top": "M",
    "41bottom": "M", "71bottom": "M", "74bottom": "M",
    "41back": "M", "71back": "M", "74back": "M",
    
    "34front": "e", "35front": "e", "45front": "e",
    "34right": "e", "35right": "e", "45right": "e",
    "34left": "e", "35left": "e", "45left": "e",
    "43back": "e", "54back": "e", "53back": "e",
    "43front": "E", "53front": "E", "54front": "E",
    "43right": "E", "53right": "E", "54right": "E",
    "43left": "E", "53left": "E", "54left": "E",
    "34back": "E", "45back": "E", "35back": "E",

    "34top": "s", "45top": "s", "35top": "s",
    "14right": "s", "17right": "s", "47right": "s",
    "54bottom": "s", "53bottom": "s", "43bottom": "s",
    "74left": "s", "71left": "s", "41left": "s",
    "43top": "S", "54top": "S", "53top": "S",
    "41right": "S", "71right": "S", "74right": "S",
    "45bottom": "S", "35bottom": "S", "34bottom": "S",
    "47left": "S", "17left": "S", "14left": "S",
}

// Cube data (pieces are stored)
let edges = []
let corners = []
let centers = []
const possibleMoves = "uUdDfFbBrRlL"
const scrambleMoves = 100

// Drag-to-turn variables
let startSticker
let endSticker
let activeFace

// Recolor variables
let redURL
let orangeURL
let whiteURL
let yellowURL
let blueURL
let greenURL

// Rotation variables
const sensitivity = {x: window.innerWidth / 200, y: window.innerHeight / 200}
if(sensitivity.x > 5) {
    sensitivity.x = 5
}
if(sensitivity.y > 5) {
    sensitivity.y = 5
}
let mouseDown = false;
let hovering = false;
let rotation = {x: 0, y: 0, z: 0}
let invertY;

initializeCube()

style.innerHTML = `
#target {
color: blueviolet;
}
`;


function resetCube() {
    localStorage.setItem("isSaved", "false")
    window.location.reload()
}

function saveCube() {
    localStorage.setItem("edges", JSON.stringify(edges))
    localStorage.setItem("corners", JSON.stringify(corners))
    localStorage.setItem("centers", JSON.stringify(centers))
    localStorage.setItem("isSaved", "true")
}

function loadCube() {
    recolorCube()
    renderCube()
}

async function scrambleCube() {
    style.innerHTML = `
        .sticker {
            transition: ${3 / scrambleMoves}s;
        }`
    for(let i = 0; i < scrambleMoves; i++) {
        let char = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        turn(char)
        await delay(3000 / scrambleMoves)
    }
    style.innerHTML = `
        .sticker {
            transition: 0;
        }`
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

function newCube() {
    // Create an array of 12 edges (colorless)
    for (let i = 0; i < 12; i++) {
        let edge = {
            color0: "none",
            color1: "none",
            url0: null,
            url1: null,
            rotate: function () {
                let temp = this.color0
                this.color0 = this.color1
                this.color1 = temp
                temp = this.url0
                this.url0 = this.url1
                this.url1 = temp
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
            url0: null,
            url1: null,
            url2: null,
            rotateA: function () {
                let temp = this.color0
                this.color0 = this.color1
                this.color1 = this.color2
                this.color2 = temp
                temp = this.url0
                this.url0 = this.url1
                this.url1 = this.url2
                this.url2 = temp
            },
            rotateB: function () {
                let temp = this.color2
                this.color2 = this.color1
                this.color1 = this.color0
                this.color0 = temp
                temp = this.url2
                this.url2 = this.url1
                this.url1 = this.url0
                this.url0 = temp
            }
        }
        corners.push(corner)
    }
    
    // Create an array of 6 centers (colorless)
    for (let i = 0; i < 6; i++) {
        let center = {
            color: "none",
            url: null
        }
        centers.push(center)
    }

    // Finish setup by assigning colors to each sticker (according to face)
    setColors()
}

function recolorCube() {
    let loadEdges = JSON.parse(localStorage.getItem("edges"))
    let loadCorners = JSON.parse(localStorage.getItem("corners"))
    let loadCenters = JSON.parse(localStorage.getItem("centers"))
    for(let i = 0; i < edges.length; i++) {
        edges[i].color0 = loadEdges[i].color0
        edges[i].color1 = loadEdges[i].color1
        edges[i].url0 = loadEdges[i].url0
        edges[i].url1 = loadEdges[i].url1
    }
    for(let i = 0; i < corners.length; i++) {
        corners[i].color0 = loadCorners[i].color0
        corners[i].color1 = loadCorners[i].color1
        corners[i].color2 = loadCorners[i].color2
        corners[i].url0 = loadCorners[i].url0
        corners[i].url1 = loadCorners[i].url1
        corners[i].url2 = loadCorners[i].url2
    }
    for(let i = 0; i < centers.length; i++) {
        centers[i].color = loadCenters[i].color
        centers[i].url = loadCenters[i].url
    }
}

function initializeCube() {
    newCube()

    // Generate blank stickers on each face 
    for (let i = 0; i < faces.length; i++) {
        faces[i].innerHTML = `
        <div class="sticker" id="0${faces[i].id}"></div>
        <div class="sticker" id="1${faces[i].id}"></div>
        <div class="sticker" id="2${faces[i].id}"></div>
        <div class="sticker" id="3${faces[i].id}"></div>
        <div class="sticker" id="4${faces[i].id}"></div>
        <div class="sticker" id="5${faces[i].id}"></div>
        <div class="sticker" id="6${faces[i].id}"></div>
        <div class="sticker" id="7${faces[i].id}"></div>
        <div class="sticker" id="8${faces[i].id}"></div>`
    }

    addListeners()

    // Updating transparent/dark themes by pulling from local storage
    transparentEl.prop("checked", JSON.parse(localStorage.getItem("isTransparent")))
    darkEl.prop("checked", JSON.parse(localStorage.getItem("isDark")))
    updateDarkMode()
    updateTransparent()

    // Render colored cube
    renderCube()
    rotateCube([-30,-30, 0])
}  

// Initializes the colors for each side
function setColors() {
    setFace(frontCode, "#009B48", greenURL)
    setFace(backCode, "#0045AD", blueURL)
    setFace(topCode, "#FFFFFF", whiteURL)
    setFace(bottomCode, "#FFD500", yellowURL)
    setFace(leftCode, "#FF5900", orangeURL)
    setFace(rightCode, "#B90000", redURL)
}

// Accesses elements from centers, edges, or corners and sets to <colorName>
function setFace(faceCode, colorName, url) {
    for(let i = 0; i < 9; i++) {
        let type = faceCode[i][0]
        let index = parseInt(faceCode[i][1], 16)
        let color = parseInt(faceCode[i][2])
        if(type === "C") {
            corners[index]["color" + color] = colorName
            corners[index]["url" + color] = url
        } else if(type === "E") {
            edges[index]["color" + color] = colorName
            edges[index]["url" + color] = url
        } else {
            centers[index].color = colorName
            centers[index].url = url
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

        let type = faceCode[i][0]
        let index = parseInt(faceCode[i][1], 16)
        let color = parseInt(faceCode[i][2])
        if(type === "C") {
            sticker.css("background", `url(${corners[index]["url" + color]}) center center no-repeat`) 
            sticker.css("background-color", corners[index]["color" + color])
        } else if(type === "E") {
            sticker.css("background", `url(${edges[index]["url" + color]}) center center no-repeat`) 
            sticker.css("background-color", edges[index]["color" + color])
        } else {
            sticker.css("background", `url(${centers[index].url}) center center no-repeat`) 
            sticker.css("background-color", centers[index].color)
        } 
        sticker.css("background-size", "80%")
        if(face == backFace) {
            sticker.css("rotate", "180deg")
        }
    }
}

function updateTransparent() {
    isTransparent = transparentEl.prop("checked")
    if(isTransparent) {
        $("#cube").addClass("clear")
    } else {
        $("#cube").removeClass("clear")
    }
    localStorage.setItem("isTransparent", JSON.stringify(isTransparent))
}

function updateDarkMode() {
    isDark = darkEl.prop("checked")
    if(isDark) {
        $("body").addClass("dark-mode")
    } else {
        $("body").removeClass("dark-mode")
    }
    localStorage.setItem("isDark", JSON.stringify(isDark))
}

function cyclePieces(arr, a, b, c, d) {
    let temp = arr[a]
    arr[a] = arr[b]
    arr[b] = arr[c]
    arr[c] = arr[d]
    arr[d] = temp
}

function cycleEdges(a, b, c, d) { cyclePieces(edges, a, b, c, d) }
function cycleCorners(a, b, c, d) { cyclePieces(corners, a, b, c, d) }
function cycleCenters(a, b, c, d) { cyclePieces(centers, a, b, c, d) }

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

function turn(move) {
    if(move === "u") { U() }
    else if(move === "U") { U_() }
    else if(move === "d") { D() }
    else if(move === "D") { D_() }
    else if(move === "l") { L() }
    else if(move === "L") { L_() }
    else if(move === "r") { R() }
    else if(move === "R") { R_() }
    else if(move === "f") { F() }
    else if(move === "F") { F_() }
    else if(move === "b") { B() }
    else if(move === "B") { B_() }
    else if(move === "m") { M() }
    else if(move === "M") { M_() }
    else if(move === "e") { E() }
    else if(move === "E") { E_() }
    else if(move === "s") { S() }
    else if(move === "S") { S_() }
    renderCube()
}

// Applies rotation to cube with transition
function rotateCube([dy, dx, dz]) {
    rotation.x = dx
    rotation.y = dy
    rotation.z = dz
    updateRotation(1)
}

// Updates/renders the cube when rotation vector is changed manually
function updateRotation(time) {
    cube.style = `
    transition: ${time}s;
    transform: translateZ(-200px)
    rotateX(${rotation.y}deg)
    rotateY(${rotation.x}deg)
    rotateZ(${rotation.z}deg)
    ;`
}

function startRotation(e) {
    srx = rotation.x
    sry = rotation.y
    srz = rotation.z
    mpx = e.pageX
    mpy = e.pageY
    invertY = (rotation.y % 360 + 360) % 360
}

function addListeners() {
    // Turns cube on keypress
    // (u)p, (d)own, (l)eft, (r)ight, 
    // (f)ront, (b)ack, (m)iddle, (e)quator, (s)lice
    // Press key for clockwise, SHIFT for counter-clockwise
    document.addEventListener("keydown", function(e) {
        turn(e.key)
    })

    // Cube cannot be rotated when the mouse is hovering
    cube.addEventListener("mouseover", function() {
        hovering = true
    })
    cube.addEventListener("mouseout", function() {
        hovering = false
    })

    // Records initial condition of cube at start of rotation
    $(document).bind("mousedown", function(e) {
        mouseDown = !hovering
        startRotation(e)
    })
    $(document).bind("touchstart", function(e) {
        let elem = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
        mouseDown = elem.className.includes("body") || elem.className.includes("scene")
        // startRotation(e.originalEvent.touches[0])
        srx = rotation.x
        sry = rotation.y
        srz = rotation.z
        mpx = e.originalEvent.touches[0].pageX
        mpy = e.originalEvent.touches[0].pageY
        invertY = (rotation.y % 360 + 360) % 360
    })
    $(document).bind("touchcancel", function() {
        activeFace = null;
        startSticker = null;
        endSticker = null;
    })
    $(document).bind("mouseup touchend", function() {
        mouseDown = false
        if(startSticker && endSticker && startSticker.slice(1) === endSticker.slice(1)) {
            key = startSticker[0] + endSticker
            turn(dragCode[key])
        }
        startSticker = null
        activeFace = null
    })
    

    // tracking movement of mouse
    $(document).bind('mousemove', function(e) {
        move(e)
    })
    $(document).bind('touchmove', function(e) {
        move(e.changedTouches[0])
    })
        
    // This allows tracking of drags (start/end)
    const stickers = $(".face").children()
    for(let i = 0; i < stickers.length; i++) {
        stickers[i].addEventListener("mousedown", function(e) {
            startSticker = stickers[i].id
            activeFace = startSticker.slice(1)
        })
        stickers[i].addEventListener("touchstart", function(e) {
            startSticker = stickers[i].id
            activeFace = startSticker.slice(1)
        })
    }
}

// Calculates the angle of rotation for the cube
// TODO: More comprehensive rotation inversion (different color on top, not just white or yellow)
function move(e) {
    if(mouseDown) {
        let difference = {x: (e.pageX - mpx) / sensitivity.x, y: (e.pageY - mpy) / sensitivity.y}

        if(invertY < 90 || invertY > 270) {
            rotation.x = (srx + difference.x) % 360
        } else {
            rotation.x = (srx - difference.x) % 360
        }
        rotation.y = (sry - difference.y)
        updateRotation(0)
    } else {
        let elem = document.elementFromPoint(e.clientX, e.clientY)
        if(elem && elem.className.includes("sticker") && elem.id.slice(1) === activeFace) {
            endSticker = elem.id
        }
    }
}

function M() {
    cycleCenters(0, 4, 2, 5) 
    cycleEdges(0, 2, 10, 8)
    rotateEdges(0, 2, 10, 8)
}

function M_() {
    cycleCenters(5, 2, 4, 0)
    cycleEdges(8, 10, 2, 0)
    rotateEdges(0, 2, 10, 8)
}

function E() {
    cycleCenters(3, 2, 1, 0)
    cycleEdges(7, 6, 5, 4)
    rotateEdges(7, 6, 5, 4)
}

function E_() {
    cycleCenters(0, 1, 2, 3)
    cycleEdges(4, 5, 6, 7)
    rotateEdges(7, 6, 5, 4)
}

function S() {
    cycleCenters(1, 4, 3, 5)
    cycleEdges(1, 3, 11, 9)
    rotateEdges(1, 3, 11, 9)
}

function S_() {
    cycleCenters(5, 3, 4, 1)
    cycleEdges(9, 11, 3, 1)
    rotateEdges(1, 3, 11, 9)
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

function queryPokemon() {
    const complement = {
        "red": "orange",
        "green": "blue",
        "blue": "green",
        "brown": "white",
        "yellow": "white",
        "purple": "pink",
        "white": "yellow",
        "black": "white",
        "pink": "purple",
        "gray": "white"
    }

    let xhttp = new XMLHttpRequest()
    let xhttp2 = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(xhttp.responseText)
            redURL = json.sprites.front_default
            orangeURL = json.sprites.front_shiny
            whiteURL = `images/types/${json.types[0].type.name}.avif`
            if(json.types.length > 1) {
                yellowURL = `images/types/${json.types[1].type.name}.avif`
            } else {
                yellowURL = `images/types/${json.types[0].type.name}.avif`
            }
            let highest = {
                qty: 0,
                stat: ""
            }
            for(let i = 0; i < json.stats.length; i++) {
                if(json.stats[i].base_stat > highest.qty) {
                    highest.qty = json.stats[i].base_stat
                    highest.stat = json.stats[i].stat.name
                }
            }
            greenURL = `images/stats/${highest.stat}.png`
            if(json.weight < 300) {
                blueURL = "images/light.png"
            } else {
                blueURL = "images/heavy.png"
            }
            $(".info").css("background-size", "100%") 

            source = second + $("#pokemon-name").val()
            
        }
        xhttp2.open("GET", source, true)
        xhttp2.send()
    }
    xhttp2.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(xhttp2.responseText)
            if(json.color.name == "white" || json.color.name == "black" || json.color.name == "gray") {
                let temp1 = redURL
                redURL = whiteURL
                whiteURL = temp1
                let temp2 = orangeURL
                orangeURL = yellowURL
                yellowURL = temp2
            } else if(json.color.name == "yellow") {
                let temp1 = redURL
                redURL = yellowURL
                yellowURL = temp1
                let temp2 = orangeURL
                orangeURL = whiteURL
                whiteURL = temp2
            } else if(json.color.name == "blue") {
                let temp1 = redURL
                redURL = blueURL
                blueURL = temp1
                let temp2 = orangeURL
                orangeURL = greenURL
                greenURL = temp2
            } else if(json.color.name == "green") {
                let temp1 = redURL
                redURL = greenURL
                greenURL = temp1
                let temp2 = orangeURL
                orangeURL = blueURL
                blueURL = temp2
            }

        }
        initializeCube()
    }

    let source
    const main = "https://pokeapi.co/api/v2/pokemon/"
    const second = "https://pokeapi.co/api/v2/pokemon-species/"
    source = main + $("#pokemon-name").val()
    xhttp.open("GET", source, true)
    xhttp.send()
}