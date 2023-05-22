const router = require('express').Router();
const sequelize = require('sequelize');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    // grab all data with the product included
    const allCategories = await Category.findAll({include: Product});
    // send all categories
    res.status(200).json(allCategories);
  } catch (error) {res.status(500).json(error)}
});

router.get('/:id', async (req, res) => {
  try {
    // get the category by it's id and the associated products under it
    const atId = await Category.findByPk(req.params.id, {include: Product});
    // if there is nothing at the requested id
    if(!atId){res.status(404).json({message: "No category at this id!"}); return;}
    // send data
    res.status(200).json(atId);
  } catch (error) {res.status(500).json(error);}
});

router.post('/', async (req, res) => {
  try {
    // if the request is empty send error and return
    if (!req.body) {res.status(404).json({ message: 'The json you have sent is empty' }); return;}

    // create the new category based on the request and return json
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);

  } catch (error) {res.status(400).json(error);}
});

router.put('/:id', async (req, res) => {
  try {
    // look for the category at the requestd id IF it dosent exist throw error and return
    let findId = await Category.findByPk(req.params.id);
    if(!findId){res.status(404).json({message: 'There is no category at the id you have sent'}); return;}

    // update the body of where the requested id is
    Category.update(req.body, {where: {id:req.params.id}});
    res.status(200).json();

  } catch (error) {res.status(400).json(error);}

});

router.delete('/:id', async (req, res) => {
  try {
    // look for the category at the requestd id IF it dosent exist throw error and return
    let findId = await Category.findByPk(req.params.id);
    if(!findId){res.status(404).json({message: 'There is no category at the id you have sent'}); return;}

    // delete the category at the requested id
    let categories = await Category.destroy({where: {id: req.params.id}});

    // send json
    res.status(200).json(categories);

  } catch (error) {res.status(400).json(error);}
});

module.exports = router;
