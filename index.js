const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const app = express()
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' })
const db = new sqlite3.Database("./Chinook_Sqlite_AutoIncrementPKs.sqlite");
const Sequelize = require('sequelize');
const router = express.Router();


app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.set('port', process.env.PORT || 3000)


var http = require('http');
var options = {method: 'HEAD', port: 3000, path: '/'};
var req = http.request(options, function(res) {
    console.log(JSON.stringify(res.headers));
  }
);
req.end();


const sequelize = new Sequelize('Music', 'tjb1272', null, {
  host: 'localhost',
  dialect: 'sqlite',
  storage: './Chinook_Sqlite_AutoIncrementPKs.sqlite'
});


const Artist = sequelize.define('Artist', {
  ArtistId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Name: Sequelize.STRING
},
{
freezeTableName: true,
timestamps: false
})


const Album = sequelize.define('Album', {
  ArtistId: {
    type: Sequelize.INTEGER,
    // autoIncrement: true,
    primaryKey: true
  },
  Title: Sequelize.STRING
},
{
freezeTableName: true,
timestamps: false
})


Artist.hasMany(Album, {foreignKey: 'ArtistId'})
Album.belongsTo(Artist, {foreignKey: 'ArtistId'})


// sequelize.query('`SELECT * FROM `artist`', {})


router.get('/album', (req, res) => {
  Album.findAll(combined, (req, row) => {
    include: [{
      model: Artist,
      where: {
        ArtistId: req.params['id']
      }
    }]
  })
  .then(Album => {
      if (err) throw err;
      console.log(row)
      res.render('home', {combined: row})
  })
})

app.use((req, res) => {
  res.status(400);
  res.render('404');
});


app.listen(3000, () => {
  console.log('server running')
})
