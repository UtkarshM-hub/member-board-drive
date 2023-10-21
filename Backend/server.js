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

dotenv.config();

connectMongoDB();



const app = express();
const port = 3000;

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
    }, filename: function (req, file, cb) {
        const extension = file.originalname.slice(-4);

        console.log("File Uploaded");
        const date = moment().format(' HH-mm-ss_D-M-YYYY,') + " ";

        if (extension === ".pdf") {
            return cb(null, date + req.body['name'] + " - Resume.pdf");
        } else {
            return cb(null, date + req.body['name'] + " - Photo" + extension);
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
    console.log(req.body);

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
                postdata,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Failed to submit!!! Try Again");
    }
});

app.post("/upload", upload.fields([{ name: 'photoUpload' }, { name: 'resumeUpload' }]), (req, res) => {
    console.log(req.body);
    res.sendStatus(201);
});


app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});