const {Client} = require('pg')

const client = new Client({
    user: "postgres",
    password:"pacheco09",
    host: "localhost",
    port: 5432,
    database: "Coleta"
})

client.promise = client.connect()
    .then(() => console.log('It is alive'))
    .then(() => client.query(('select * from tweets_schema.login')))
    .then(results => console.table(results.rows))
    .then(() => client.query('select * from tweets_schema.evaluation'))
    .then(results => console.table(results.rows))
    .then(() => client.query('select * from tweets_schema.labeling'))
    .then(results => console.table(results.rows))

client.promise.catch(e => console.log(e))

module.exports = client;