const express = require('express');
const {Client} = require('@elastic/elasticsearch');
const client = new Client({node : 'http://localhost:9200' })
const cors = require('cors');
const app = express();
const searchRouter = require('./router/SearchRouter');

client.indices.create({
    index: "manualsfullindextwo",
    body: {
        "mappings": {
            "aType": {
                "properties": {
                    "brand": {"type": "string", "index": "not_analyzed"},
                    "category": {"type": "string", "index": "not_analyzed"},
                    "url": {"type": "string", "index": "not_analyzed"},
                    "title": {"type": "string", "index": "not_analyzed", unique: true}
                }
            }
        }
    }
}, function (err, resp, respcode) {
    console.log(err, resp, respcode);
}).then() ;

app.use(express.json());
app.use(cors());

app.use('/manual', searchRouter);

app.listen(8099)
