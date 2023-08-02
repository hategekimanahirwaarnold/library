/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const DB = process.env.DB;

module.exports = function (app) {

  mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to mongoose')
  }).catch(err => console.log("unable to connect to mongoose", err));
let booksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  commentcount: {
    type: Number,
    default: 0
  },
  comments: {
    type: [String],
  }
});
let Book = mongoose.model('Book', booksSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      Book.find()
      .then(items => {
      //  console.log("get request: ", items);
        res.json(items);
      }).catch(err => {
        console.log("unable to get books: ", err);
      })
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (title) {
        Book.create({title: title})
        .then((item) => {
          res.json(item);
        }).catch(err => {console.log("unable to create a new book")})
        //response will contain new book object including atleast _id and title
      } else {
        console.log("missing required field title");
        res.status(400).send('missing required field title');
      }
    })
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany()
      .then(() => {
      //  console.log("complete delete successful");
        res.send("complete delete successful")
      }).catch(err => console.log("unable to delete all items: ", err));
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById(bookid)
      .then(item => {
        if (item) {
        //  console.log("found the book on get request: ", item);
          res.json(item);
        } else {
       //   console.log("no book exists");
          res.send("no book exists");
        }
      }).catch(err => {
       // console.log("no book exists");
        res.send("no book exists");
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      Book.findById(bookid)
      .then((livre) => {
    //    console.log("obtained livre: ", livre);
        if (comment) {
          livre.comments.push(comment);
          livre.commentcount++;
          livre.save()
          .then((saved) => {
      //      console.log("saved book, ", saved);
            res.json(saved);
          })
          .catch(err => console.log("couldn't save the book: ", err))
        } else {
      //    console.log("missing required field comment");
          res.send("missing required field comment");
        }
      }).catch(err => {
      //  console.log("no book exists", err);
        res.send("no book exists");
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findByIdAndDelete(bookid)
      .then(removed => {
        if (removed) {
          //  console.log("delete successful", removed);
            res.send("delete successful");
        } else {
          //  console.log("no book exists");
            res.send("no book exists");
        }
      }).catch(err => {
      //  console.log("no book exists");
        res.send("no book exists");
      })
      //if successful response will be 'delete successful'
    });
  
};
