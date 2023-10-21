import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/upload', (req, res) => {
    console.log(req.body);
    res.status(200).send('Form data received successfully.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
