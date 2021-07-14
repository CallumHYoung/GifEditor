class ImageData{
    constructor(minimumCodeSize, blocks){
        this.minimumCodeSize = minimumCodeSize;
        this.blocks = blocks;
    }

    get objectAsBuffer(){
        var buffer = Buffer.alloc(1, this.minimumCodeSize);
        this.blocks.forEach((block) => {
            buffer = Buffer.concat([buffer, Buffer.alloc(1, block.size), block.values]);
        })
        return buffer;
    }

    toString(){
        var buffer = Buffer.alloc(1, this.minimumCodeSize);
        this.blocks.forEach((block) => {
            buffer = Buffer.concat([buffer, block]);
        })
        return buffer;
    }
}

module.exports = ImageData;