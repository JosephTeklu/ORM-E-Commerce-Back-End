const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // grab all products including the categories and tags
  try {
    const allProducts = await Product.findAll({include: [Category, Tag]});
    res.status(200).json(allProducts);
  } catch (error) {res.status(500).json(error)}

});

// get one product
router.get('/:id', async (req, res) => {
  try {
    // find the product at the requested id
    const atId = await Product.findByPk(req.params.id, {include: [Category, Tag]});
    // if a product does not exist at the given id send error and return
    if(!atId) {res.status(404).json({message: "No Product at this id!"}); return;}
    // send data
    res.status(200).json(atId);
  } catch (error) {res.status(500).json(error)}
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    console.log(req.body)
    const newProduct = await Product.create(req.body)
    console.log(newProduct);
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      const newProductTags = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(200).json(newProductTags);
    }
      // if no product tags, just respond
      res.status(200).json(product);
  } catch (error) {
    if (error)res.status(200).json(req.body);
  }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(200).json(req.body);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    // check if the given id exists
    let findId = await Product.findByPk(req.params.id);
    if(!findId) {res.status(404).json({message: 'There is no product in the id you send'})}

    // delete the product at the given id
    let products = await Product.destroy({where:{id: req.params.id}});
    // send json
    res.status(200).json(products);
  } catch (error) {res.status(400).json(error);}

});

module.exports = router;
