const express = require('express');
const multer = require('multer');
const app = express();
const hbs = require('hbs');
const path = require('path');
const { BlobServiceClient} = require("@azure/storage-blob");
const dotenv = require('dotenv');

dotenv.config();
const port = process.env.PORT || 3000;
const viewsPath = path.join(__dirname, '/templates/views');
const partialsPath = path.join(__dirname, '/templates/component');

const sas = process.env.AZURE_BLOB_SAS_CONNECTION_STRING;
const account = process.env.ACCOUNT_NAME;
const containerName = process.env.CONTAINER_NAME;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net?${sas}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

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

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }else{
    try{  
    const blobName = req.file.originalname; 
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(req.file.buffer, req.file.size);
    res.status(200).send('File uploaded successfully');
    }catch(err){
      return res.status(500).send('Error uploading file');
    }
    
  }
});

app.get('/view', async (req, res) => {
  let images = [];
  let i = 1;
  const blobs = containerClient.listBlobsFlat();
  for await (const blob of blobs) {
    const blobUrl = `https://${account}.blob.core.windows.net/${containerName}/${blob.name}?${sas}`;
    images.push(blobUrl);
  }
  
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