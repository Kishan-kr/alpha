const NewsletterSubscriber = require('../../models/newsletterSubscriber');
const CustomError = require('../../utils/customError');

module.exports = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new CustomError('Email is required', 400);

    const subscriber = await NewsletterSubscriber.findOne({ email });
    if (!subscriber || subscriber.status === 'unsubscribed') {
      return res.status(200).json({ status: true, message: 'Already unsubscribed.' });
    }
    subscriber.status = 'unsubscribed';
    await subscriber.save();
    return res.status(200).json({ status: true, message: 'Unsubscribed successfully.' });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ status: false, error: error.message });
  }
};
