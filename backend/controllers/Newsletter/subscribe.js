const NewsletterSubscriber = require('../../models/newsletterSubscriber');
const CustomError = require('../../utils/customError');

module.exports = async (req, res) => {
  try {
    const { email, name, preferences, source } = req.body;
    if (!email) throw new CustomError('Email is required', 400);

    let subscriber = await NewsletterSubscriber.findOne({ email });
    if (subscriber) {
      if (subscriber.status === 'active') {
        return res.status(200).json({ status: true, message: 'Already subscribed.' });
      }
      subscriber.status = 'active';
      subscriber.name = name || subscriber.name;
      subscriber.preferences = preferences || subscriber.preferences;
      subscriber.source = source || subscriber.source;
      await subscriber.save();
      return res.status(200).json({ status: true, message: 'Subscription reactivated.' });
    }

    await NewsletterSubscriber.create({ email, name, preferences, source });
    return res.status(201).json({ status: true, message: 'Subscribed successfully.' });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ status: false, error: error.message });
  }
};
