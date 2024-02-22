import Email from '../utils/email';
import { fetchFormEmails } from '../utils/fetchFormEmails';

const sendEmail = async (req, res) => {
  try {
    // D4CR From Email

    const targetEmails = await fetchFormEmails();
    const fromEmail = `${process.env.EMAIL_FROM}}`;
    const url = 'https://d4cr.com';

    if (!req.body.target) {
      res.status(400).send({
        success: false,
        message: 'Missing or invalid required fields',
      });
    }

    // Contact us form
    if (req.body.target === 'contactus') {
      if (!req.body.name || !req.body.contactEmail || !req.body.message) {
        res.status(400).send({
          succuess: false,
          message: 'Missing or invalid required fields',
        });
      }

      const mailData = {
        targetEmail: targetEmails.contactEmail,
        name: req.body.name,
        contactEmail: req.body.contactEmail,
        message: req.body.message,
      };
      await new Email(fromEmail, mailData, url).sendContactUs();
    }

    // Join slack form
    if (req.body.target === 'joinslack') {
      if (
        !req.body.name ||
        !req.body.contactEmail ||
        !req.body.message ||
        !req.body.linkedIn
      ) {
        res.status(400).send({
          succuess: false,
          message: 'Missing or invalid required fields',
        });
      }

      const mailData = {
        targetEmail: targetEmails.joinSlackEmail,
        name: req.body.name,
        linkedIn: req.body.linkedIn,
        contactEmail: req.body.contactEmail,
        message: req.body.message,
      };
      await new Email(fromEmail, mailData, url).sendJoinSlack();
    }
    // Share your story form
    if (req.body.target === 'shareyourstory') {
      if (
        !req.body.name ||
        !req.body.contactEmail ||
        !req.body.message ||
        !req.body.linkedIn ||
        req.body.usingD4CRGuideAndPrinciples === null ||
        req.body.usingD4CRGuideAndPrinciples === undefined ||
        typeof req.body.usingD4CRGuideAndPrinciples !== 'boolean' ||
        req.body.logoFeaturedOnWebpage === null ||
        req.body.logoFeaturedOnWebpage === undefined ||
        typeof req.body.logoFeaturedOnWebpage !== 'boolean'
      ) {
        return res.status(400).send({
          succuess: false,
          message: 'Missing or invalid required fields',
        });
      }

      const mailData = {
        targetEmail: targetEmails.shareStoryEmail,
        name: req.body.name,
        linkedIn: req.body.linkedIn,
        contactEmail: req.body.contactEmail,
        message: req.body.message,
        usingD4CRGuideAndPrinciples: req.body.usingD4CRGuideAndPrinciples,
        logoFeaturedOnWebpage: req.body.logoFeaturedOnWebpage,
      };

      await new Email(fromEmail, mailData, url).sendShareStory();
    }

    res.status(200).send({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = sendEmail;
