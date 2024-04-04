const validateRecaptcha = async (req, res) => {
  try {
    const { captchaValue } = req.body;

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${captchaValue}`,
      { method: 'POST' }
    );
    const data = await response.json();

    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default validateRecaptcha;
