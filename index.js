const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bodyParser = require('body-parser')
const app = express()
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' })
const db = new sqlite3.Database("./Chinook_Sqlite_AutoIncrementPKs.sqlite");
const Sequelize = require('sequelize');


app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.set('port', process.env.PORT || 3000)

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});



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

Artist.hasMany(Album)
Album.belongsTo(Artist)



// sequelize.query('`SELECT * FROM `artist`', {})


app.get('/album', (req, res) => {
  Album.findAll({
    include: [{
      model: Artist,
      where: {
        ArtistId: req.params['id']
      }
    }]
  })
})

// app.get('/album', (req, res) => {
//   Album.findAll({
//     include: [{
//       model: Artist,
//       required: false
//     }]
//   }).then(album => {
//       const routeObj = album.map(album => {
//         return Object.assign(
//           {},
//           {
//             AlbumId: Album.Id, 
//             Title: Album.Title,
//             Artist: album.artist.map(artist => {
//               return Object.assign(
//                 {},
//                 {
//                   ArtistId: Artist.Id, 
//                   Name: Artist.Name,                  
//                 }
//               )
//             })
//           }
//         )
//       })
//     res.json(resObj)
//   })
// })




app.use((req, res) => {
  res.status(400);
  res.render('404');
});


app.listen(3000, () => {
  console.log('server running')
})