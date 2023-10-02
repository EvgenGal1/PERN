// от ошб.повтор.объяв.перем в блоке
export {};

// раб.с почтой
const nodemailer = require("nodemailer");

// ! UTVJWT
class MailService {
  transporter: any;

  // ч/з констр.инициализ.почтовый клиент
  constructor() {
    // отправка писем на почту ч/з fn с опц.(host,port почт.сервера,`безопасный`,аунтетиф.)
    this.transporter = nodemailer.createTransport({
      //     service: "gmail",
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      // secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // `Отправить смс/действие на Почту`(email,ссылка)
  async sendActionMail(to, Link) {
    const message =
      "Привет, вы были отправлены мне по электронной почте через Nodemailer";

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
                  <h1>Для активации перейдите по ссылке</h1>
                  <a href="${Link}">${Link}</a>
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

    try {
      /* await */ this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: to,
        subject: "Активация акуанта на " + process.env.API_URL,
        text: message,
        html: HTML_TEMPLATE(message),
      });
    } catch (error) {
      throw new Error("Письмо не отправилось");
    }
  }
}

export default new MailService();
