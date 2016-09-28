var thumb = new Array(16);
var thumbSize = 160;
var empty = 15;
var tempo = 2;
var isShuffle = false;
var counter = 0;
var previousRand = "";
var shuffleTime = 7;

function slide (elem, celX, celY, time) {
    var x = elem.style.left;
    var y = elem.style.top;
    if (celX < parseInt(elem.style.left))
        x = parseInt(x) - 20;
    else if (celX > parseInt(elem.style.left))
        x = parseInt(x) + 20;
    else if (celY < parseInt(elem.style.top))
        y = parseInt(y) - 20; 
    else if (celY > parseInt(elem.style.top))
        y = parseInt(y) + 20;
    elem.style.left = x + "px";
    elem.style.top = y + "px";
    if ((celX + "px") == elem.style.left && (celY + "px") == elem.style.top)
        return;
    else window.setTimeout(function() {
        slide(elem, celX, celY, time);  
        }, time);
}

function opacityShow (elem, time) {
    elem.style.opacity = parseFloat(elem.style.opacity) + 0.005;
    if (elem.style.opacity == "1") {
        activeShuffleButton();  //aktywuj przycisk tasuj po animacji
        return;    
    }
    else window.setTimeout(function() {
        opacityShow(elem, time);
        }, time);
}

function opacityHide(elem, time) {
        elem.style.opacity = parseFloat(elem.style.opacity) - 0.005;
    if (elem.style.opacity == "0")
        return;
    else window.setTimeout(function() {
        opacityHide(elem, time);  
        }, time);
}

function hasWon () {
    for (i = 1; i <= 16; i++) {
        var id = "th-" + ((i<10) ? "0" + i : i);
        if (thumb[i-1] != id) {
            return false;
        }
        else continue;
    }
    opacityShow(document.getElementById(thumb[empty]), tempo);
    for (i = 1; i <= 16; i++) {
        var id = "th-" + ((i<10) ? "0" + i : i);
        document.getElementById(id).style.cursor = "auto";
        document.getElementById(id).onclick = false;
    }
}

function move () {
    for (i = 0; i < 16; i++) {
        if (thumb[i] == this.id) {
            nr = i;
            break;
        }
    }
    tmp = thumb[empty];
    thumb[empty] = this.id;
    thumb[nr] = tmp;
    setPosition(empty, true);
    empty = nr;
    setPosition(empty, false);
    setOnClicks();
    if (!isShuffle) {
        document.getElementById("counter").innerHTML = ++counter;
        hasWon();
    }
}

function moveRandom() {
    var neighbor = new Array(4);
    
    neighbor[0] = (empty%4 != 0) ? empty - 1: -1; 
    neighbor[1] = (empty%4 != 3) ? empty + 1: -1;
    neighbor[2] = (empty > 3) ? empty - 4: -1;
    neighbor[3] = (empty < 12) ? empty + 4: -1;
    
    var rand = Math.floor(Math.random() * 4);
    if (neighbor[rand] != -1 
        && thumb[neighbor[rand]] != previousRand    //nie przesuwaj dwa razy z rzędu tego samego klocka
        && document.getElementById(thumb[neighbor[rand]]).onclick != false) {
            previousRand = thumb[neighbor[rand]];
            document.getElementById(thumb[neighbor[rand]]).click();
    }
    else moveRandom();
}


function setPosition (arrayNumber, animate) {
    obrazek = document.getElementById(thumb[arrayNumber]);
    if (animate == false) {
        obrazek.style.left = (arrayNumber % 4) * thumbSize + "px";
        obrazek.style.top = Math.floor(arrayNumber/4) * thumbSize + "px";
    }
    else {
        slide(obrazek, (arrayNumber % 4) * thumbSize, Math.floor(arrayNumber/4) * thumbSize, tempo);
    }
    
}

function setCursorAuto() {
    for (i = 0; i < 16; i++) {
        document.getElementById(thumb[i]).onclick = "";
        document.getElementById(thumb[i]).style.cursor = "auto";
    }
}

