class Header {
    constructor(byteBuffer){
        this.gifLabel = byteBuffer.slice(0,3);
        this.version = byteBuffer.slice(3,6);
    }

    // get gifLabel(){
    //     return this.gifLabel;
    // }

    // set gifLabel(byteBuffer){
    //     this.gifLabel = byteBuffer;
    // }

    // get version(){
    //     return this.version;
    // }

    // set version(bytes){
    //     this.version = bytes;
    // }

    get objectAsBuffer(){
        return Buffer.concat([this.gifLabel, this.version]);
    }

    toString(){
        return Buffer.concat([this.gifLabel, this.version]);
    }
}
module.exports = Header;