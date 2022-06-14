const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: 'http://localhost:9200'})
const manualSchema = require("../module/ManualSchema");

const addManual = (manual) => {
    return new Promise((resolve, reject) => {
        console.log(manual)
        console.log("lalallaa------------------------------")
        for (let i = 0; i < manual.length; i++) {
            const newManual = new manualSchema({
                "brand": manual[i].brand,
                "category": manual[i].category,
                "url": manual[i].url,
                "title": manual[i].title,
                "parsingDate": new Date().toString()
            })
            newManual.save((err) => {
                if (err) {
                    reject(err)
                }
            })
        }

        resolve("ok")

    })
}


function getManuals(word) {
    return new Promise(async (resolve, reject) => {
        const result = await client.search({
            index: 'completeindexfive',
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
            index: 'completeindexfive',
            from: 0,
            size: 500,
            query: {
                match: {title: word}
            }
        });
        resolve(result.hits.hits);
    })
}

function insertManual(manual) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("manual")
            console.log(manual)
            console.log("manual Data")
            console.log(manual.data)
            if (manual.data && Array.isArray(manual.data)) {
                try {
                    const operations = manual.data.flatMap(doc => [{
                        index: {
                            _index: 'complete-index',
                            _id: doc.id
                        }
                    }, doc])
                    const bulkResponse = await client.bulk({refresh: true, operations})
                } catch (e) {
                    console.log(e)
                    console.log("elastic")
                }

                try {
                    await addManual(manual.data);
                } catch (e) {
                    console.log("mongo")
                    console.log(e)
                }
                resolve("ok");

            } else {
                try {
                    const result = await client.create({
                        index: 'complete-index',
                        id: manual.id,
                        body: {
                            brand: manual.brand,
                            category: manual.category,
                            url: manual.url,
                            title: manual.title,
                            parsingData: new Date().toString()
                        }
                    })
                    await client.indices.refresh({index: 'complete-index'})
                } catch (e) {
                    console.log("elastic")
                    console.log(e)
                }
                try {
                    await addManual(manual);
                } catch (e) {
                    console.log("mongo")
                    console.log(e)
                }
                resolve("ok");
            }
        } catch (e) {
            reject(e);
        }
    })
}

function deleteByQueryMongo() {
    return new Promise((resolve, reject) => {
        manualSchema.find({url: "https://www.manualslib.comundefined"})
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
    return new Promise(async (resolve, reject) => {
        try {
            await deleteByQueryMongo();
            await client.deleteByQuery({
                index: 'completeindexfour',
                body: {
                    query: {
                        bool: {
                            must: {
                                term: {url: 'https://www.manualslib.comundefined'}
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
