const express = require('express');
const { validateActionBody } = require('../middleware');
const Actions = require('./actions-model'); // Adjust the path as necessary
const router = express.Router();

// [GET] /api/actions
router.get('/', (req, res) => {
  Actions.get()
    .then(actions => {
      res.json(actions);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error retrieving actions' });
    });
});

// [GET] /api/actions/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Actions.get(id)
    .then(action => {
      if (action) {
        res.json(action);
      } else {
        res.status(404).json({ message: 'Action not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Error retrieving the action' });
    });
});

// [POST] /api/actions
router.post('/', validateActionBody, (req, res) => {
  const { project_id, description, notes } = req.body;
  if (!project_id || !description || !notes) {
    res.status(400).json({ message: 'Missing required field(s)' });
    return;
  }
  Actions.insert({ project_id, description, notes })
    .then(newAction => {
      res.status(201).json(newAction);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error adding the action' });
    });
});

// [PUT] /api/actions/:id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { description, notes, completed, project_id } = req.body;
  
    if (description === undefined || notes === undefined || project_id === undefined) {
      return res.status(400).json({ message: 'Missing required field(s)' });
    }
  
    Actions.update(id, { description, notes, completed, project_id })
      .then(updatedAction => {
        if (updatedAction) {
          res.json(updatedAction);
        } else {
          res.status(404).json({ message: 'Action not found' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Error updating the action' });
      });
  });
  

// [DELETE] /api/actions/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Actions.remove(id)
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Action not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Error removing the action' });
    });
});

module.exports = router;
