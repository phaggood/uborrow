// test-specific imports
var app = require('../app');
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var async = require('async');
var errorsMsgs = require('../errors');
var mongoose = require('mongoose');
var Cabinet = mongoose.model('Cabinet', require('./../models/cabinet').schema);
var Item = mongoose.model('Item', require('./../models/item').schema);
var testData = require('./testData');

describe('Makerapp API : ', function() {

    beforeEach(function (done) {

        function clearDB() {
            for (var i in mongoose.connection.collections) {
                mongoose.connection.collections[i].remove(function() {});
            }
            return done();
        }

        if (mongoose.connection.readyState === 0) {
            mongoose.connect('mongodb://localhost/cabinet_api_test', function (err) {
                if (err) {
                    throw err;
                }
                console.log("connected to test database");
                return clearDB();
            });
        } else {
            return clearDB();
        }
    });

    afterEach(function (done) {
        mongoose.disconnect();
        return done();
    });

    // create a cabinet and place items into it
    var initCabinetItems = function(cabinet, callback) {
        var itd = testData.itemData;
        var cabinetData = {};
        Cabinet.newCabinet(testData.cabinetData.cabinet1, function(err, cabinet){
            if (err) return callback(err,null);
            cabinetData.id = cabinet._id;
            async.series({
                inactiveItem : function(cb){
                    itd.inactiveTrialItem.cabinet = cabinet._id;
                    Item.createItem(itd.inactiveTrialItem, function(err, item){
                        if(err) {
                            cb(err,null);
                        }
                        cb(null, item);
                    });
                },
                reservedItem : function(cb){
                    itd.reservedTrialItem.cabinet = cabinet._id;
                    Item.createItem(itd.reservedTrialItem, function(err, item){
                        if(err) {
                            cb(err,null);
                        }
                        cb(null, item);
                    });
                },
                checkedOutItem : function(cb){
                    itd.checkedOutTrialItem.cabinet = cabinet._id;
                    Item.createItem(itd.checkedOutTrialItem, function(err, item){
                        if(err) {
                            cb(err,null);
                        }
                        cb(null, item);
                    });
                },
                availableItem1 : function(cb){
                    itd.availableTrialItem1.cabinet = cabinet._id;
                    Item.createItem(itd.availableTrialItem1, function(err, item){
                        if(err) {
                            cb(err,null);
                        }
                        cb(null, item);
                    });
                },
                availableItem2 : function(cb){
                    itd.availableTrialItem2.cabinet = cabinet._id;
                    Item.createItem(itd.availableTrialItem2, function(err, item){
                        if(err) {
                            cb(err,null);
                        }
                        cb(null, item);
                    });
                }
            }, function (err, result) {
                if (err) callback(err,null);
                //console.log(result);
                cabinetData.items = result;
                callback(null,cabinetData);
            });
        });
    };


    describe(" -- root route -- ", function(){
        it("should return response from root route", function(done){
        request(app)
            .get("/")
            .end(function (err, res) {
                res.should.have.status(200)
                done();
            });
        });
    });

    describe(' -- cabinet api -- ', function() {
        var cd = testData.cabinetData;

        it("should return 202 cabinet created item via post to /uborrow/cabinets", function(done){
            var url = "/uborrow/cabinets"
            request(app)
                .post(url)
                .send({cabinet:cd.cabinet2, action:"add"})
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(201)  ;
                    res.body.should.property("name").eql(cd.cabinet2.name);
                    done();
                });
        });

        it("should return 202 cabinet add borrower via post to /uborrow/cabinets", function(done){
            var url = "/uborrow/cabinets"
            new Cabinet(cd.cabinet3).save(function(err, cabinet){
                if (err) return done(err);
                request(app)
                    .post(url)
                    .send({cabinetid:cabinet._id, borrower: cd.borrower3, action:"grant"})
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(202)  ;
                        //res.body.should.have.property("name").eql(itd.cabinet2.name);
                        res.body.should.have.length(3);
                        done();
                    });
            });
        });

        it("should return 202 cabinet remove borrower item via post to /uborrow/cabinets", function(done){
            var url = "/uborrow/cabinets"
            new Cabinet(cd.cabinet3).save(function(err, cabinet){
                if (err) return done(err);
                request(app)
                    .post(url)
                    .send({cabinetid:cabinet._id, borrower: "imatest", action:"revoke"})
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(202)  ;
                        res.body.should.have.length(1);
                        done();
                    });
            })
        });

        it('should return 200 and expected cabinet from /uborrow/cabinet/:id', function(done){
            new Cabinet(cd.cabinet1).save(function(err, cabinet) {
                if (err) return done(err);
                request(app)
                    .get("/uborrow/cabinets/"+ cabinet._id )
                    .end(function (cberr, res) {
                        should.not.exist(cberr);
                        res.should.have.status(200)  ;
                        //console.log(res.body);
                        res.body.should.have.property("name").eql(cd.cabinet1.name);
                        done();
                    });
            });
        });

        it('should return 200 from get request /uborrow/cabinets', function(done){
            async.parallel([
                function(cb) {
                    new Cabinet(cd.cabinet1).save(function(err, cabinet) {
                        cb(err, cabinet);
                    });
                },
                function(cb) {
                    new Cabinet(cd.cabinet2).save(function(err, cabinet) {
                        cb(err, cabinet);
                    });
                }
            ], function(err, cabinets) {
                request(app)
                    .get("/uborrow/cabinets")
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(200)
                        res.body.should.have.length(2);
                        done();
                    });
                //done();
            });
        });
    });

    describe(' -- itema api --', function() {
        var itd = testData.itemData;
        it("should return 200 and expected number of items from get request /uborrow/cabinets/:cabinetid/items", function(done){
            initCabinetItems(testData.cabinetData.cabinet1, function(err,data){
                if (err) return done(err);
                request(app)
                    .get("/uborrow/cabinets/"+ data.id + "/items")
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(200)  ;
                        res.body.should.have.length(Object.keys(data.items).length);
                        done();
                    });
            });
        });
    });

    describe(' -- itema api --', function() {
        var itd = testData.itemData;

        it('should return 200 and expected item from /uborrow/item/:id', function(done){
            new Item(itd.availableTrialItem1).save(function(err, item) {
                if (err) return done(err);
                request(app)
                    .get("/uborrow/items/"+ item._id )
                    .end(function (cberr, res) {
                        should.not.exist(cberr);
                        res.should.have.status(200)  ;
                        //console.log(res.body);
                        res.body.should.have.property("name").eql(itd.availableTrialItem1.name);
                        done();
                    });
            });
        });

        it("should return 200 and all 5 items in cabinet via /uborrow/cabinets/:cabinetid/items", function(done){
            initCabinetItems(testData.cabinetData.cabinet1, function(err,data){
                if (err) return done(err);
                request(app)
                    .get("/uborrow/cabinets/"+ data.id + "/items")
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(200)  ;
                        res.body.should.have.length(Object.keys(data.items).length);
                        done();
                    });
            });
        });

        it("should return 200 and only 2 items available for checkout /uborrow/cabinets/:cabinetid/items?available=true", function(done){
            initCabinetItems(testData.cabinetData.cabinet1, function(err,data){
                if (err) return done(err);
                request(app)
                    .get("/uborrow/cabinets/"+ data.id + "/items?available=true")
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(200)  ;
                        res.body.should.have.length(2);
                        done();
                    });
            });
        });

        it("should return 200 and 3 unavailable items /uborrow/cabinets/:cabinetid/items?available=false", function(done){
            initCabinetItems(testData.cabinetData.cabinet1, function(err,data){
                if (err) return done(err);
                request(app)
                    .get("/uborrow/cabinets/"+ data.id + "/items?available=false")
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(200)  ;
                        res.body.should.have.length(3);
                        done();
                    });
            });
        });

        it("should return 202 checked-in item via post to /uborrow/cabinets/:cabinetid/items", function(done){
            initCabinetItems(testData.cabinetData.cabinet1, function(err,data){
                if (err) return done(err);
                var url = "/uborrow/cabinets/"+data.id+"/items";
                request(app)
                    .post(url)
                    .send({itemid: data.items.checkedOutItem._id, action:"checkin"})
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(202)  ;
                        res.body.should.property("name").eql(itd.checkedOutTrialItem.name);
                        done();
                    });
            });
        });

        it("should return 202 check-out item via post to /uborrow/cabinets/:cabinetid/items", function(done){
            initCabinetItems(testData.cabinetData.cabinet1, function(err,data){
                if (err) return done(err);
                var url = "/uborrow/cabinets/"+data.id+"/items";
                request(app)
                    .post(url)
                    .send({itemid: data.items.availableItem1._id, action:"checkout", borrower:"imatest"})
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(202)  ;
                        res.body.should.property("name").eql(itd.availableTrialItem1.name);
                        res.body.should.have.property("currentCheckout").eql("imatest");
                        done();
                    });
            });
        });

        it("should return 202 waitlist item via post to /uborrow/cabinets/:cabinetid/items", function(done){
            initCabinetItems(testData.cabinetData.cabinet1, function(err,data){
                if (err) return done(err);
                //console.log("WaitItem " + data.items.reservedItem); //.waitList.should.have.length(1);
                var url = "/uborrow/cabinets/"+data.id+"/items"
                request(app)
                    .post(url)
                    .send({itemid:data.items.reservedItem._id, action:"reserve", borrower:"imatest"})
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(202)  ;
                        res.body.should.property("name").eql(itd.reservedTrialItem.name);
                        res.body.should.have.property("waitList").with.length(2);
                        done();
                    });
            });
        });


        it("should return 202 add item to cabinet via post to /uborrow/cabinets/:cabinetid/items", function(done){
            initCabinetItems(testData.cabinetData.cabinet2, function(err,data){
                var url = "/uborrow/cabinets/"+data.id+"/items"
                if (err) return done(err);
                Item.createItem(itd.availableTrialItem3, function(cr_err, item){
                    if (cr_err) return done(err);
                    request(app)
                        .post(url)
                        .send({itemid:item._id, action:"add"})
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.should.have.status(202)  ;
                            res.body.should.property("name").eql(itd.availableTrialItem3.name);
                            res.body.should.have.property("cabinet").eql(data.id.toString());
                            done();
                        });
                });
            });
        });

        it("should return 202 item created item via post to /uborrow/items", function(done){
            var url = "/uborrow/items"
            request(app)
                .post(url)
                .send({item:itd.availableTrialItem3, action:"add"})
                .end(function (err, res) {
                    should.not.exist(err);
                    res.should.have.status(202)  ;
                    res.body.should.property("name").eql(itd.availableTrialItem3.name);
                    res.body.should.have.property("waitList").with.length(0);
                    done();
                });
        });

        it("should return 202 item deactivated via post to /uborrow/items", function(done){
            initCabinetItems(testData.cabinetData.cabinet2, function(err,data){
                var url = "/uborrow/items";
                var closedDate = new Date(new Date().setDate(new Date().getDate()-1))
                if (err) return done(err);
                request(app)
                    .post(url)
                    .send({itemid:data.items.availableItem1._id, closedDate:closedDate, action:"close"})
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.should.have.status(202)  ;
                        res.body.should.property("name").eql(itd.availableTrialItem1.name);
                        res.body.should.have.property("inactiveDate"); //.eql(data.id.toString());
                        done();
                    });
            });
        });
    });


});


