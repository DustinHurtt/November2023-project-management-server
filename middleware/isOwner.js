const Project = require('../models/Project')

const isOwner = (req, res, next) => {
    Project.findById(req.params.projectId)
        .then((foundProject) => {
            if (foundProject.owner.toString() === req.user._id) {
                next()
            } else {
                res.status(401).json({message: "You are not authorized to perform this operation"})
            }
        }) 
        .catch((err) => {
            console.log(err)
        })
}

module.exports = isOwner