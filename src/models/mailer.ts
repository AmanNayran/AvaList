import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: { 
        user: "6d1cce0e6deb97", 
        pass: "fad2c2ac65cd2a" 
    }
})

module.exports = transport