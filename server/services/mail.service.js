// подкл.конфиг.БД для записи получ.данн.в БД
const { pool } = require("../db");
const FileService = require("./file.service.js");

// раб.с почтой
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const SENDMAIL = async (mailDetails, callback) => {
  try {
    const info = await transporter.sendMail(mailDetails);
    callback(info);
  } catch (error) {
    console.log(error);
  }
};

const HTML_TEMPLATE = (text) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NodeMailer Email Template</title>
        <style>
          .container {
            width: 100%;
            height: 100%;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .email {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
          }
          .email-header {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .email-body {
            padding: 20px;
          }
          .email-footer {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email">
            <div class="email-header">
              <h1>EMAIL HEADER</h1>
            </div>
            <div class="email-body">
              <p>${text}</p>
            </div>
            <div class="email-footer">
              <p>EMAIL FOOTER</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

const message = "Hi there, you were emailed me through nodemailer";

const options = {
  from: "TESTING <evgengal.smtp@gmail.com>", // sender address
  // from: process.env.SMTP_USER, // sender address
  // to: "someone@gmail.com", // receiver email
  // to: "evgenauth@gmail.com", // receiver email
  to: "evgengalauth@yandex.ru", // receiver email
  subject: "Активация акуанта на " /* + process.env.API_URL */, // Subject line
  text: message,
  html: HTML_TEMPLATE(message),
};

SENDMAIL(options, (info) => {
  console.log("Email sent successfully");
  console.log("MESSAGE ID: ", info.messageId);
});

// evgengalauth - smtp-psw_YA_0 - evgengalauth@yandex.ru

class MailService {
  // ч/з констр.инициализ.почтовый клиент
  // constructor() {
  //   // отправка писем на почту ч/з fn с опц.(host,port почт.сервера,`безопасный`,аунтетиф.)
  //   this.transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     host: process.env.SMTP_HOST,
  //     port: process.env.SMTP_PORT,
  //     secure: false,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASSWORD,
  //     },
  //   });
  // }

  //  --------------------------------------------------------

  // `Отправить смс/действие на Почту`(email,ссылка)
  async sendActionMail(to, Link) {
    // вызов у trnsp fn `Отправить письмо` с парам.объ.(от кого письмо,кому,тема + url сайта,текст,свёрнутый html с ссылкой активации)
    // await this.transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to,
    //   subject: "Активация акуанта на " + process.env.API_URL,
    //   text: "",
    //   html: `
    //         <div>
    //           <h1>Для активации перейдите по ссылке</h1>
    //           <a href="${Link}">${Link}</a>
    //         </div>
    //       `,
    // });
  }
}

module.exports = new MailService();
