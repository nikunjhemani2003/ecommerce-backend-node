const mongodb=require('mongodb');

const MongoClient=mongodb.MongoClient;

let _db;

const MongoConnect=(callback)=>{
    MongoClient.connect("mongodb+srv://nikunjhemani2424:GjjG8zblahI3oa7G@cluster0.2j1iv.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0")
    .then(client=> {
        console.log("Connected");
        _db=client.db();
        callback();
    })
    .catch(err=> {
        console.log(err)
        throw err;
    });
}

const getDb=()=>{
    if(_db){
        return _db;
    }
    throw "No database found! ";
}

module.exports.MongoConnect=MongoConnect;
exports.getDb=getDb;
