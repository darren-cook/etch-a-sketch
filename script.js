const wrapper = document.querySelector(".wrapper");
const gridSlide = document.querySelector("#gridSlide");
const resetBtn = document.querySelector("#resetBtn");
const toggleBtn = document.querySelector("#toggleBtn");
const colorPicker = document.querySelector("#colorPicker");
const undoBtn = document.querySelector("#undoBtn");
const redoBtn = document.querySelector("#redoBtn");

let toggleCount = 0;
let recentChanges = []
let recentChangesPos = 0;
let pause = false; 
let edited = true;

makeGrid(gridSlide.value);

function makeGrid (gridSize) {
    for (let i=0; i < gridSize*gridSize; i++) {
        wrapper.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        wrapper.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        let box = document.createElement("div");
        box.className = "box";
        box.id = i;
        box.style.backgroundColor = "#EEE5E9"
        wrapper.appendChild(box)
    }
}

function resetGrid(gridValue) {
    while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
    }
    makeGrid(gridValue);
    toggleCount = 0;
    recentChangesPos = 0;
    edited = true;
    pause = false
}

gridSlide.oninput = function(){
    resetGrid(this.value);
}

resetBtn.addEventListener("click", function(){
    resetGrid(16);
    gridSlide.value = 16;
})

toggleBtn.addEventListener("click", function(){
    const boxToggle = document.querySelectorAll(".box");
    if (toggleCount%2 == 0){
        boxToggle.forEach(function(item){
            item.style.border = "none";
        })
    } else {
        boxToggle.forEach(function(item){
            item.style.border = "1px solid grey";
        })       
    }
    toggleCount ++;
})

wrapper.addEventListener("mouseover", function(event){
    paintBox(event.target.id);
})

function paintBox(boxId) {
    edited = true;
    if ((edited == true) && (pause == true)) {
        undoBtn.disabled = true;
        redoBtn.disabled = true;
        carryOver = recentChanges[recentChangesPos];
        recentChanges.splice(0, recentChanges.length);
        recentChanges.unshift(carryOver);
        recentChangesPos = 0;
        console.log(recentChangesPos);
        console.log(recentChanges);
        pause = false;
    }
    const toPaint = document.getElementById(boxId);
    let currentColor = colorPicker.value;
    let oldColor = toPaint.style.backgroundColor;
    oldColorHex = getHex(oldColor);
    addRecentChange(boxId, oldColorHex, currentColor);
    toPaint.style.backgroundColor = currentColor;
    undoBtn.disabled = false;
}

// converting to hex in order to compare color values of "oldColor" and "currentColor" for the addRecentChanges function.
// the colorPicker.value returns rgb vlaue but the .style.backgroundColor returns hex value.
// we only want to add to the array when the colors !=. Otherwise, the undo button will undo "changes" that are not visible. 

function getHex(oldColor){
    rgbValue = (oldColor.slice(4, -1).split(",").map(item=>item.trim()));
    r = Number(rgbValue[0])
    g = Number(rgbValue[1])
    b = Number(rgbValue[2])
    hexValue = rgbToHex(r, g, b)
    return hexValue;
}

function addRecentChange(boxId, oldColorHex, currentColor) {
    if (oldColorHex != currentColor) {
        recentChanges.unshift([boxId, oldColorHex, currentColor])
    }
}

undoBtn.addEventListener("click", function(){
    edited = false;
    pause = true;
    undoChange(recentChanges, recentChangesPos)
    recentChangesPos ++;
})

redoBtn.addEventListener("click", function(){
    edited = false;
    pause = true;
    recentChangesPos --;
    redoChange(recentChanges, recentChangesPos)
})

function undoChange(recentChanges, recentChangesPos) {
    checkPos(recentChanges, recentChangesPos);
    const toChange = document.getElementById(recentChanges[recentChangesPos][0]);
    toChange.style.backgroundColor = recentChanges[recentChangesPos][1];
    redoBtn.disabled = false;
}

function redoChange(recentChanges, recentChangesPos) {
    checkPos(recentChanges, recentChangesPos);
    const toChange = document.getElementById(recentChanges[recentChangesPos][0]);
    toChange.style.backgroundColor = recentChanges[recentChangesPos][2];
}

function checkPos (recentChanges, recentChangesPos) {
    if (recentChangesPos == 0) {
        redoBtn.disabled = true;
    }   else {
        redoBtn.disabled = false;
    }
    if (recentChanges.length -1 == recentChangesPos) {
        undoBtn.disabled = true;
    }   else {
        undoBtn.disabled = false;
    }
}

// copied rgbtohex functions from w3docs:
// https://www.w3docs.com/snippets/javascript/how-to-convert-rgb-to-hex-and-vice-versa.html
function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
