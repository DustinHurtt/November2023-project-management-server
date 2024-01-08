var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

const Project = require('../models/Project')
const User = require('../models/User')

const isAuthenticated = require('../middleware/isAuthenticated')
const isOwner = require('../middleware/isOwner')

router.post('/', isAuthenticated, (req, res, next) => {

    const { title, description } = req.body

    Project.create(
        {
            title,
            description,
            owner: req.user._id,
            tasks: []
        }
    )
    .then((createdProject) => {
        console.log("New Project ==>", createdProject)
        res.json(createdProject)
    })
    .catch((err) => {
        console.log(err)
        res.json(err)
    })

})

router.get('/', (req, res, next) => {

    Project.find()
        .populate('tasks owner')
        .then((foundProjects) => {
            console.log("Found Projects ==>", foundProjects)
            res.json(foundProjects)
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
        })

})

router.get('/:projectId', (req, res, next) => {
    const { projectId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    // Each Project document has a `tasks` array holding `_id`s of Task documents
    // We use .populate() method to get swap the `_id`s for the actual Task documents
    Project.findById(projectId)
      .populate('tasks owner')
      .then(project => res.status(200).json(project))
      .catch(error => res.json(error));
  });
   
  // PUT  /api/:projectId  -  Updates a specific project by id
  router.put('/:projectId', isAuthenticated, isOwner, (req, res, next) => {
    const { projectId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    Project.findByIdAndUpdate(projectId, req.body, { new: true })
        .then((toPopulate) => toPopulate.populate('tasks'))
        .then(updatedProject => res.json(updatedProject))
        .catch(error => res.json(error));
  });
   
  // DELETE  /api/:projectId  -  Deletes a specific project by id
  router.delete('/:projectId', isAuthenticated, isOwner, (req, res, next) => {
    const { projectId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    Project.findByIdAndRemove(projectId)
      .then(() => res.json({ message: `Project with ${projectId} is removed successfully.` }))
      .catch(error => res.json(error));
  });

module.exports = router;