const fs = require('fs');
const gifEditor = require('./GifEditor');
/*
Header - First 6 bytes
    LSD - Next 7 bytes (3 most LSB in 5th byte attribute the size in the GCT, if it exists.)

    Next is either a Global color table (or if no GCT, each frame has LCT)
    3 bytes for each colour 

    GCT size is 3*2^(N+1), with N being number of colors found in LSD for the GCT

    GCE (Optional, always starts with '21 F9')

    Each image in the gif starts with an ID (10 bytes long, always starts with '2C')

    LCT - Organized similarly to GCT
    2nd byte says the byte length of the LCT, followed by the block terminator '00'

    http://giflib.sourceforge.net/whatsinagif/bits_and_bytes.html

    https://www.w3.org/Graphics/GIF/spec-gif89a.txt
*/

fs.readFile("../assets/gen1/aerodactyl.gif", (err, buffer) => {
    if(err){
        console.log(err);
    } else {
        gifEditor.loadGif(buffer);
        gifEditor.buildGif();
    }
})