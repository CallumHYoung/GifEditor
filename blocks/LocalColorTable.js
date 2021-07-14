class LocalColorTable{
    constructor(tableSize, byteBuffer){
        this.size = tableSize;
        this.values = byteBuffer;
    }

    get objectAsBuffer(){
        return this.values;
    }
}

module.exports = LocalColorTable;