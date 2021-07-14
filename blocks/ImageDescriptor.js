class ImageDescriptor{
    constructor(byteBuffer){
        this.imageSeperator = byteBuffer[0];
        this.imageLeft = byteBuffer.slice(1,3);
        this.imageTop = byteBuffer.slice(3,5);
        this.imageWidth = byteBuffer.slice(5,7);
        this.imageHeight = byteBuffer.slice(7,9);
        this.packedField = byteBuffer[9];
    }

    // get imageSeperator(){
    //     return this.imageSeperator;
    // }

    // get imageLeft(){
    //     return this.imageLeft;
    // }

    // get imageTop(){
    //     return this.imageTop;
    // }

    // get imageWidth(){
    //     return this.imageWidth;
    // }

    // get imageHeight(){
    //     return this.imageHeight;
    // }

    get localColorTableFlag(){
        return (this.packedField >> 7);
    }

    get interlaceFlag(){
        return ((this.packedField >> 6) & 1);
    }

    get sortFlag(){
        return ((this.packedField >> 5) & 1);
    }
    
    get localColorTableSize(){
        return (this.packedField & 7);
    }

    get objectAsBuffer(){
        return Buffer.concat(
            [
                Buffer.alloc(1, this.imageSeperator),
                Buffer.alloc(2, this.imageLeft),
                Buffer.alloc(2, this.imageTop),
                Buffer.alloc(2, this.imageWidth),
                Buffer.alloc(2, this.imageHeight),
                Buffer.alloc(1, this.packedField) 
            ]
        );
    }

    toString(){
        return Buffer.concat(
            [
                Buffer.alloc(1, this.imageSeperator),
                Buffer.alloc(2, this.imageLeft),
                Buffer.alloc(2, this.imageTop),
                Buffer.alloc(2, this.imageWidth),
                Buffer.alloc(2, this.imageHeight),
                Buffer.alloc(1, this.packedField) 
            ]
        ).toString();
    }
}

module.exports = ImageDescriptor;