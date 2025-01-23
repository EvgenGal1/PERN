// от ошб.повтор.объяв.перем в блоке
export {};

// serv.раб.с почтой
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { MailOptions } from '../types/mail.interface';
import ApiError from '../middleware/errors/ApiError';

// ! врем.откл.в UserService > ошб. - Invalid login: 535-5.7.8 Username and Password not accepted | 535 5.7.8 Error: authentication failed: Invalid user or password
class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  // ч/з констр.инициализ.почтовый клиент
  constructor() {
    // проверка перем.окруж.
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_APP_PSW,
      SMTP_SERVICE,
      SMTP_SECURE,
    } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_APP_PSW) {
      throw new Error(
        'Почтовая конфигурация отсутствует. Проверьте переменные окружения.',
      );
    }

    // Инициализация почтового клиента
    // отправка писем на почту ч/з fn с опц.
    // Инициализация SMTP-транспортера
    this.transporter = nodemailer.createTransport({
      // ^ host - почт.сервис отправки, port - порт почт.сервис, service - почт.сервис обраб., secure`безопасный` для SSL, аунтетиф. - объ.со св-ми)
      // ! здесь ошибка - Ни одна перегрузка не соответствует этому вызову. Последняя перегрузка возвратила следующую ошибку. Объектный литерал может использовать только известные свойства. "host" не существует в типе "TransportOptions | Transport<unknown, TransportOptions>".ts(2769) index.d.ts(70, 17): Здесь объявлена последняя перегрузка.
      host: SMTP_HOST,
      port: +SMTP_PORT,
      secure: SMTP_SECURE === 'true', // конверт.в boolean. Используйте true для портов TLS/SSL(465)
      auth: {
        user: SMTP_USER,
        pass: SMTP_APP_PSW,
      },
    });
  }

  // основ.мтд.отправки писем
  private async sendMail(options: MailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        // ^ from - адр.Отправителя, to - email Получателей, subject - тема смс, text - тескт смс, html - текст в HTML, attachments - файлы
        from: `"EvGen Gal" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
    } catch (error: unknown) {
      throw ApiError.internal(
        `Ошибка отправки письма: ${(error as Error).message}`,
      );
    }
  }

  // отправка письма для активации акка по ссылке
  async sendActionMail(email: string, activationLink: string): Promise<void> {
    const text =
      'Привет, вы были отправлены мне по электронной почте через Nodemailer';
    const subject = 'Активация аккаунта';
    const html = this.generateHtmlTemplate(
      'Активируйте ваш аккаунт',
      `Для активации перейдите по ссылке: <a href="${activationLink}">${activationLink}</a>`,
    );
    await this.sendMail({ to: email, subject, text, html });
  }

  // отправка письма для сброса/обновления пароля
  async sendPasswordResetEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    const subject = 'Сброс пароля';
    const html = this.generateHtmlTemplate(
      'Сбросьте ваш пароль',
      `Для сброса пароля перейдите по ссылке: <a href="${resetLink}">${resetLink}</a>`,
    );
    await this.sendMail({ to: email, subject, html });
  }

  // генер.HTML-шаблона письма
  private generateHtmlTemplate(title: string, body: string): string {
    return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                background: #fff;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
              }
              h1 {
                color: #333;
              }
              p {
                color: #555;
              }
              a {
                color: #007bff;
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${title}</h1>
              <p>${body}</p>
            </div>
          </body>
        </html>
      `;
  }
}

export default new MailService();
