/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var BookHandler = require('../controllers/bookHandler.js');
module.exports = function (app) {
  
  var bookHandler = new BookHandler();

  //These routes are very straight forward.  The bookHandler.js handles everything for us so we really just need to collect params through the routes themselves.
  app.route('/api/books')
    .get(function (req, res){
    var query = req.query
    bookHandler.listBooks(query, res)
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      bookHandler.addBook(title, res)
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
    bookHandler.deleteBooks(res)
      //if successful response will be 'complete delete successful'
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      bookHandler.getBook(bookid, res)
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      bookHandler.addComment(bookid, comment, res)
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
    bookHandler.deleteBook(bookid, res)
      //if successful response will be 'delete successful'
    });
  
};
