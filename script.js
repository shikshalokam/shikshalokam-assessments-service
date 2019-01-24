let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/sl-assessment";

MongoClient.connect(url, function (err, db) {
    let dbo = db.db("sl-assessment");
    const parentRegistryCollection = dbo.collection("parent-registry")
    parentRegistryCollection.find({}).project({ type: 1 }).toArray((err, parentRegistryData) => {
        parentRegistryData.forEach(eachParent => {
            let findQuery = { _id: eachParent._id }
            let updateQuery = { $set: { type: [eachParent.type] } }
            parentRegistryCollection.updateOne(findQuery, updateQuery).then(() => {
                console.log("updated successfully")
            })
        })
    })
});