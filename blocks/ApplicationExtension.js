class ApplicationExtension{
    constructor(data){
        this.applicationBlockLength = data.applicationBlockLength;
        this.applicationBlock = data.applicationBlock;
        // console.log(data);
        this.subBlocks = data.subBlocks;
    }

    // get applicationBlockLength(){
    //     return this.applicationBlockLength;
    // }

    // get applicationBlock(){
    //     return this.applicationBlock;
    // }

    // get subBlocks(){
    //     return this.subBlocks;
    // }

    get objectAsBuffer(){
        
        var subBlocksBuffer = Buffer.alloc(0);

        this.subBlocks.forEach((moduleObject) => {
            subBlocksBuffer = Buffer.concat([subBlocksBuffer, Buffer.alloc(1, moduleObject.size), moduleObject.block]);
        });
        console.log("Sub blocks buffer");
        return Buffer.concat(
            [
                Buffer.alloc(1, 33),
                Buffer.alloc(1, 255),
                Buffer.alloc(1, this.applicationBlockLength),
                this.applicationBlock,
                subBlocksBuffer,
                Buffer.alloc(1, 0)
            ]
        );
    }
}

module.exports = ApplicationExtension;