var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");

console.log("\n\nQlik Audition Project Unit Tests");

describe("GET /",function(){

    it("should return home page",function(done){
        server
        .get("/")
        .expect("Content-type",/json/)
        .expect(200) 
        .end(function(err,res){
            res.status.should.equal(200);
            done();
        });
    });

    it("should return 404 not found - POST to /",function(done){
        server
        .post("/")
        .expect("Content-type",/json/)
        .expect(404) 
        .end(function(err,res){
            res.status.should.equal(404);
            done();
        });
    });

});



describe("POST /messages",function(){

    it("should create a single message",function(done){
        server
        .post("/messages")
        .send({"username": "dom", "message":"hello from mocha"})
        .expect("Content-type",/json/)
        .expect(200) 
        .end(function(err,res){
            res.status.should.equal(200);
            done();
        });
    });

    it("should return 400 bad request - missing username",function(done){
        server
        .post("/messages")
        .send({"message":"hello from mocha"})
        .expect("Content-type",/json/)
        .expect(400) 
        .end(function(err,res){
            res.status.should.equal(400);
            done();
        });
    });

    it("should return 400 bad request - missing message",function(done){
        server
        .post("/messages")
        .send({"username": "dom"})
        .expect("Content-type",/json/)
        .expect(400) 
        .end(function(err,res){
            res.status.should.equal(400);
            done();
        });
    });

    it("should return 400 bad request - empty body",function(done){
        server
        .post("/messages")
        .send({})
        .expect("Content-type",/json/)
        .expect(400) 
        .end(function(err,res){
            res.status.should.equal(400);
            done();
        });
    });

    it("should return 400 bad request - no body",function(done){
        server
        .post("/messages")
        .expect("Content-type",/json/)
        .expect(400) 
        .end(function(err,res){
            res.status.should.equal(400);
            done();
        });
    });
});



describe("GET /messages",function(){

    it("should return a list of all messages as JSON array",function(done){
        server
        .get("/messages")
        .expect("Content-type",/json/)
        .expect(200) 
        .end(function(err,res){
            res.status.should.equal(200);
            //res.body.should.have.property();
            res.body.should.be.instanceOf(Array);
            done();
        });
    });

});



describe("GET /messages/messageid/palindrome",function(){

    it("should tell client the message is a palindrome",function(done){
        server
        .get("/messages/17/palindrome")
        .expect("Content-type",/json/)
        .expect(200) 
        .end(function(err,res){
            res.status.should.equal(200);
            res.body.should.equal(true);
            done();
        });
    });

    it("should tell client the message is not a palindrome",function(done){
        server
        .get("/messages/18/palindrome")
        .expect("Content-type",/json/)
        .expect(200) 
        .end(function(err,res){
            res.status.should.equal(200);
            res.body.should.equal(false);
            done();
        });
    });

    it("should return 400 bad request - bad messageID",function(done){
        server
        .get("/messages/not_an_int/palindrome")
        .expect("Content-type",/json/)
        .expect(400) 
        .end(function(err,res){
            res.status.should.equal(400);
            done();
        });
    });

});




/*




  it("should return 400 bad request",function(done){

    server
    .delete("/messages/-1")
    .expect("Content-type",/json/)
    .expect(400) 
    .end(function(err,res){
      res.status.should.equal(400);
      done();
    });
  });
*/








describe("Miscellaneous Tests",function(){

    it("should return 404 not found",function(done){
        server
        .get("/notanendpoint")
        .expect("Content-type",/json/)
        .expect(404) 
        .end(function(err,res){
            res.status.should.equal(404);
            done();
        });
    });

    it("should return 404 not found",function(done){
        server
        .post("/alsonotreal")
        .expect("Content-type",/json/)
        .expect(404) 
        .end(function(err,res){
            res.status.should.equal(404);
            done();
        });
    });

});