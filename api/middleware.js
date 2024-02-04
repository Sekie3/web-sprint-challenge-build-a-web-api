const Projects = require('./projects/projects-model');

function validateProjectId(req, res, next) {
    const { id } = req.params;
    Projects.get(id)
      .then(project => {
        if (project) {
          req.project = project;
          next();
        } else {
          res.status(404).json({ message: 'Project not found' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Failed to retrieve project' });
      });
  }

  function validateActionBody(req, res, next) {
    const { project_id, description, notes } = req.body;
    if (!project_id || !description || !notes) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    next();
  }
  

module.exports = {
  validateProjectId,
  validateActionBody
};
