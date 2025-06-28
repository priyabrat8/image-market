const { log } = require('console');
const express = require('express');
const multer = require('multer');
const app = express();
const hbs = require('hbs');
const path = require('path');
const fs = require("fs");
// const dotenv = require('dotenv');

// dotenv.config();
const port = process.env.PORT || 3000;
const viewsPath = path.join(__dirname, '/templates/views');
const partialsPath = path.join(__dirname, '/templates/component');

const storage = multer.diskStorage({
  destination: function (req, image, cb) {
    cb(null, './public/images')
  },
  filename: function (req, image, cb) {
    const filename = Date.now() + '-' + image.fieldname;
    cb(null, filename );
  }
})

const upload = multer({ storage: storage })

// Set up view engine
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static('public'));



app.get('/', (req, res) => {
    res.render('index', {
        data: {
            title: "Upload Image"
        }
    });
});

app.post('/upload', upload.single('image'), (req, res) => {
    res.send('Image uploaded successfully');
});

app.get('/view', (req, res) => {
  let filenames = fs.readdirSync('./public/images');
  let images = [];
  filenames.forEach((file) => {
    images.push('/images/' + file);
  });
  res.render('viewImage', {
    data: {
      title: "View Image",
      images: images
    }
  })
});

app.get("/:any", (req, res) => {
    res.render('404', {
        data: {
            title: "404 Not Found"
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});