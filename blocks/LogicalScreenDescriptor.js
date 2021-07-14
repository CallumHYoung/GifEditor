class LogicalScreenDescriptor{
    constructor(byteBuffer){
        this.canvasWidth = byteBuffer.slice(0,2);
        this.canvasHeight = byteBuffer.slice(2,4);
        this.packedField = byteBuffer[4];
        this.bgColorIndex = byteBuffer[5];
        this.pixelAspectRatio = byteBuffer[6];
    }

    // get canvasWidth(){
    //     return this.canvasHeight;
    // }

    // get canvasHeight(){
    //     return this.canvasHeight;
    // }

    get globalColorTableFlag(){
        return (this.packedField >> 7);
    }

    get colorResolution(){
        return ((this.packedField >> 4) & 7);
    }

    get sortFlag(){
        return ((this.packedField >> 3) * 1);
    }

    get globalColorTableSize(){
        return (this.packedField & 7);
    }

    // get backgroundColorIndex(){
    //     return this.bgColorIndex;
    // }

    // get pixelAspectRatio(){
    //     return this.pixelAspectRatio;
    // }

    get objectAsBuffer(){
        return Buffer.concat(
            [
                this.canvasWidth,
                this.canvasHeight,
                Buffer.alloc(1, this.packedField),
                Buffer.alloc(1, this.bgColorIndex),
                Buffer.alloc(1, this.pixelAspectRatio)
            ]
        );
    }

    toString(){
        return Buffer.concat(
            [
                this.canvasWidth,
                this.canvasHeight,
                Buffer.alloc(1, this.packedField),
                Buffer.alloc(1, this.bgColorIndex),
                Buffer.alloc(1, this.pixelAspectRatio)
            ]
        ).toString();
    }
}

module.exports = LogicalScreenDescriptor;