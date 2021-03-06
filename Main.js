const express = require('express');
const cors = require('cors');
const app = express();
const searchRouter = require('./router/SearchRouter');

app.use(express.json());
app.use(cors());

app.use('/manual', searchRouter);

app.listen(8099)
