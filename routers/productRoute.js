const { Product } = require("../Models/Product");
const express = require("express");
const { Category } = require("../Models/Category");
const router = express.Router();
const mongose = require("mongoose");



router.get('/', async (req, res) => {
  //http://localhost:3000/api/v1/product (Get All Products)

  //http://localhost:3000/api/v1/product?categories=6157186db5fed43b21262d9c,61572a1a3a0731249d2e912b
  //(Get All Products by category Id)


  let filter={}
  if(req.query.categories){
    filter = { category: req.query.categories.split(',')}
  }
  const product = await Product.find(filter).populate("category");
  if (!product) {
    res.status(404).json("Product Not Availabe");
  }
  res.status(201).json(product);
});

router.get("/:id", async (req, res) => {
    //when object id invalid mongose goes to hank thats why we use this
  if(!mongose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid Id");


  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(404).json("Product Not Availabe");
  }
  res.status(201).json(product);
});

router.post(``, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Catagory");
  const product = new Product({
    name: req.body.name,
    desciption: req.body.desciption,
    richDesc: req.body.richDesc,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    isFeatured: req.body.isFeatured,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(201).send(createdProduct);
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err.message });
    });
});

router.delete("/:id", (req, res) => {
    //when object id invalid mongose goes to hank thats why we use this
  if(!mongose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid Id");


  Product.findByIdAndRemove(req.params.id)
    .then(async () => {
      res.status(201).json({
        message: "Product delete sucesfull",
        Productinfo: await Product.find(),
      });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err.message });
    });
});

router.put("/:id", async (req, res) => {
    //when object id invalid mongose goes to hank thats why we use this
  if(!mongose.isValidObjectId(req.params.id)) return res.status(400).send("Invalid Id");

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Catagory");

  Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      desciption: req.body.desciption,
      richDesc: req.body.richDesc,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true,
    }
  )
    .then((createdProduct) => {
      res.status(201).send(createdProduct);
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err.message });
    });
});

//How many product in stock
router.get('/get/count', async (req, res) => {
  const product = await Product.countDocuments()
  if (!product) {
    res.status(404).json("Product Not Availabe");
  }
  res.status(201).send({productCount: product});
});

//Find by fetured product /get/feature (get all)
router.get('/get/featured', async (req, res) => {
   const product = await Product.find({isFeatured:true})
   if (!product) {
     res.status(404).json("Product Not Availabe");
   }
   res.status(201).send({featuredProduct: product});
 });


//if we show only 5 or 3 featured product then we use /get/featured/:count
router.get('/get/featured/:count', async (req, res) => {
 const count = req.params.count ? req.params.count : 0 ;

//this count is return string but limit() need number thats why convert to number by adding + sign
  const product = await Product.find({isFeatured:true}).limit(+count)
  if (!product) {
    res.status(404).json("Product Not Availabe");
  }
  res.status(201).send({featuredProduct: product});
});



module.exports = router;
