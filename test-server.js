const express = require('express');
const app = express();
app.listen(5000, () => console.log('Test server running'));
setTimeout(() => console.log('Timeout fired'), 10000);
