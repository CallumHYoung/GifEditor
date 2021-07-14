class Image{
    constructor(imageDescriptor, imageData, localColorTable){
        this.descriptor = imageDescriptor;
        this.data = imageData;
        this.localColorTable = localColorTable;
    }

    // get descriptor(){
    //     return this.descriptor;
    // }

    // get data(){
    //     return this.imageData;
    // }

    get objectAsBuffer(){
        if(this.localColorTable){
            return Buffer.concat(
                [
                    this.descriptor.objectAsBuffer,
                    this.localColorTable.objectAsBuffer,
                    this.data.objectAsBuffer,
                    Buffer.alloc(1,0)
                ]
            );
        }
        return Buffer.concat(
            [
                this.descriptor.objectAsBuffer,
                this.data.objectAsBuffer,
                Buffer.alloc(1,0)
            ]
        );
    }
}

module.exports = Image;