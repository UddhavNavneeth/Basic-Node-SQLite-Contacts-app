const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

let app = express();
let port = 3000;

app.set('view engine', hbs);
app.use(bodyParser.urlencoded({extended: true}));

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'C:/sqlite/sqlite-tools-win32-x86-3280000/database.sqlite'
  });

const Model = Sequelize.Model;
class Contacts extends Model {}
Contacts.init({
  // attributes
  Name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  Mobile: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'contact'
  // options
});

sequelize.sync();


app.get('/', async (req, res) => {
  try {
    let docs = await Contacts.findAll()
        if (docs.length == 0) {
            return res.render('contactlist.hbs', {name: 'empty', mobile: 'empty'});
        }
        res.render('contactlist.hbs', {contact: docs});
  } catch(e) {
        res.send('error has occured while getting contact list');
    };
});

app.get('/add', (req, res) => {
    res.render('addContacts.hbs');
});

app.post('/add', (req, res) => {
    Contacts.create({ Name: req.body.name, Mobile: req.body.mobile }).then(() => {
       res.redirect('/');
    }).catch((e) => {
        res.send(e);
    });    
});

app.delete('/delete', (req, res) => {
    console.log(req.body);
    Contacts.destroy({
        where: {
          id: req.body.id
        }
      }).then(() => {
          res.render('index.hbs');
      }).catch((e) => {
          res.send(e);
      });
})

app.put('/update/:id', (req, res) => {

})

//-------ERROR----It is accepting mobile as string even though it is defined as integer or number
// Contacts.create({ Name: "Uddhav", Mobile: "Navneeth" }).then(uddhav => {
//     console.log("Uddhav's auto-generated ID:", uddhav.id);
// });

app.listen(port);
console.log(`Server is up on port 3000`);


