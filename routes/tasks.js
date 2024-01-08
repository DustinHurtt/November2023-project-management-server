var express = require('express');
var router = express.Router();

const Task = require('../models/Task')
const Project = require('../models/Project')

const isAuthenticated = require('../middleware/isAuthenticated')
const isOwner = require('../middleware/isOwner')

router.post('/:projectId', isAuthenticated, isOwner, (req, res, next) => {

    const { title, description} = req.body

    Task.create(
        {
            title,
            description,
            project: req.params.projectId
        }
    )
    .then((createdTask) => {
        console.log("New Task ===>", createdTask)
        return Project.findByIdAndUpdate(
            req.params.projectId,
            {
                $push: { tasks: createdTask._id }
            },
            { new: true }
        )
    })
    .then((projectToPopulate) => {
        return projectToPopulate.populate('tasks')
    })
    .then((updatedProject) => {
        console.log("Project with new task ==>", updatedProject)
        res.json(updatedProject)
    })
    .catch((err) => {
        console.log(err)
        res.json(err)
    })

})

module.exports = router;