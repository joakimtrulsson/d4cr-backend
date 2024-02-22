import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';

// Skicka ett nytt email => new Email(user, url).sendWelcome .sendPasswordReset
module.exports = class Email {
  constructor(fromEmail, mailData, url) {
    (this.to = mailData.targetEmail),
      (this.name = mailData.name),
      (this.url = url),
      (this.contactEmail = mailData.contactEmail),
      (this.message = mailData.message),
      (this.linkedIn = mailData.linkedIn),
      (this.usingD4CRGuideAndPrinciples = mailData.usingD4CRGuideAndPrinciples),
      (this.logoFeaturedOnWebpage = mailData.logoFeaturedOnWebpage),
      (this.from = fromEmail);
    // this.from = `${process.env.EMAIL_FROM}}`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST_DEV,
      port: process.env.EMAIL_PORT_DEV,
      secure: false,
      // logger: true,
      auth: {
        user: process.env.EMAIL_USERNAME_DEV,
        pass: process.env.EMAIL_PASSWORD_DEV,
      },
    });
  }

  // Skickar mailet.
  async send(template, subject) {
    // Rendera html baserad på pug template. __dirname = nuvarande script som körs, utils.
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      name: this.name,
      contactEmail: this.contactEmail,
      linkedIn: this.linkedIn,
      message: this.message,
      url: this.url,
      usingD4CRGuideAndPrinciples: this.usingD4CRGuideAndPrinciples,
      logoFeaturedOnWebpage: this.logoFeaturedOnWebpage,
      subject,
    });
    // Definera emailOptions.
    const mailOptions = {
      from: this.from,
      // from: process.env.EMAIL_USERNAME,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }
  // Transport

  async sendContactUs() {
    // this  eftersom dom defineras på det akutella objektet.
    await this.send('contact', 'Someone used the contact form!');
  }
  async sendShareStory() {
    // this  eftersom dom defineras på det akutella objektet.
    await this.send('shareStory', 'Someone wants to share a story!');
  }
  async sendJoinSlack() {
    // this  eftersom dom defineras på det akutella objektet.
    await this.send('slack', 'Someone wants to join our Slack!');
  }
  async sendPasswordReset() {
    // this  eftersom dom defineras på det akutella objektet.
    await this.send('passwordReset', 'Lösenordåterställning, giltigt i 10 minuter.');
  }
};
