// ✅ Production-Ready emailService.js
import emailjs from '@emailjs/browser';

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const initEmailJS = () => {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  if (!publicKey) {
    console.error('EmailJS public key is missing.');
    throw new Error('EmailJS public key is not configured');
  }
  emailjs.init(publicKey);
};

const sendEmail = async (templateParams, templateId) => {
  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    if (!serviceId) {
      console.error('EmailJS service ID is missing.');
      throw new Error('EmailJS service ID is not configured');
    }

    if (!templateId) {
      console.error('EmailJS template ID is missing.');
      throw new Error('EmailJS template ID is not configured');
    }

    if (!isValidEmail(templateParams.to_email)) {
      console.error('Invalid email:', templateParams.to_email);
      throw new Error('Invalid recipient email address');
    }

    const response = await emailjs.send(serviceId, templateId, templateParams);
    console.log('Email sent:', response);
    return { success: true, message: 'Email sent successfully', data: response };
  } catch (error) {
    const message = error?.text || error?.message || JSON.stringify(error);
    console.error("Email send error:", message);
    return {
      success: false,
      message,
      error
    };
  }
};

export const sendApprovalEmail = async (email, campaignTitle, campaignId) => {
  initEmailJS();

  const templateParams = {
    to_email: email,
    user_email: email,
    campaign_title: campaignTitle,
    campaign_url: `${process.env.NEXT_PUBLIC_BASE_URL}/campaigns/${campaignId}`,
    dashboard_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    reply_to: 'dapp.crowdfund@gmail.com'
  };

  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_APPROVAL;
  return await sendEmail(templateParams, templateId);
};

export const sendRejectionEmail = async (email, campaignTitle, rejectionReason) => {
  initEmailJS();

  const templateParams = {
    to_email: email,
    user_email: email,
    campaign_title: campaignTitle,
    rejection_reason: rejectionReason,
    support_url: `${process.env.NEXT_PUBLIC_BASE_URL}/about-us`,
    reply_to: 'dapp.crowdfund@gmail.com'
  };

  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_REJECTION;
  return await sendEmail(templateParams, templateId);
};
