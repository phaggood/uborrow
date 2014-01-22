var mongoose = require('mongoose');
var Cabinet = mongoose.model('Cabinet', require('./../models/cabinet').schema);
var async = require('async');
var errorMsgs = require('../errors');
var should = require('should');
var testData = require('./testData');

/*
 * Mocha Test
 *
 * Tests are organized by having a "describe" and "it" method. Describe
 * basically creates a "section" that you are testing and the "it" method
 * is what runs your test code.
 *
 * For asynchronous tests you need to have a done method that you call after
 * your code should be done executing so Mocha runs to test properly.
 */

describe('Cabinet Models: ', function(){
  var currentUser = null;
  var cd = testData.cabinetData;

    beforeEach(function (done) {

        function clearDB() {
            for (var i in mongoose.connection.collections) {
                mongoose.connection.collections[i].remove(function() {});
            }
            return done();
        }

        if (mongoose.connection.readyState === 0) {
            mongoose.connect('mongodb://localhost/cabinet_test', function (err) {
                if (err) {
                    throw err;
                }
                return clearDB();
            });
        } else {
            return clearDB();
        }
    });



    it("should return all authorized ", function(done){

        Cabinet.newCabinet(cd.newCabinet, function(err, cabinet){
            if (err) {
                console.log("Unable to create cabinet");
                return done(err);
            }
            //console.log("ID " + cabinet._id)
            Cabinet.isAuthorizedBorrower(cabinet._id, "imatest", function(cberr, borrower){
                should.not.exist(cberr);
                borrower.should.eql("imatest");
                done();
            });
        });
    });

    it("should return not authorized ", function(done){
        var newCabinet = {
            name:  "A new cabinet",
            description: "Some remote cabinet",
            authorizedBorrowers : ["imatest","imanothertest"],
            cabinetInventory : []
        };
        Cabinet.newCabinet(newCabinet, function(err, cabinet){
            if (err) {
                console.log("Unable to create cabinet");
                return done(err);
            }
            Cabinet.isAuthorizedBorrower(cabinet._id, "bob", function(cberr, borrower){
                should.exist(cberr);
                cberr.message.should.eql(errorMsgs.borrowerNotAuthorized);
                done();
            });
        });
    });



    it("should show three authorized borrowers after authorizing additional borrower", function(done){

        async.waterfall([
            //Load user to get userId first
            function(callback) {
                Cabinet.newCabinet(cd.newCabinet, function(err, cabinet){
                    if (err)  callback(err);
                    callback(null,cabinet);
                });
            },
            //Load posts (won't be called before task 1's "task callback" has been called)
            function(cabinet,callback) {
                Cabinet.authorizeBorrower(cabinet._id, "yetanothertest", function(err, borrowers){
                    if (err) callback(err);
                    callback(null,{borrowers:borrowers});
                });
            }
        ], function(err, result) { //This function gets called after the two tasks have called their "task callbacks"
            result.borrowers.should.have.length(3);
            done();
        });
    });


    it("should show one authorized borrower after deauthorizing a borrower", function(done){

        async.waterfall([
            //Load user to get userId first
            function(callback) {
                Cabinet.newCabinet(cd.newCabinet, function(err, cabinet){
                    if (err)  callback(err);
                    callback(null,cabinet);
                });
            },
            //Load posts (won't be called before task 1's "task callback" has been called)
            function(cabinet,callback) {
                Cabinet.deauthorizeBorrower(cabinet._id, "imatest", function(err, borrowers){
                    if (err) callback(err);
                    callback(null,{borrowers:borrowers});
                });
            }
        ], function(err, result) { //This function gets called after the two tasks have called their "task callbacks"
            result.borrowers.should.have.length(1);
            done();
        });
    });

    it("should return authorized borrower ", function(done){

        async.waterfall([
            //Load user to get userId first
            function(callback) {
                Cabinet.newCabinet(cd.newCabinet, function(err, cabinet){
                    if (err)  callback(err);
                    callback(null,cabinet);
                });
            },
            //Load posts (won't be called before task 1's "task callback" has been called)
            function(cabinet,callback) {
                Cabinet.isAuthorizedBorrower(cabinet._id, "imatest", function(err, borrower){
                    if (err) callback(err);

                    callback(null,borrower);
                });
            }
        ], function(err, result) { //This function gets called after the two tasks have called their "task callbacks"
            if (err) return done(err);
            result.should.eql("imatest");
            done();
        });
    });


});