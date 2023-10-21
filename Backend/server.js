import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import connectMongoDB from './db.js';
import user from './user.js';
import sendEmail from './email.js';
import emailMessage from './emailMessage.js';
import moment from 'moment';
import { fileURLToPath } from "url";
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

connectMongoDB();

const app = express();
const port = 3000;

app.use('/Uploads', express.static(__dirname + '/uploads'));

// app.use(express.static(directoryToServe));

const corsOptions = {
    origin: "*",
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: function (_req, file, cb) {
        const extension = file.originalname.slice(-4);

        if (extension === ".pdf") {
            return cb(null, "./uploads/Resumes");
        } else {
            return cb(null, "./uploads/Photos");
        }
    }, filename: async function (req, file, cb) {
        const extension = file.originalname.slice(-4);

        console.log("File Uploaded");
        const date = moment().format('HH-mm-ss_D-M-YYYY');
        let profileURL = '';
        let resumeURL = '';

        const host = req.protocol + "://" + req.get('host') + "/Uploads/";

        if (extension === ".pdf") {
            const fileName = date + req.body['name'] + "-Resume.pdf";
            resumeURL = host + "Resumes/" + fileName.replace(/ /g, "_");
            await user.updateOne(
                { _id: req.body.id },
                { resumeURL: resumeURL },
            );
            return cb(null, fileName.replace(/ /g, "_"));
        } else {
            const fileName = date + req.body['name'] + "-Photo" + extension;
            profileURL = host + "Photos/" + fileName.replace(/ /g, "_");
            await user.updateOne(
                { _id: req.body.id },
                { profileURL: profileURL },
            );
            return cb(null, fileName.replace(/ /g, "_"));
        }
    }
});

const upload = multer({ storage });

app.get("/listOfUsers", async (req, res) => {
    const users = await user.find();
    res.send({ Users: users });
});

app.get("/count", async (req, res) => {
    const count = await user.find().count();
    res.send({ "No Of Users": count });
});

app.post("/createUser", async (req, res) => {
    // console.log(req.body);

    try {
        const existing = await user.findOne({ email: req.body.email });

        if (existing != null) {
            console.log("Email Already Registered");
            return res.status(403).send({
                success: "false",
                message: "Email Already Registered",
            });
        }

        let User = new user({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            branch: req.body.branch,
            reason: req.body.reason,
            yearOfStudy: "First Year",
        });

        const postdata = await User.save();
        // console.log(postdata._id.toString());

        try {
            sendEmail(User.email, "Your Registration was successfull!!", emailMessage());
        } catch (error) {
            console.log(error);
        }
        // console.log(postdata);
        return res
            .status(201)
            .json({
                success: true,
                message: "User Registered Successfully",
                id: postdata._id.toString(),
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Failed to submit!!! Try Again");
    }
});

app.post("/upload", upload.fields([{ name: 'photoUpload' }, { name: 'resumeUpload' }]), async (req, res) => {
    res.sendStatus(201);
});


app.listen(port, () => {
    console.log(`Server app listening at ${port}`)
});

app.get('/getPhotos', (req, res) => {
    var host = req.protocol + "://" + req.get('host') + "/";
    var contents = "";
    const directoryPath = 'uploads/Photos';

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        const filePaths = files.map((file) => {
            const filePath = path.join(directoryPath, file);
            const capitalizedString = filePath.replace(/\\/g, '/').charAt(0).toUpperCase() + filePath.replace(/\\/g, '/').slice(1);
            return host + capitalizedString;
        });
        console.log(filePaths.entries());
        res.send(filePaths + "<br>");
        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                const capitalizedString = filePath.replace(/\\/g, '/').charAt(0).toUpperCase() + filePath.replace(/\\/g, '/').slice(1);
                // console.log("http://localhost:3000/" + capitalizedString);
                contents = contents + host + capitalizedString + "<br>";
            }
        });
    });
});