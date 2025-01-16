const Product = require('../models/product');
const Order = require('../models/order');
const User=require('../models/user');
const { use } = require('../routes/admin');
const { name } = require('ejs');
const { or } = require('sequelize');

module.exports.getIndex = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('shop/index', {
                pageTitle: 'Shop',
                path: '/',
                products: products,
                isAuthenticated:req.session.isLoggedIn,
            });
        })
        .catch(err => console.log(err));
};

module.exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'Products',
                path: '/products',
                products: products,
                isAuthenticated:req.session.isLoggedIn,
            });
        })
        .catch(err => console.log(err));
};

module.exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    console.log(productId);
    Product
        .findById(productId)
        .then(product => {
            res.render('shop/product-details', {
                pageTitle: product.title,
                path: '/products',
                product: product,
                isAuthenticated:req.session.isLoggedIn,
            });
        })
        .catch(err => console.log(err));
};

module.exports.getCart = (req, res, next) => {
    User.findById(req.session.user._id)
        .populate('cart.items.productId')
        .then(user => {
            const products=user.cart.items;
            console.log(products);
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products,
                isAuthenticated:req.session.isLoggedIn,
            });
        })
        .catch(err => console.log(err));
};

module.exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product=>{
        return req.user.addToCart(product);
    })
    .then(result=>{
        // console.log(result);
        console.log("Item added to Cart");
        res.redirect('/cart');
        
    })
    .catch(err=>console.log(err));
    
};

module.exports.postDeleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    return req.user.deleteCart(productId)
        .then(result => {
            console.log("Deleted Item from Cart");
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

module.exports.getOrders = (req, res, next) => {
    Order.find({'user.userId':req.session.user._id})
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Orders',
                path: '/orders',
                orders: orders,
                isAuthenticated:req.session.isLoggedIn,
            });
        })
        .catch(err => console.log(err));
};

module.exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            console.log(user.cart.items);
            console.log("object");
            const products=user.cart.items.map(i=>{
                return {quantity:i.quantity,product:{...i.productId._doc}};
            })
            console.log(products);
            const order=new Order({
                user:{
                    name:req.session.user.name,
                    userId:req.session.user._id
                },
                products:products,
            })
            return order.save();
        })
        .then(result => {
            req.user.cart={items:[]};
            req.user.save();
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};