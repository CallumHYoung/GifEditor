const fs = require('fs');

const Header = require('./blocks/Header');
const LogicalScreenDescriptor = require('./blocks/LogicalScreenDescriptor');
const GlobalColorTable = require('./blocks/GlobalColorTable');
const LocalColorTable = require('./blocks/LocalColorTable');
const ApplicationExtension = require('./blocks/ApplicationExtension');
const GraphicsControlExtension = require('./blocks/GraphicsControlExtension');
const ImageDescriptor = require('./blocks/ImageDescriptor');
const ImageData = require('./blocks/ImageData');
const Image = require('./blocks/Image');

var IS_DEBUG = true;
var cursor = 0;

var header = null;
var LSD = null;
var GCT = null;

var hasGCT = false;

var GCTs = [];
var GCEs = [];
var AEs = [];
var moduleCount = 2;
var images = [];

var modules = [];

function loadGif(buffer){
    header = new Header(buffer.slice(0,6));
    LSD = new LogicalScreenDescriptor(buffer.slice(6, 13))
    cursor = 13;

    while(cursor < (buffer.length - 1)){
        // console.log(`Cursor: ${cursor} | data:${buffer[cursor]}`);
        if((buffer[cursor] != 0) && !hasGCT ){
            // build GCT
            hasGCT = true;
            console.log("building GCT");
            console.log(LSD.globalColorTableSize);
            var gctSize = LSD.globalColorTableSize + 1;
            var gctSizeBytes = Math.pow(2,gctSize)*3;
            if(IS_DEBUG) console.log(`GCT SIZE: ${gctSize}, BYTES: ${gctSizeBytes}`);
            
            if(!GCT){
                GCT = new GlobalColorTable(gctSize, buffer.slice(cursor, cursor + gctSizeBytes));
            } else {
                modules.push(GCT);
            }
            // GCTs.push({
            //     "module": GCT,
            //     "indexInFile": ++moduleCount
            // });
            cursor += gctSizeBytes;
        }

        if((buffer[cursor] == 33) && (buffer[cursor+1] == 249)){
            // build GCE
            console.log("building GCE");
            var GCE = new GraphicsControlExtension(buffer.slice(cursor, cursor+8));
            GCE.disposalMethod = 2;
            cursor += 8;
            // GCEs.push({
            //     "module": GCE,
            //     "index": ++moduleCount
            // })
            modules.push(GCE);
            if(IS_DEBUG) console.log(`DISPOSAL METHOD: ${GCE.disposalMethod}`);
        }

        if((buffer[cursor] == 33) && (buffer[cursor+1] == 255)){
            console.log("building AE");
            // build application extension like netscape
            cursor += 2; // skip header and extension label
            var applicationBlockLength = buffer[cursor];
            cursor += 1; // move over application block size to parse block
            if(IS_DEBUG) console.log(`Application Extension: application block length: ${applicationBlockLength}`);
            var applicationBlock = buffer.slice(cursor, cursor + applicationBlockLength);
            cursor += applicationBlockLength;
            var subblocks = []
            var subBlockCount = 0;
            while(buffer[cursor] != 0){
                var subblockSize = buffer[cursor];
                cursor += 1; // move over sub block size to parse sub block
                subblocks.push({
                    "size": subblockSize,
                    "block": buffer.slice(cursor, cursor + subblockSize)
                });
                cursor += subblockSize;
                ++subBlockCount;
            }
            cursor += 1; // move over ending byte '00';
            var AE = new ApplicationExtension({
                "applicationBlockLength": applicationBlockLength,
                "applicationBlock": applicationBlock,
                "subBlocks": subblocks
            });
            // AEs.push({
            //     "module": AE,
            //     "index": ++moduleCount
            // });
            modules.push(AE);
        }

        if(buffer[cursor] == 44){
            // build image descriptor 
            if(IS_DEBUG) console.log(`CURSOR LOC: ${cursor}`);
            if(IS_DEBUG) console.log("building Image Descriptor");

            var ID = new ImageDescriptor(buffer.slice(cursor, cursor + 10));

            if(IS_DEBUG) console.log(`ID FLAG: ${ID.localColorTableFlag}`);
            var localColorFlag = ID.localColorTableFlag;
            cursor += 10;
            // end image descriptor

            // parse local color table if flag is toggled
            var LCT = null;
            if(localColorFlag == 1){
                var lctSize = ID.localColorTableSize + 1;
                var lctSizeBytes = Math.pow(2,lctSize)*3;

                if(IS_DEBUG) console.log(`LCT SIZE: ${lctSize}, BYTES: ${lctSizeBytes}`);
                LCT = new LocalColorTable(lctSize, buffer.slice(cursor, cursor + lctSizeBytes));
                cursor += lctSizeBytes;
            }
            // end local color table

            // parse image data
            console.log("building Image frames");
            var subBlocks = [];
            if(IS_DEBUG) console.log(`SIZE OF FIRST BLOCK: ${buffer[cursor]}`);
            var minimumCodeSize = buffer[cursor];
            cursor += 1;
            while(buffer[cursor] != 0){
                var blockSize = buffer[cursor];
                cursor += 1; // move cursor over block size byte to start reading block
                if(IS_DEBUG) console.log(`BLOCK SIZE: ${blockSize}`);
                // if(IS_DEBUG) console.log(buffer.slice(cursor, cursor + 10));
                
                subBlocks.push(
                    {
                        "size": blockSize,
                        "values": buffer.slice(cursor, cursor + blockSize)
                    }
                );
                cursor += blockSize;
                if(IS_DEBUG) console.log("after block");
                if(IS_DEBUG) console.log(buffer.slice(cursor-10, cursor + 10));
            }
            var imageData = new ImageData(minimumCodeSize, subBlocks);
            cursor += 1; // move over the final terminal byte '00' of block; (must be done for each image data block)
            // images.push(new Image(ID, imageData, LCT));
            var img = new Image(ID, imageData, LCT);
            modules.push(img);
            // end image data
        }
        if(IS_DEBUG) console.log(`CURSOR LOC: ${cursor} | BUFFER LENGTH: ${buffer.length}`);
    }
}

function buildGif(){
    var gifBuffer = header.objectAsBuffer;
    if(GCT){
        gifBuffer = Buffer.concat([gifBuffer, LSD.objectAsBuffer, GCT.objectAsBuffer]);
    } else {
        gifBuffer = Buffer.concat([gifBuffer, LSD.objectAsBuffer]);
    }

    modules.forEach((module) => {
        gifBuffer = Buffer.concat([gifBuffer, module.objectAsBuffer]);
    });
    gifBuffer = Buffer.concat([gifBuffer, Buffer.alloc(1, 0x3B)]);
    fs.writeFile("../assets/gen1/aaaaaaaa.gif", gifBuffer, () => {
        console.log("Done!");
    });
}

exports.loadGif = loadGif;
exports.buildGif = buildGif;