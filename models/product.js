const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const productSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});

module.exports=mongoose.model('Product',productSchema);







// const getDb=require('../util/database').getDb;
// const mongodb = require('mongodb');
// const ObjectId = mongodb.ObjectId;

// class Product{
//     constructor(title,description,price,imageUrl,id,userId){
//         this.title=title;
//         this.description=description;
//         this.price=price;
//         this.imageUrl=imageUrl;
//         this._id= id?new ObjectId(id):null;
//         this.userId=userId
//     }
//     save(){
//         const db=getDb();
//         let dpOp;
//         if(this._id){
//             dpOp=db.collection('products')
//             .updateOne(
//                 {_id: new mongodb.ObjectId(this._id)},
//                 {$set:this}
//             )
//         }
//         else{
//             dpOp=db.collection('products').insertOne(this)
//         }
//         return dpOp.then((result) => {
//             console.log(result);
//         }).catch((err) => {
//             console.log(err);
//         });
//     }

//     static fetchAll(){
//         const db=getDb();

//         return db.collection('products')
//         .find({})
//         .toArray()
//         .then(result=>{
//             return result;
//         })
//         .catch(err=>console.log(err));
//     }

//     static fetch(id){
//         const db=getDb();

//         return db.collection('products')
//         .find({ _id: new ObjectId(id) })
//         .next()
//         .then(result=>{
//             console.log(result);
//             return result;
//         })
//         .catch(err=>console.log(err));
//     }
//     static deleteById(productId){
//         const db=getDb();
//         return db.collection('products').deleteOne({_id:new ObjectId(productId)})
//         .then(result=> console.log(result))
//         .catch(err=>console.log(err));
//     }

// };

// module.exports = Product;