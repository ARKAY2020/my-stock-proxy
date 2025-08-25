// यह Vercel, Netlify या Heroku जैसी सर्वरलेस सेवा के लिए Node.js बैकएंड का एक उदाहरण है।
const fetch = require('node-fetch');

// आपकी मुफ्त Alpha Vantage API Key यहाँ डालें
const ALPHA_VANTAGE_API_KEY = '9P20SXI7TR6BRS6Y';

module.exports = async (req, res) => {
  // CORS हेडर सेट करें ताकि किसी भी डोमेन से अनुरोध स्वीकार किया जा सके
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  // प्री-फ़्लाइट अनुरोधों को संभालें
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // अनुरोध से URL पैरामीटर प्राप्त करें
  const { function: apiFunction, symbol, outputsize = 'full' } = req.query;

  // सुनिश्चित करें कि आवश्यक पैरामीटर मौजूद हैं
  if (!apiFunction || !symbol) {
    return res.status(400).json({ error: 'आवश्यक पैरामीटर (function, symbol) गायब हैं।' });
  }

  // API URL सेट करें
  const url = `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${symbol}&outputsize=${outputsize}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  console.log(`API को प्रॉक्सी कर रहा है: ${url}`);

  try {
    const response = await fetch(url);
    const data = await await response.json();

    // Alpha Vantage API से एरर प्रतिक्रिया की जाँच करें
    if (data["Error Message"]) {
      console.error('Alpha Vantage API एरर:', data["Error Message"]);
      return res.status(400).json({ error: data["Error Message"] });
    }
    if (data["Note"]) {
      console.log('Alpha Vantage API नोट:', data["Note"]);
      // यह एक दर सीमा का एरर है, इसलिए 429 स्टेटस कोड भेजें
      return res.status(429).json({ error: data["Note"] });
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('API से डेटा लाने में त्रुटि:', error);
    res.status(500).json({ error: 'डेटा लाने में त्रुटि हुई। कृपया फिर से प्रयास करें।' });
  }
  
};

// यह एक बहुत ही सरल प्रॉक्सी है जो CORS हेडर के साथ "Hello World" लौटाता है।
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.status(200).send('Hello World from Vercel Proxy!');
};

