/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    //We need to define this now and capture it later for testing.
    let id1;
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post("/api/books")
        .send({
          title: 'TestTitle'
        })
        .end(function(err, res){
          //Capture the ID of our created object here - this will be used in testing later.
          id1 = res.body._id;
          assert.equal(res.status, 200);
          assert.equal(res.body.title, "TestTitle")
          done();
        })
      });
      //If a user posts with nothing entered eg "" (that's how it's evaluated I found) then handle a 400 with message.
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post("/api/books")
        .send({
          title: ""
        })
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, "Please try again and enter a title for your book.")
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
      });      
      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      //Here nothing is passed, we just throw in an ID that'll never show up in our DB in the route URL for get.
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/fakeID')
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text, "No book found matching that ID.");
        done();
      });
      });
      //Here we can parse our id1 taken from earlier and return the object - easy.
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/'+id1)
        .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body._id, id1);
        assert.property(res.body, 'title', 'This returned object should have a title at least.');
        done();
      });
      });      
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      //Here we have to parse our id1 again and send a comment, which will push a comment to the comments array.
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/'+id1)
        .send({
          comment: "New Comment!"
        })
        .end(function(err, res){
          //Here, we want to ensure thoroughly that the comments array of our returned object has this new comment and that it's the last value.
          //Order doesn't matter but we want to make sure we're consistent with our function, which pushes.
          assert.equal(res.status, 200);
          assert.equal(res.body._id, id1)
          assert.include(res.body.comments, "New Comment!")
          assert.equal(res.body.comments[res.body.comments.length - 1], "New Comment!")
          done();
        })
      });
      
    });

  });

});
