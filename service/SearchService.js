const {Client} = require('@elastic/elasticsearch');
const client = new Client({node : 'http://localhost:9200' })

async function getManuals(word) {
    return new Promise(async (resolve, reject) => {
        const result = await client.search({
            index: 'fullindex',
            from: 0,
            size: 30,
            query :{
                match : {title : word}
            }
        });
        resolve(result.hits.hits);
    })
}

async function getAllManuals(word) {
    return new Promise(async (resolve, reject) => {
        const result = await client.search({
            index: 'fullindex',
            from: 0,
            size: 100,
            query :{
                match : {title : word}
            }
        });
        resolve(result.hits.hits);
    })
}

module.exports = {getManuals, getAllManuals};
