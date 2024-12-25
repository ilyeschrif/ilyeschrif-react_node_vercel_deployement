const express = require('express');
const app = express();

// Use the default route to respond
app.get("/server", (req, res) => {
    res.send("server is running!");
});

// Vercel requires the port to be dynamic, use the PORT environment variable
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running!');
});
