const apiRoutes = require('../routes/api.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const CONNECTION_STRING = process.env.DB;
const dbName = "test";
const collectionName = "books";
const shortid = require('shortid');


//Here we'll handle the actual workload for the API calls.
//Every function will follow a very similar construction - pass params (including res so we can pass responses), connect to MongoDB and do something.
function bookHandler() {
  //POST - add a book here.
  this.addBook = function(title, res) {
    //I noticed that title was being evaluated in this regard, not "null" or "undefined".  If it comes in this way we should exit right away with a response.
    if (title == "") {
      res.status(400).send("Please try again and enter a title for your book.")
      return false;
    }
    
    let mongDB = MongoClient.connect(CONNECTION_STRING, function(err, client) {
      if (err) {
        throw(err)
      }
      else {
      console.log("Connected correctly to server - performing add.");
      const db = client.db(dbName);
      const collection = db.collection(collectionName)
      
      //Our initial value for every new entry.  Pretty simple.
      let resVal = {
        _id: shortid.generate(),
        title: title,
        comments: [],
        commentcount: 0
      }
      //In every function I will close the client after performing a task like this per MongoDB documentation.
      collection.insertOne(resVal, (err, result) => {
        if (err) {
          throw(err)
        }
        else {
          res.json(result.ops[0])
          }
        })
      }
      client.close();
    })
  }
  //POST - add a comment to a book ID here.
  this.addComment = function(id, comment, res) {
    let mongDB = MongoClient.connect(CONNECTION_STRING, function(err, client) {
      if (err) {
        throw(err)
      }
      else {
      console.log("Connected correctly to server - performing add comment.");
      const db = client.db(dbName);
      const collection = db.collection(collectionName)
      
      collection.findOneAndUpdate({"_id": id}, {'$push': {comments: comment}, '$inc': {commentcount: 1}}, {returnOriginal: false}, (err, item) => {
          if (err) {
            console.log(err)
            res.send("Could not update Book ID - please review and try again.")
          }
        //I noticed the item return here is just "null" if it finds nothing.  It does NOT throw an error on its own so we send the response as such ourselves.
        else if (item.value == null) {
            console.log("No entry found.")
            res.status(400).send("No books exist by that ID.")
          }
          else {
            console.log("Successful.")
            res.send(item.value)
          }
      })
      }
      client.close();
    })
    }

  //GET! Return an array of books.
  this.listBooks = function(queryObj, res) {
    let mongDB = MongoClient.connect(CONNECTION_STRING, function(err, client) {
      if (err) {
        throw(err)
      }
      else {
      console.log("Connected correctly to server - performing list books.");
      const db = client.db(dbName);
      const collection = db.collection(collectionName)
      
      //Toarray makes this pretty simple and straight forward.
      collection.find(queryObj).toArray((err, items) => {
        if (err) {
          console.log(err)
          res.send(err)
        }
        else if (items.length === 0) {
          res.send("No items found! Try another query.")
        }
        else {
          res.send(items)
             }
        })
      }
      client.close();
  })
}
  //GET! Return a single book by ID.
  this.getBook = function(id, res) {
    let mongDB = MongoClient.connect(CONNECTION_STRING, function(err, client) {
      if (err) {
        throw(err)
      }
      else {
      console.log("Connected correctly to server - performing get book.");
      const db = client.db(dbName);
      const collection = db.collection(collectionName)
      
    collection.findOne({_id: id}, (err, item) => {
        if (err) {
          console.log(err)
          res.send(err)
        }
      //Again, like updating, findOne does not actually throw an err if nothing is found.
      //Instead, we can evaluate falsy here and throw the error ourselves.
        else if (!item) {
          console.log("No book matching that ID found.")
          res.send("No book found matching that ID.")
        }
        else {
          res.send(item)
        }
      })
      }
      client.close();
    })
  }
  //DELETE! Delete a single book by ID.
  this.deleteBook = function(id, res) {
    let mongDB = MongoClient.connect(CONNECTION_STRING, function(err, client) {
      if (err) {
        throw(err)
      }
      else {
      console.log("Connected correctly to server - performing delete book.");
      const db = client.db(dbName);
      const collection = db.collection(collectionName)
      
    collection.deleteOne({_id: id}, (err, item) => {
        if (err) {
          console.log(err)
          res.send(err)
        }
      //Same as above - no error thrown if no match found, so we evaluate ourselves.
        else if (!item) {
          console.log("No book matching that ID found.")
          res.send("No book found matching that ID.")
        }
        else {
          res.send("Delete successful.")
        }
      })
      }
      client.close();
    })
  }
  //DELETE! Delete all books - dangerous but necessary.
  this.deleteBooks = function(res) {
    let mongDB = MongoClient.connect(CONNECTION_STRING, function(err, client) {
      if (err) {
        throw(err)
      }
      else {
      console.log("Connected correctly to server - performing delete books.");
      const db = client.db(dbName);
      const collection = db.collection(collectionName)
      
      //Here we don't need to accept any params other than res; we're just going to drop the collection straight away.
      //Book objects are stored in a collection and by default, interaction with adding an item to a collection with MongoDB will initialize the collection again anyway.
      db.collection(collectionName).drop(err, result => {
        if (err) {
          console.log(err)
          res.send(err)
        }
        if (result) {
          console.log("Nothing to delete.")
          res.send("Nothing to delete.")
        }
        else {
          console.log("Delete successful.")
          res.status(200).send("Complete delete successful.")
        }
      })
  }
      client.close();
})
    }
}

module.exports = bookHandler;