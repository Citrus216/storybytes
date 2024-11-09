const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/files/*', (req, res) => {
  const filePath = req.params[0];
  const absolutePath = path.resolve(`temp/${filePath}`);

  fs.stat(absolutePath, (err, stats) => {
    if (err) {
      return res.status(404).send('File not found');
    }

    if (stats.isFile()) {
      res.sendFile(absolutePath);
    } else if (stats.isDirectory()) {
      fs.readdir(absolutePath, (err, files) => {
        if (err) {
          return res.status(500).send('Unable to read directory');
        }
        res.json(files);
      });
    } else {
      res.status(400).send('Path is neither a file nor a directory');
    }
  });
});

module.exports = router;
