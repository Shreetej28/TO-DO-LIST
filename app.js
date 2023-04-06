//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = {
  name: String,
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to the todolist"
})

const item2 = new Item ({
  name: "write your work!!"
})

const item3 = new Item ({
  name: "Press + to save your work!"
})

const defaultArray = [item1, item2, item3];



app.get("/", function(req, res) {

  Item.find({}).then(function(foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultArray)
      .then(function () {
        console.log("Successfully saved defult items to DB");
      })
      .catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
    }
    else{
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  })
  .catch(function(err){
    console.log(err);
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  })

  item.save();
  res.redirect("/");

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.post("/delete", function(req,res){

  const checkItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkItemId, function(err){
    if(!err){
      console.log("Successfully deleted.");
    }
  })
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
