const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: 'http://localhost:9200'})

async function getManuals(word) {
    return new Promise(async (resolve, reject) => {
        const result = await client.search({
            index: 'completeindexthree',
            from: 0,
            size: 30,
            query: {
                match: {title: word}
            }
        });
        resolve(result.hits.hits);
    })
}

async function getAllManuals(word) {
    return new Promise(async (resolve, reject) => {
        const result = await client.search({
            index: 'completeindexthree',
            from: 0,
            size: 500,
            query: {
                match: {title: word}
            }
        });
        resolve(result.hits.hits);
    })
}


async function insertManual(manual) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await client.create({
                index: 'completeindexfour',
                id : manual.title,
                body: {
                    brand: manual.brand,
                    category: manual.category,
                    url: manual.url,
                    title: manual.title,
                    parsingData: new Date().toString()
                }
            })
            await client.indices.refresh({index: 'completeindexfour'})
            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {getManuals, getAllManuals, insertManual};
