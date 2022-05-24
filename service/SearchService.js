const {Client} = require('@elastic/elasticsearch');
const client = new Client({node : 'http://localhost:9200' })

async function getManuals(word) {
    return new Promise(async (resolve, reject) => {
        const result = await client.search({
            index: 'fullindextwo',
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
            index: 'fullindextwo',
            from: 0,
            size: 100,
            query :{
                match : {title : word}
            }
        });
        resolve(result.hits.hits);
    })
}

async function insertManual(manual) {
    return new Promise(async (resolve, reject) => {
        const result = await client.index({
            index : 'fullindextwo',
            body : {
                brand : manual.brand,
                category : manual.category,
                url : manual.url,
                title : manual.title
            }
        })
        await client.indices.refresh({index: 'fullindextwo'})
        resolve(result);
    })
}

module.exports = {getManuals, getAllManuals, insertManual};