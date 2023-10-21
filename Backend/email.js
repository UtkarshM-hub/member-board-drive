import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const sendEmail = async (email, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: text,
        });
        console.log("Email Sent Sucessfully");
    } catch (error) {
        console.log("Email Not Sent");
        console.log(error);
    }
};

export default sendEmail;

