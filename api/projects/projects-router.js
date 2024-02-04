const express = require('express');
const { validateProjectId } = require('../middleware');
const Projects = require('./projects-model'); // Adjust the path as necessary
const router = express.Router();

// [GET] /api/projects
router.get('/', (req, res) => {
  Projects.get()
    .then(projects => {
      res.json(projects);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error retrieving projects' });
    });
});

// [GET] /api/projects/:id
router.get('/:id', validateProjectId, (req, res) => {
  const { id } = req.params;
  Projects.get(id)
    .then(project => {
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Error retrieving the project' });
    });
});

// [POST] /api/projects
router.post('/', (req, res) => {
    const { name, description, completed } = req.body;
    if (!name || !description) {
      res.status(400).json({ message: 'Missing required name or description field' });
      return;
    }
  
    Projects.insert({ name, description, completed: completed ?? false })
      .then(newProject => {
        res.status(201).json(newProject);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error adding the project' });
      });
  });
  

// [PUT] /api/projects/:id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, completed } = req.body;
  
    if (name === undefined || description === undefined || completed === undefined) {
      res.status(400).json({ message: 'Missing required field(s)' });
      return;
    }
  
    Projects.update(id, { name, description, completed })
      .then(updatedProject => {
        if (updatedProject) {
          res.json(updatedProject);
        } else {
          res.status(404).json({ message: 'Project not found' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Error updating the project' });
      });
  });
  

// [DELETE] /api/projects/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Projects.remove(id)
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Error removing the project' });
    });
});

// [GET] /api/projects/:id/actions
router.get('/:id/actions', (req, res) => {
  const { id } = req.params;
  Projects.getProjectActions(id)
    .then(actions => {
      if (actions) {
        res.json(actions);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Error getting the project actions' });
    });
});

module.exports = router;
