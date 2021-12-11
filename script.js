const wrapper = document.querySelector(".wrapper");
const gridSlide = document.querySelector("#gridSlide");
const resetBtn = document.querySelector("#resetBtn");
const toggleBtn = document.querySelector("#toggleBtn");
const colorPicker = document.querySelector("#colorPicker");

let toggleCount = 0;

makeGrid(gridSlide.value);

function makeGrid (gridSize) {
    for (let i=0; i < gridSize*gridSize; i++) {
        wrapper.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        wrapper.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        let box = document.createElement("div");
        box.className = "box";
        box.id = i;
        wrapper.appendChild(box)
    }
}

function resetGrid(gridValue) {
    while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
    }
    makeGrid(gridValue);
    toggleCount = 0;
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
    let currentColor = colorPicker.value;
    const toPaint = document.getElementById(boxId);
    console.log(boxId)
    toPaint.style.backgroundColor = currentColor;
}


