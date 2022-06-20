const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: 'http://localhost:9200'})

function getManuals(word) {
    return new Promise(async (resolve, reject) => {
        const result = await client.search({
            index: 'complete-index',
            from: 0,
            size: 30,
            query: {
                match: {title: word}
            }
        });
        resolve(result.hits.hits);
    })
}

function getAllManuals(word) {
    return new Promise(async (resolve, reject) => {
        const result = await client.search({
            index: 'complete-index',
            from: 0,
            size: 500,
            query: {
                match: {title: word}
            }
        });
        resolve(result.hits.hits);
    })
}



module.exports = {getManuals, getAllManuals, insertManual};
