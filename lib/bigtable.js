module.exports = BigTable;

function Dict(capacity){
    this.map = {};
    this.size = 0;
}
Dict.prototype = {
    requireInt(value){
        var v = this.map[value];
        if(v == null){
            v = this.size++;
            if(v > this.capacity){
                if(v-this.capacity < 10){
                    console.error('too many values: %s',value);
                }
                return -1;
            }
            return this.map[value] = v;
        }
        return v;
    }
}
/**
 * new BitTable('my table',1024,[["x","y"],"key1",])
 * @param name
 * @param maxSize
 * @param searchKeys
 * @constructor
 */
function BigTable(name,maxSize,searchKeys){
    var len = this.len = searchKeys.length+1;
    this.name = name;
    this.searchIndex
    this.searchKeys = searchKeys.map(a=>a instanceof Array?a:a.split(','));

    this.keyIndexes = new Dict(len);
    this.datas = new Array(len);
    this.timeLines = [];
    var i = len-1;
    while(i--){
        this.datas[i] = new Uint32Array(maxSize);
    }
}
BigTable.prototype = {
    addItem(data){
        this.datas.push(this.createItem(data));
    },
    search(example,callback){
        //console.log('search:',example,this.searchKeys)
        var query = this.createItem(example);
        query.pop();
        var i = query.length;
        var indexes =[];
        while(i--){
            var v = query[i];
            if(v!=null){
                indexes.push(i);
            }
        }
        //console.log(indexes,this.datas,query)
        var len = indexes.length;
        var result = [];
        outer:for(var data of this.datas){
            for(var i = len;i--;){
                var index = indexes[i];
                if(data[index] != query[index]){
                    continue outer;
                }
            }
            callback(data)
        }
        //return result;
    },
    createItem(data){
        var values = [];
        for(var key of this.searchKeys){
            var v = data[key];
            if(v == null){
                values.push(null)
            }else{
                if(typeof v != 'number' || v != (v|0)){
                    v = this.dict[v] || (this.dict[v] = this.dictSize++);
                }
                values.push(v)
            }
            delete data[key];

        }
        values.push(data);
        //console.log('createItem:',values)
        return values;
    }
}