function setOnClicks () {
    lewy = empty - 1; 
    prawy = empty + 1;
    gorny = empty - 4;
    dolny = empty + 4;
    
    //zeruj
    setCursorAuto();
    //czy istnieją sąsiedzi
    if (empty%4 != 0) { //lewy sąsiad
        document.getElementById(thumb[lewy]).onclick = move;
        document.getElementById(thumb[lewy]).style.cursor = "pointer";
    }
    if (empty%4 != 3) { //prawy sąsiad
        document.getElementById(thumb[prawy]).onclick = move;
        document.getElementById(thumb[prawy]).style.cursor = "pointer";
    }
    if (empty > 3) {    //górny sąsiad
        document.getElementById(thumb[gorny]).onclick = move;
        document.getElementById(thumb[gorny]).style.cursor = "pointer";   
    }
    if (empty < 12) {   //dolny sąsiad
        document.getElementById(thumb[dolny]).onclick = move;
        document.getElementById(thumb[dolny]).style.cursor = "pointer";    
    }
    document.getElementById(thumb[empty]).style.opacity = "0";
}

function deactiveShuffleButton() {
    var shuffleButton = document.getElementById("shuffle");
    shuffleButton.onclick = false;
    shuffleButton.className = "inactive";
}

function activeShuffleButton() {
    var shuffleButton = document.getElementById("shuffle");
    shuffleButton.onclick = shuffle;
    shuffleButton.className = "active";
}

function timer() {
    var timerText = document.getElementById("timer").innerHTML;
    var nowy = Number(timerText) - 1;
    if (nowy > 0)
        document.getElementById("timer").innerHTML = nowy;
}

function shuffle() {
    reset();
    isShuffle = true;
    var interlval = setInterval(moveRandom, 200);
    var timerVar = setInterval(timer, 1000);
    document.getElementById("timer").innerHTML = shuffleTime;
    document.getElementById("timer").style.display = "inline-block";
    
    setTimeout(function() {
        clearInterval(interlval);
        clearInterval(timerVar);
        document.getElementById("timer").style.display = "none";
        deactiveShuffleButton();
        isShuffle = false;
    }, shuffleTime * 1000);
    setOnClicks();
}

function hideThumbs() {
    document.getElementById("thumbs-choice").style.display = "none";
    document.getElementById("change-image").classList.remove("image-button-active");
    document.getElementById("change-image").classList.add("image-button-inactive");
}

function showThumbs() {
    var thumbs = document.getElementById("thumbs-choice");
    if (thumbs.style.display == "none") {
        thumbs.style.display = "block";
        document.getElementById("change-image").classList.remove("image-button-inactive");
        document.getElementById("change-image").classList.add("image-button-active");
    }
    else {
        hideThumbs();
    }
}

function setImages(name) {
    if (this.src) {
        var endIndex = this.src.lastIndexOf("/");
        var beginIndex = this.src.substring(0, endIndex).lastIndexOf("/");
        name = this.src.substring(beginIndex + 1, endIndex);
        hideThumbs();
        activeShuffleButton();
    }
    for (i = 1; i <= 16; i++) {
        var id = "th-" + ((i<10) ? "0" + i : i);
        thumb[i-1] = id;
        
        setPosition(i-1, false);
        obrazek = document.getElementById(id);
        obrazek.src = "images/" + name + "/img_" + ((i<10) ? "0" + i : i) + ".jpg";
        obrazek.style.width = thumbSize + "px";
        obrazek.style.height = thumbSize + "px";
    }
    document.getElementById("oryg").src = "images/" + name + "/img.jpg";
    reset();
}

function reset() {
    empty = 15;
    document.getElementById(thumb[empty]).style.opacity = "0";      //schowaj empty (obrazek do przesuwania)
    document.getElementById("shuffle").onclick = shuffle;           //przypisz zdarzenie przycisku Tasuj    
    document.getElementById("counter").innerHTML = 0;               //zeruj licznik ruchów
    counter = 0;
    setCursorAuto();
    document.getElementById("change-image").onclick = showThumbs;   //przypisz zdarzenie przycisku Obrazek
    document.getElementById("thumbs-choice").style.display = "none"; //schowaj obrazki
}

function start() {
    setImages("dundusSquare");
    reset();
    var thumbs = document.getElementsByClassName("thumb");
    for (var i=0; i < thumbs.length; i++)
        thumbs.item(i).onclick = setImages;
}

window.onload = start;
window.res