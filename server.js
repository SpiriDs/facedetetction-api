const express = require('express');

const app = express();

app.listen(3000, () => {
    console.log('====================================');
    console.log('app is running on port 3000');
    console.log('====================================');
})