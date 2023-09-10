const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const queryUrls = req.query.url;
  const remoteUrls = Array.isArray(queryUrls) ? queryUrls : [queryUrls];

  if (!remoteUrls || remoteUrls.length === 0) {
    return res.status(400).json({ error: 'No URLs provided in the query parameters' });
  }

  const uniqueNumbers = new Set();

  
  async function fetchData(url) {
    try {
      const response = await axios.get(url, { timeout: 500 });
      if (response.status === 200 && Array.isArray(response.data.numbers)) {
        response.data.numbers.forEach((num) => uniqueNumbers.add(num));
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
    }
  }

  for (const url of remoteUrls) {
    await fetchData(url);
  }


  const mergedNumbers = [...uniqueNumbers].sort((a, b) => a - b);

  res.json({ numbers: mergedNumbers });
});

app.listen(PORT, () => {
  console.log(`Main Server is running on port ${PORT}`);
});