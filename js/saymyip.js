/*
Copyright (c) 2014 - 2017 David Meyer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Config Vars
const img1            = "img/special.png";
const img2            = "img/special2.png";
const imgElement      = "awesome";        // The element id for the title image.
const audioElement    = "playitagain";
const titleSound      = "sounds/duh.mp3";
const dir             = "sounds/";        // The directory of all the audio clips.
const ext             = ".mp3";
const takes           = 3;                // There are 3 takes for each audio clip.

// Instance Vars
let ip          = "";
let sounds      = new Array();
let curSound    = null;
let START_POINT = -1;
let END_POINT   = -1;

/*
* The main init function, called upon ip retrieval
*/
const main = (json)=> {
    // Getting the IP
    ip = json.ip; //".0123456789"
    END_POINT = ip.length;

    // Set up sounds 0 - 9
    for (let i = 0; i <= 9; i++) {
        // Nested array for random sounds 1 - 3
        sounds[i.toString()] = new Array();
        for (let j = 1; j <= takes; j++) { // Add random sounds 1 - 3 for this digit
            sounds[i.toString()][j] = dir + i + "-" + j + ext;
        }
    }

    // Set up special char sounds
    sounds['.'] = new Array();
    sounds['starting'] = new Array();
    sounds['ending'] = new Array();

    for (let i = 1; i <= takes; i++) {
        sounds['.'][i] = dir + "dot-" + i + ext;
        sounds['starting'][i] = dir + "starting-" + i + ext;
        sounds['ending'][i] = dir + "ending-" + i + ext;
    }
}

/*
* Handles playing audio from specified source.
* Includes onend callback.
*/
const playAudio = (src, onend)=> {
    const audio = document.getElementById(audioElement);
    audio.src = src;
    audio.play();
    audio.onended = ()=> {
        onend();
    };
}

/*
* This function increments through the IP and plays the random associated sounds.
*/
const playIP = (i, onend)=> {
    // If past all the chars in IP, we're done.
    if (i > END_POINT) return;

    // Randomly selected sound file number.
    const rand = Math.floor(Math.random() * takes) + 1;

    // Determine current position in IP.
    switch (i) {
        case START_POINT:
            curSound = sounds['starting'][rand];
            break;
        case END_POINT:
            curSound = sounds['ending'][rand];
            onend();
            break;
        default:
            curSound = sounds[ip.charAt(i)][rand];
    }

    // Begin playing sounds. Iterate on complete.
    playAudio(curSound, playIP.bind(null, i+1, onend));
}

/*
* Switches the two title images.
*/
const switchImg = (playing)=> {
    document.getElementById(imgElement).src = (playing) ? img2 : img1;
}

/*
* Plays the title sound of the page.
*/
const playTitleSound = ()=> {
    // Is sound already playing? If so, get out of here!
    if (curSound != null && !curSound.ended) return;

    // Change title image to playing state.
    switchImg(true);

    // Play sound and change title image to default state on complete.
    playAudio(titleSound, switchImg.bind(null, false));
}

/*
* Triggered by user action on click.
* Handles switching the title image and playing the IP.
*/
const onButtonClick = ()=> {
    // Is sound already playing? If so, get out of here!
    if (curSound != null && !curSound.ended) return;

    // Change title image to playing state.
    switchImg(true);

    // Play the IP and change title image to default state on complete.
    playIP(START_POINT, switchImg.bind(null, false));
}
