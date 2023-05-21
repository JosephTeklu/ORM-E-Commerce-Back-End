const router = require('express').Router();
const sequelize = require('sequelize');
const { Category, Product, Tag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products

  try {
    // grab all data with the product included
    const allCategories = await Category.findAll({include: Product});
    // const allProducts = await Product.findAll();
    // send all categories
    res.status(200).json(allCategories);
  } catch (error) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
      // include: {model: Product} //{model: Product, key: 'id'}

  try {
    // get the produ
    const atId = Category.findByPk(req.params.id, {
      include: [{model: Product}],
      attributes:{
        include:[
          [
            sequelize.literal(`SELECT * FROM product WHERE product.category_id=${req.params.id}`),'products'
          ],
        ],
      },
    });
    // if there is nothing at the requested id
    if(!atId)res.status(404).json({message: "No location at this id!"})
    
    // send data
    res.status(200).json(atId);
  } catch (error) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
