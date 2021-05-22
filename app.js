require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin = require(__dirname + "/models/admin.js");
const Customer = require(__dirname + "/models/customer.js");
const Shipper = require(__dirname + "/models/delivery_person.js");
const Order = require(__dirname + "/models/order.js");
const Catelogue = require(__dirname + "/models/Items.js");

const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/orderDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});



mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to mongodb://localhost:27017/storeDB');
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.log('Mongoose default connection error: ' + err);
});
// When the connection is disconnected

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});

app.post("/catalogue/add", function(req, res) {
  ///Adding items into catelogue
  const name = req.body.name;
  const category = req.body.category;
  const addresses = req.body.addresses;

  const catelogue = new Catelogue({
    name: name,
    category: category,
    addresses: addresses
  });
  catelogue.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Item Added");
    }
  });
})



//deliveryPerson
app.get("/shipper/login", function(req, res) {
  const mobile = req.body.mobile;
  const password = req.body.password;
  Shipper.findOne({
    mobile: mobile
  }, function(err, foundShipper) {
    if (err) {
      console.log(err);
    } else {
      if (foundShipper) {
        bcrypt.compare(password, foundShipper.password, function(err, result) {
          if (result === true) {
            res.send("Successfully LoggedIn!");
          } else {
            res.send("Invalid Credentials");
          }
        })
      } else {
        res.send("Invalid Credentials");
      }
    }
  });
});

app.post("/shipper/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    const newShipper = new Shipper({
      mobile: req.body.mobile,
      password: hash
    });
    Shipper.findOne({
      mobile: req.body.mobile
    }, function(err, foundShipper) {
      if (foundShipper) {
        res.send("That deliveryPerson already exists");
      } else {
        newShipper.save(function(err) {
          if (err) {
            res.send(err);
            res.send("Invalid Credentials");
          } else {
            res.send(newShipper);
          }
        })
      }
    })

  })

});

/*Customer LOGIN AND RESITRATION*/
app.get("/customer/login", function(req, res) {
  const mobile = req.body.mobile;
  const password = req.body.password;
  Customer.findOne({
    mobile: mobile
  }, function(err, foundCustomer) {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      if (foundCustomer) {
        bcrypt.compare(password, foundCustomer.password, function(err, result) {
          if (result === true) {
            res.send("Successfully LoggedIn!");
          } else {
            res.send("Invalid Credentials");
          }
        })
      } else {
        res.send("Invalid Credentials");
      }
    }
  });
});

app.post("/customer/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    const newCustomer = new Customer({
      mobile: req.body.mobile,
      password: hash
    });
    Customer.findOne({
      mobile: req.body.mobile
    }, function(err, foundCustomer) {
      if (foundCustomer) {
        res.send("That customer already exists");
      } else {
        newCustomer.save(function(err) {
          if (err) {
            res.send("Invalid Credentials");
          } else {
            res.send(newCustomer);
          }
        })
      }
    })

  })

});


//Order
app.post("/customer/order", function(req, res) {
  const mobile = req.body.mobile;
  const password = req.body.password;
  //Validating Customer
  Customer.findOne({
    mobile: mobile
  }, function(err, foundCustomer) {
    if (err) {
      console.log(err);
    } else {
      if (foundCustomer) {
        bcrypt.compare(password, foundCustomer.password, function(err, result) {
          if (result === true) {
            placeOrder(foundCustomer.id);
            // res.send("success");
          } else {
            res.send("Incorrect password");
          }
        });
      } else {
        res.send("Customer Not Found");
      }
    }
  });

  //Customer Validated then placeOrder
  function placeOrder(customerId) {
    const orderedItems = req.body.items;
    let address = new Array();

    const order = new Order({
      items: orderedItems,
      order_status: "Task Created",
      customer_id: customerId,
      pickup_loc: address
    });

    //Fetching Addresses
    orderedItems.forEach(function(item) {
      // console.log(item.name);

      Catelogue.findOne({
        name: item.name
      }, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          if (result) {
            // console.log(result.addresses);
            const len = result.addresses.length;
            // console.log(len, Math.random()*len);
            let id = Math.floor(Math.random() * len);
            // console.log(id,result.addresses[id]);
            address.push(result.addresses[id]);
            // console.log(address,'11')
            order.pickup_loc.push(result.addresses[id]);
          }
        }
      })


    });
    order.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send(order);
      }
    })
  }
});


// Admin LOGIN AND REGISTRATION
app.get("/admin/login", function(req, res) {
  const mobile = req.body.mobile;
  const password = req.body.password;
  Admin.findOne({
    mobile: mobile
  }, function(err, foundAdmin) {
    if (err) {
      console.log(err);
    } else {
      if (foundAdmin) {
        bcrypt.compare(password, foundAdmin.password, function(err, result) {
          if (result === true) {
            res.send("Successfully LoggedIn!");
          } else {
            res.send("Invalid Credentials");
          }
        })
      } else {
        res.send("Invalid Credentials");
      }
    }
  });
});


app.post("/admin/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    const newAdmin = new Admin({
      mobile: req.body.mobile,
      password: hash
    });
    Admin.findOne({
      mobile: req.body.mobile
    }, function(err, foundAdmin) {
      if (foundAdmin) {
        res.send("That admin already exists");
      } else {
        newAdmin.save(function(err) {
          if (err) {
            res.send(err);
            res.send("Invalid Credentials");
          } else {
            res.send(newAdmin);
          }
        })
      }
    })

  })
});



//Driver
app.post('/driver/update', function(req, res) {

  Order.findOne({
    _id: req.body.id
  }, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      if (result) {
        result.order_status = req.body.status;
        res.send("Updated");
      } else {
        res.send("order not exist");
      }
    }
  });

});



app.listen(3000, function() {
  console.log("Server started on port 3000");
})
