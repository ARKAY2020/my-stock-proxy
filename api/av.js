// यह Vercel, Netlify या Heroku जैसी सर्वरलेस सेवा के लिए Node.js बैकएंड का एक उदाहरण है।
const fetch = require('node-fetch');

// आपकी मुफ्त Alpha Vantage API Key यहाँ डालें
const ALPHA_VANTAGE_API_KEY = '9P20SXI7TR6BRS6Y';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // अनुरोध से URL पैरामीटर प्राप्त करें
  const { function: apiFunction, symbol, outputsize = 'full' } = req.query;

  // API URL सेट करें
  const url = `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${symbol}&outputsize=${outputsize}&apikey=${ALPHA_VANTAGE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API से डेटा लाने में त्रुटि:', error);
    res.status(500).json({ error: 'डेटा लाने में त्रुटि हुई। कृपया फिर से प्रयास करें।' });
  }
};