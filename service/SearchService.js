const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: 'http://localhost:9200'})
const manualSchema = require("../module/ManualSchema");

const addManual = (manual) => {
    return new Promise((resolve, reject) => {
        const newManual = new manualSchema({
            "brand" : manual.brand,
            "category" : manual.category,
            "url" : manual.url,
            "title" : manual.title,
            "parsingDate" : new Date().toString()
        })
        newManual.save((err) => {
            if (err) {
                reject(err)
            } else {
                resolve(newManual)
            }
        })
    })
}


async function getManuals(word) {
    return new Promise(async (resolve, reject) => {
        const result = await client.search({
            index: 'completeindexfour',
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
            index: 'completeindexfour',
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
            await addManual(manual);
            const result = await client.create({
                index: 'completeindexfour',
                id : manual.id,
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

async function deleteByQueryMongo() {
    return new Promise((resolve, reject) => {
        manualSchema.find({url : "https://www.manualslib.comundefined"})
            .remove()
            .exec((error, result) => {
                if (error) {
                    reject(error)
                }
                resolve(result);
            })
    })

}

async function deleteByQuery() {
    return new Promise(async (resolve, reject) =>  {
        try {
            await deleteByQueryMongo();
            await client.deleteByQuery({
                index: 'completeindexfour',
                body: {
                    query: {
                        bool : {
                            must :{
                                match: { url : 'https://www.manualslib.comundefined' }
                            }
                        }
                    }
                }
            }, function (error, response) {
                if (error) {
                    reject(error);
                }
                resolve(response)
            });
        } catch (e) {
            reject(e)
        }

    })
}

module.exports = {getManuals, getAllManuals, insertManual, deleteByQuery};
