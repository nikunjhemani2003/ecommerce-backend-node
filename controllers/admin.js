const Product = require('../models/product');


module.exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated:req.session.isLoggedIn,
    });
};

module.exports.postAddProduct = (req, res, next) => {
    const productTitle = req.body.title;
    const productPrice = req.body.price;
    const productImageUrl = req.body.imageUrl;
    const productDescription = req.body.description;
    const userId = req.session.user;

    const product=new Product({
        title:productTitle,
        description:productDescription,
        price:productPrice,
        imageUrl:productImageUrl,
        userId:userId
    });

    product.save()
    .then(result =>{
        console.log(result);
        console.log("Product Created!");
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err));

};

module.exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) return res.redirect('/');
    const productId = req.params.productId;
    
    Product.findById(productId)
    .then(product => {
        res.render('admin/edit-product', {
            pageTitle: product.title,
            path: '/admin/products',
            editing: editMode,
            product: product,
            isAuthenticated:req.session.isLoggedIn,
        });
    })
    .catch(err => console.log(err));
};

module.exports.postEditProduct = (req, res, next) => {
    const productId=req.body.id;
    const productTitle = req.body.title;
    const productPrice = req.body.price;
    const productImageUrl = req.body.imageUrl;
    const productDescription = req.body.description;

    Product.findById(productId)
    .then(product=>{
        product.title=productTitle,
        product.description=productDescription,
        product.price=productPrice,
        product.imageUrl=productImageUrl
        return product.save();
    })   
    .then(result => {
        console.log(result);
        console.log("Updated Product");
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

module.exports.getProducts = (req, res, next) => {

    Product.find({userId:req.session.user._id})
    .then(products => {
        res.render('admin/product-list', {
            pageTitle: 'All Products',
            path: '/admin/products',
            products: products,
            isAuthenticated:req.session.isLoggedIn,
        });
    })
    .catch(err=>console.log(err));
};

module.exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    
    Product
        .deleteOne({_id:productId})
        .then(result => {
            console.log("Deleted Product");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};