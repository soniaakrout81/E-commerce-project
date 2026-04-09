import nodemailer from "nodemailer";



export const sendEmail = async(options) => {

    const transporter = nodemailer.createTransport({

        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {

            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
            
        },
        tls: {rejectUnauthorized: false},

    });
    const mailOptions = {

        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message


    }
    await transporter.sendMail(mailOptions);

}