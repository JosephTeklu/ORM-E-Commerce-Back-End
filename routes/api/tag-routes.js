const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    // grad all data with the tags
    const allTags = await Tag.findAll({include: Product});
    // send data
    res.status(200).json(allTags);
  } catch (error) {res.status(500).json(error)}
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    // find the tag at the given id
    const atId = await Tag.findByPk(req.params.id, {include: Product})
    if(!atId){res.status(404).json({message: "No Tag at this id!"}); return;}
    // send data
    res.status(200).json(atId)
  } catch (error) {res.status(500).json(error);}
});

router.post('/', async (req, res) => {
  try {
    // check if reques is empty and send error and return
    if(!req.body){res.status(404).json({message: 'The json you have sent is empty'})}
    // create the new categroy based on the request and return the json
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (error) {res.status(500).json(error);}
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    // look for the tag at the requestd id IF it dosen't exist throw error
    let findId = await Tag.findByPk(req.params.id);
    if(!findId){res.status(404).json({message: 'There is no tag at the id you have sent'}); return;}

    // update the body at requested id
    Tag.update({tag_name: req.body.tag_name}, {where: {id:req.params.id}});
    res.status(200).json();
  } catch (error) {res.status(400).json(error)}
});

router.delete('/:id', async (req, res) => {
  try {
  // look for the tag at the requestd id IF it dosent exist throw error and return
  let findId = await Tag.findByPk(req.params.id);
  if(!findId){res.status(404).json({message: 'There is no tag at the id you have sent'}); return;}

  //  destroy the tag at the requested id and send json
  let tags = await Tag.destroy({where: {id: req.params.id}});
  res.status(200).json(tags);
  } catch (error) {res.status(400).json(error)}
});

module.exports = router;
