const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "nandierruizacosta@gmail.com",
      clientId: "724751063745-r0hs4h93c6aoiseieds8o20bpt383b69.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken: "1//049QeJedYjJFaCgYIARAAGAQSNwF-L9Ir77JlSNCQSBBK4HCmZ3ZwTpBwtgQeoEWwLWSbhPeSsjWM09Htzy7sybwOmuJhMgn7BjE",
      accessToken: "ya29.A0ARrdaM-3ZnzmhogA4xgT7Vm1SfL5ApQTIksz66YF9p0z0cWTmLMymE2i4GyLgtmyCUrZ5iT0rpnEvBwzncFQVBImDu_t3yutwOm55IugHXVwMB9lNwAcOHGiqj27qTAgxRaBsHlQkFmiTgun7MCjr6SYc_e-YUNnWUtBVEFTQVRBU0ZRRl91NjFWSjZVSk5CaVk1cUxjRFpOcHdpQ2VEZw0163",
    },
  });

// generar HTML
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}
exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones );
    const text = htmlToText.fromString(html);
    let opcionesEmail = {
        from: 'UpTask <no-reply@uptask.com>',
        to: opciones.usuario.email, 
        subject: opciones.subject,
        text, 
        html
    };

    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail)
}

