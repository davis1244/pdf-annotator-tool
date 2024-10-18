// server.js

const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set up storage for uploaded PDFs and annotations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'annotations/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to save annotations
app.post('/save', upload.single('file'), (req, res) => {
    const annotations = req.body.annotations;
    const filePath = req.file.path;
    const annotationFile = filePath + '.json';

    fs.writeFile(annotationFile, annotations, (err) => {
        if(err) {
            console.error(err);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
