class GraphicsControlExtension{
    constructor(byteBuffer){
        this.extensionIntroducer = byteBuffer[0];
        this.graphicControlLabel = byteBuffer[1];
        this.byteSize = byteBuffer[2];
        this.packedField = byteBuffer[3];
        this.delayTime = byteBuffer.slice(4,6);
        this.transparentColorIndex = byteBuffer[6];
        this.blockTerminator = byteBuffer[7];
        console.log(byteBuffer);
        console.log(Buffer.concat(
            [
                Buffer.alloc(1, this.extensionIntroducer),
                Buffer.alloc(1, this.graphicControlLabel),
                Buffer.alloc(1, this.byteSize),
                Buffer.alloc(1, this.packedField),
                this.delayTime,
                Buffer.alloc(1, this.transparentColorIndex),
                Buffer.alloc(1, this.blockTerminator)
            ]
        ));
    }

    // get extensionIntroducer(){
    //     return this.extensionIntroducer;
    // }

    // get graphicControlLabel(){
    //     return this.graphicControlLabel;
    // }

    // get byteSize(){
    //     return this.byteSize;
    // }

    get disposalMethod(){
        return (this.packedField >> 2) & 7;
    }

    set disposalMethod(method){
        this.packedField = (this.packedField & 227); 
        this.packedField = (method<<2) | this.packedField;
    }

    get userInputFlag(){
        return (this.packedField >> 1) & 1;
    }

    get transparentColorFlag(){
        return (this.packedField & 1);
    }

    // get delayTime(){
    //     return this.delayTime;
    // }

    // get transparentColorIndex(){
    //     return this.transparentColorIndex;
    // }

    // get blockTerminator(){
    //     return this.blockTerminator;
    // }

    get objectAsBuffer(){
        return Buffer.concat(
            [
                Buffer.alloc(1, this.extensionIntroducer),
                Buffer.alloc(1, this.graphicControlLabel),
                Buffer.alloc(1, this.byteSize),
                Buffer.alloc(1, this.packedField),
                this.delayTime,
                Buffer.alloc(1, this.transparentColorIndex),
                Buffer.alloc(1, this.blockTerminator)
            ]
        );
    }
}

module.exports = GraphicsControlExtension;