let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/";

MongoClient.connect(url, (err, db) => {
    if (err) { throw err }
    console.log("Connected to database!!");
    let databaseName = db.db("sl-assessment")
    const parentRegistryCollection = databaseName.collection("parent-registry")
    parentRegistryCollection.find({}).toArray((err, parentRegistryDoc) => {
        if (err) throw err;
        let index = 0
        findAndUpdate(index)

        function findAndUpdate(index) {
            if (parentRegistryDoc[index]) {
                parentRegistryCollection.find({ _id: parentRegistryDoc[index]._id }).toArray((err, eachParentRegistryData) => {
                    if (err) throw err
                    if (!eachParentRegistryData) {
                        console.log("Id is not matched")
                        index++;
                        findAndUpdate(index)
                    }
                    else {
                        let findQuery = { _id: parentRegistryDoc[index]._id }
                        eachParentRegistryData['type'] = []
                        eachParentRegistryData.forEach(eachParent => {
                            eachParentRegistryData.type.push(eachParent.type)
                        })
                        let updateQuery = { $set: { type: eachParentRegistryData.type } }
                        parentRegistryCollection.updateOne(findQuery, updateQuery).then(() => {
                            index++;
                            findAndUpdate(index)
                            if (!parentRegistryDoc[index]) {
                                db.close()
                            }

                        })
                    }
                })
            }
        }
    })
})