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


function getManuals(word) {
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

function getAllManuals(word) {
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

function createNgIndex() {
    let settings = {
        "analysis": {
            "tokenizer": {
                "my_ngram_tokenizer": {
                    "type": "nGram",
                    "min_gram": "2",
                    "max_gram": "3",
                    "token_chars": ["letter", "digit"]
                }
            },
            "analyzer": {
                "my_ngram_analyzer": {
                    "tokenizer": "my_ngram_tokenizer",
                    "type": "custom"
                }
            }
        }
    };
    let mapping = {
            "properties": {
                "title": {
                    "type": "string",
                    "term_vector": "yes",
                    "analyzer": "my_ngram_analyzer"
                }
            }
    };
    return client.indices.create({
        index: 'completeindexsix',
        body: {
            settings: settings,
            mappings: mapping
        }
    });
}

createNgIndex().then();


function insertManual(manual) {
    return new Promise(async (resolve, reject) => {
        try {
            try {
                const result = await client.create({
                    index: 'completeindexfive',
                    id : manual.id,
                    body: {
                        brand: manual.brand,
                        category: manual.category,
                        url: manual.url,
                        title: manual.title,
                        parsingData: new Date().toString()
                    }
                })
                await client.indices.refresh({index: 'completeindexfive'})
            } catch (e) {
                console.log("elasticsearch")
            }
            try {
                await addManual(manual);
            } catch (e) {
                console.log("mongodb")
            }
            resolve("ok");
        } catch (e) {
            reject(e);
        }
    })
}

function deleteByQueryMongo() {
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

function deleteByQuery() {
    return new Promise(async (resolve, reject) =>  {
        try {
            await deleteByQueryMongo();
            await client.deleteByQuery({
                index: 'completeindexfour',
                body: {
                    query: {
                        bool : {
                            must :{
                                term : { url : 'https://www.manualslib.comundefined' }
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
