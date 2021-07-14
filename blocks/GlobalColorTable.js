class GlobalColorTable{
    constructor(tableSize, byteBuffer){
        this.size = tableSize;
        this.values = byteBuffer;
    }

    // get values(){
    //     return this.values;
    // }

    get objectAsBuffer(){
        return this.values;
    }

    toString(){
        return this.values.toString();
    }
}

module.exports = GlobalColorTable;