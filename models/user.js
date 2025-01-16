const mongoose=require('mongoose');
const product = require('./product');
const Order=require('./order');

const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cart:{
        items:[ 
            { 
                productId:{type:Schema.Types.ObjectId,ref:'Product',required:true},
                quantity:{type:Number, required:true} 
            }
        ]
    },
});

userSchema.methods.addToCart=function(product){
    const cartProductIndex=this.cart.items.findIndex(cp=>{
        return cp.productId.toString() === product._id.toString();
    })
    let newQuantity=1;
    const updatedCartItems=[...this.cart.items];
    if(cartProductIndex>=0){
        newQuantity+=this.cart.items[cartProductIndex].quantity;
        updatedCartItems[cartProductIndex].quantity=newQuantity;
    }
    else{
        let newPod={productId:product._id,quantity:1};
        updatedCartItems.push(newPod);
    }
    const updatedCart = { items: updatedCartItems };
    this.cart=updatedCart;
    // console.log(this.cart);
    return this.save()
    .then(result=>{
        return result;
    })
    .catch(err=>console.log(err))
}
userSchema.methods.deleteCart=function(productId){
        const exitingCart=[...this.cart.items];
        const updatedCart = exitingCart.filter(i => i.productId.toString() !== productId.toString());
        this.cart={items:updatedCart};
        return this.save()
        .then(result=>{
            return result;
        })
        .catch(err=>console.log(err));
}


module.exports=mongoose.model('User',userSchema);

// const getDb=require('../util/database').getDb;
// const mongodb = require('mongodb');
// const { get, use } = require('../routes/admin');
// const ObjectId = mongodb.ObjectId;


// class User{
//     constructor(name, email, cart, id,order) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart ? cart : { items: [] }; 
//         this._id = id ? new ObjectId(id) : null;
//         this.order=order? order: {orders:[]};
//     }
    

//     save(){
//         const db=getDb();
//         return db.collection('users')
//         .insertOne(this)
//         .then((result) => {
//             console.log("Inserted User!");
//             return result;    
            
//         }).catch((err) => {
//             console.log(err);
//         });
//     }

//     getCart(){
//         const db=getDb();
//         const productIds=this.cart.items.map(i=>{
//             return i.productId;
//         })
//         // console.log(productIds);
//         return db.collection('products')
//         .find({_id:{$in: productIds}})
//         .toArray()
//         .then(products=>{
//             // console.log(products);
//             return products.map(p=>{
//                 return {...p,quantity: this.cart.items.find(i=>{
//                     return i.productId.toString()==p._id.toString();
//                 }).quantity}
//             })
//         })
//         .then(products=>{
//             console.log(products);
//             return products;
//         })
//         .catch(err=>console.log(err));
//     }

//     addToCart(product){
//         const cartProductIndex=this.cart.items.findIndex(cp=>{
//             return cp.productId.toString() === product._id.toString();

//         })

//         const db=getDb();
//         let newQuantity=1;
//         const updatedCartItems=[...this.cart.items];
//         if(cartProductIndex>=0){
//             newQuantity+=this.cart.items[cartProductIndex].quantity;
//             updatedCartItems[cartProductIndex].quantity=newQuantity;
//         }
//         else{
//             let newPod={productId:product._id,quantity:1};
//             updatedCartItems.push(newPod);
//         }
//         const updatedCart = { items: updatedCartItems };
//         return db.collection('users')
//         .updateOne(
//             {_id: this._id},
//             {$set:{cart:updatedCart}}
//         )
//         .then(result=>{
//             return result;
//         })
//         .catch(err=>console.log(err))
//     }

//     deleteCart(productId){
//         const db=getDb();
//         const exitingCart=[...this.cart.items];
//         const updatedCart = exitingCart
//         .filter(i => i.productId.toString() !== productId.toString());
//         return db.collection('users').updateOne(
//             {_id:this._id},
//             {$set:{cart:{items:updatedCart}}}
//         )
//         .then(result=>{
//             console.log(result);
//             return result;
//         })
//         .catch(err=>console.log(err));
//     }

//     addOrder(){
//         const db=getDb();
//         return this.getCart()
//         .then(products=>{
//             const order={
//                 items:products,
//                 user:{
//                     _id:this._id,
//                     name:this.name,
//                 }
//             }
//             return db.collection('orders')
//             .insertOne(order);
//         })
//         .then(result=>{
//             this.cart.items=[];
//             const existingOrder=[...this.order.orders];
//             console.log('object');
//             existingOrder.push(result.insertedId);
//             return db.collection('users').updateOne(
//                 {_id:this._id},
//                 {$set:{cart:{items:[]},order:{orders:existingOrder}}}
//             )
            
//         })
//         .catch(err=>console.log(err))
        
        
//     }
//     getOrders(){
//         const db=getDb();
//         return db.collection('orders').find({_id: { $in: this.order.orders } })
//         .toArray()
//         .then(result=>{
//             // console.log(result);
//             return result;
//         })
//         .catch(err=>console.log(err));
//     }

//     static findById(userId){
//         const db=getDb();
//         return db.collection('users')
//         .find({_id: new ObjectId(userId)})
//         .next()
//         .then((result) => {
//             return result;    
//         }).catch((err) => {
//             console.log(err);
//         });
//     }

// };
// module.exports = User;