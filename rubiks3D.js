// Rotation variables
const sensitivity = {x: window.innerWidth / 200, y: window.innerHeight / 300}
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

// Applies rotation to cube with transition
function rotateCube([dy, dx, dz]) {
    rotation.x += dx
    rotation.y += dy
    rotation.z += dz
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
    startRotation
(e)
})
$(document).bind("touchstart", function(e) {
    let elem = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
    mouseDown = elem.className.includes("body") || elem.className.includes("scene")
    // startRotation
(e.originalEvent.touches[0])
    srx = rotation.x
    sry = rotation.y
    srz = rotation.z
    mpx = e.originalEvent.touches[0].pageX
    mpy = e.originalEvent.touches[0].pageY
    invertY = (rotation.y % 360 + 360) % 360
})
$(document).bind("mouseup touchend", function() {
    mouseDown = false
})

$(document).bind('mousemove', function(e) {
    move(e)
})
$(document).bind('touchmove', function(e) {
    move(e.changedTouches[0])
})