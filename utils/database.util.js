const mongoDB = require('mongodb');
const MongoClient = mongoDB.MongoClient;

let _db;

exports.mongoConnect = (cb) => {
    MongoClient.connect('mongodb+srv://aditya:aditya97@cluster0-bu1cz.mongodb.net/shop?retryWrites=true',
     {useNewUrlParser: true}
     )
    .then(client => {
        console.log('Connected to Mongodb');
        _db = client.db();
        cb();
    })
    .catch(err => console.log('Couldnt connect', err));
};

exports.getDB = () => {
    if(_db) {
        return _db;
    } else {
        throw 'No database Found!'
    }
};

