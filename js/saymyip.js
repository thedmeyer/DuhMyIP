/*
* Created by thedmeyer.
* Copyright 2014.
*/

/* 
This won't run unless 
http://www.codehelper.io/api/ips/?js
is included above this file.
*/

// Config Vars
var img1 = "img/special.png";
var img2 = "img/special2.png";
var titleSound = "sounds/duh.mp3";
var ip = codehelper_ip.IP; //".0123456789"
var ext = ".mp3";
var takes = 3; // There are 3 takes for each audio clip.

// Instance Vars
var sounds = new Array();
var curSound = null;


// Set up sounds 0 - 9
for (var i = 0; i <= 9; i++)
{
	// Nested array for random sounds 1 - 3
	sounds[i.toString()] = new Array(); 
	for (var j = 1; j <= takes; j++) // Add random sounds 1 - 3 for this digit
	{
		sounds[i.toString()][j] = new Audio("sounds/" + i + "-" + j + ext);
	}	
}

// Set up special char sounds
sounds['.'] = new Array();
sounds['starting'] = new Array();
sounds['ending'] = new Array();

for (var i = 1; i <= takes; i++)
{
	sounds['.'][i] = new Audio("sounds/" + "dot-" + i + ext);
	sounds['starting'][i] = new Audio("sounds/" + "starting-" + i + ext);
	sounds['ending'][i] = new Audio("sounds/" + "ending-" + i + ext);
}


/*
* This function increments through the IP and plays the random associated sounds.
*/
function playIP(i)
{	
	// If past all the chars in IP, we're done.
	if (i > ip.length)
		return;
	
	// Randomly selected sound file number.
	var rand = Math.floor(Math.random() * takes) + 1;
	
	if (i == -1) // If we are starting from the beginning, play start sound.
		curSound = sounds['starting'][rand];
	else if (i == ip.length) // We're now at the end.
	{
		curSound = sounds['ending'][rand];
		switchImg(false);
	}
	else // Else we're just strolling through the middle of the IP.
		curSound = sounds[ip.charAt(i)][rand];
	
	// Play the current character!
	curSound.play();
	
	// Now we wait. Don't play the next sound until the current one is finished.
	curSound.onended = function() {
    	playIP(++i);
	};
}

/*
* Switches the two title images.
*/
function switchImg(playing)
{
	document.getElementById("awesome").src = (playing) ? img2 : img1;
}

/*
* Plays the title sound of the page.
*/
function playTitleSound()
{
	// Is sound already playing? If so, get out of here!
	if(curSound != null && !curSound.ended)
		return;
		
	switchImg(true);
	
	// Create temp var to hold the sound.
	var title = new Audio(titleSound);
	
	// Play the sound.
	title.play();
	
	// Wait until the sound is done then switch the image back.
	title.onended = function() {
    	switchImg(false);
	};
	
}

/*
* Basically the main function. Defines itself.
*/
function onButtonClick()
{
	// Is sound already playing? If so, get out of here!
	if(curSound != null && !curSound.ended)
		return;
	
	switchImg(true);
	
	// Play the IP sound!
	playIP(-1);
}