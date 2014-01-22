var mongoose = require('mongoose');
var Item = mongoose.model('Item', require('./../models/item').schema);
var Cabinet = mongoose.model('Cabinet', require('./../models/cabinet').schema);
var async = require('async');
var testData = require('./testData');

// Connecting to a local test database or creating it on the fly
mongoose.connect('mongodb://localhost/item_test');

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

describe('Items Models:', function(){
    var currentItem = null;

    afterEach(function(done){
        Item.remove({}, function(){
            done();
        });
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
                cabinetData.items = result;
                callback(null,cabinetData);
            });
        });
    };


    it('should register a new item', function(done){
        Item.createItem({name:"an item", checkout:{}}, function(err, newItem){
            newItem.name.should.equal("an item");
            newItem.should.have.property("checkoutHistory").with.length(0);
            done();

        });
    });

    it('should deactivate an item', function(done){
        Item.createItem({name:"an item", checkout:{}}, function(err, newItem){
            if (err) done(err);
            var inactiveDate = new Date + 1;
            Item.deactivate(newItem.id, inactiveDate, function(err, inactiveItem) {
                if (err) done(err);
                inactiveItem.should.have.property("name").eql(newItem.name);
                //inactiveItem.should.have.property("inactiveDate").eql(inactiveDate);
                done();
            });
        })

    });

    it('should add borrower to item waitlist queue', function(done){
        var uniquename = "imatest";
        Item.createItem({name:"an item", checkout:{}}, function(err, newItem){
            if (err) done(err);
            Item.addBorrowerToWaitList(newItem.id, uniquename, function(err,item){
                if (err) done(err);
                item.should.have.property("name").eql(newItem.name);
                item.should.have.property("waitList").with.length(1);
                done();
            });
        });
    });


    it('should list all 4 items', function(done){
        // a borrower
        var borrower = "imatest";

        // create a few checout-able items
        async.parallel([
            function(cb) {
                Item.createItem({name:"moisture meter", checkout:{}}, function(err, newItem){
                    cb(err, newItem);
                });
            },
            function(cb) {
                Item.createItem({name:"watering can", checkout:{}}, function(err, newItem){
                    cb(err, newItem);
                });
            },
            function(cb) {
                Item.createItem({name:"measuring tape", checkout:{}}, function(err, newItem){
                    cb(err, newItem);
                });
            },
            function(cb) {
                Item.createItem({name:"ph reader", checkout:{}}, function(err, newItem){
                    cb(err, newItem);
                });
            }
        ], function(err, tools) {
            Item.find({}, function(err, items){
                if (err) done(err);
                items.should.have.length(4);
                done();
            })
        });
    });

    // create checked out item, check it in
    it('should check in item', function(done){
        var borrower = "imatest";
        var currentCheckout = {
            name : "Solar Meter",
            currentCheckout: borrower,
            availableDate:activeDate,
            lastCheckoutDate: checkoutDate
        };

        var checkoutDate = new Date(new Date().setDate(new Date().getDate()-2));
        var activeDate = new Date(new Date().setDate(new Date().getDate()-5));
        Item.createItem(currentCheckout, function(err, newItem){
            if (err) done(err);
            Item.checkin(newItem._id, function(err, item){
                if (err) done(err);
                item.should.have.property("currentCheckout").eql(null);
                item.should.have.property("checkoutHistory").with.length(1);  // 0 item should be checkout user
                item.checkoutHistory[0].should.have.property('borrower').eql(borrower);
                done();
            });
        });
    });

    it('should exercise all checkout outcomes with only last one succeeding', function(done){

        // a borrower
        var borrower = "imatest";

        var inactiveTrialItem = {
            name:"moisture meter",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            inactiveDate : new Date(new Date().setDate(new Date().getDate()-2))
        };

        var reservedTrialItem = {
            name:"watering can",
            waitList:["someotheruser"]
        };

        var checkedOutTrialItem = {
            name:"measuring tape",
            currentCheckout:"yetanothruser"
        };

        var availableTrialItem = {
            name:"Solar Detector",
            waitList : []
        };

        async.parallel({
            inactiveItem: function(cb) {
                Item.createItem(inactiveTrialItem, function(inactiveErr, inactiveItem){
                    cb(inactiveErr, inactiveItem);
                });
            }
            ,reservedItem: function(cb) {
                Item.createItem(reservedTrialItem, function(err, reservedItem){
                    cb(err, reservedItem);
                });
            }
            ,checkedOutItem: function(cb) {
                Item.createItem(checkedOutTrialItem, function(err, checkedOutItem){
                    cb(err, checkedOutItem);
                });
            }
            ,availableItem: function(cb) {
                Item.createItem(availableTrialItem, function(err, availableItem){
                    cb(err, availableItem);
                });
            }
        }, function(err, items) {

            async.series([
                function(callback){
                    Item.checkout(items.inactiveItem._id, borrower, function(err, item){
                        if (err === null) callback(new Error({message:"should be inactive"}),item);
                        callback(null,"inactive");
                    });
                    callback(null, 'inactive');
                }

                ,function(callback){
                    Item.checkout(items.reservedItem._id, borrower, function(err, item){
                        if (err === null) callback(new Error({message:"should be reserved by other user"}),item);
                        callback(null,"inactive");
                    });
                    callback(null, 'reserved');
                }
                ,function(callback){
                    Item.checkout(items.checkedOutItem._id, borrower, function(err, item){
                        if (err === null) callback(new Error({message:"should be previously checked out by other user"}),item);
                        callback(null,"checkedout");
                    });
                    callback(null, 'checkedout');
                }

                ,function(callback){
                    Item.checkout(items.availableItem.id, borrower, function(err, item){
                        if (err) callback(err);   // this one should not have an error
                    });
                    callback(null, {checkedOutItem: items.availableItem});
                }

            ],

                function(err, results){
                    results.should.have.length(4);
                });
            done();
        });
    });


    it('should create two new items in cabinet', function(done){
        var newCabinet = {
            name:  "A new cabinet",
            description: "Some remote cabinet",
            authorizedBorrowers : ["imatest","imanothertest"],
            cabinetInventory : []
        };
        var availableTrialItem1 = {
            name:"Solar Detector",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        };

        var availableTrialItem2 = {
            name:"Metal Scanner",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        };


        async.waterfall([
            function(cb){
                Cabinet.newCabinet(newCabinet, function(err, cabinet){
                    if (err) cb(err);
                    cb(null, cabinet);
                });
            },
            function(cabinet, cb){
                availableTrialItem1.cabinet = cabinet._id;
                Item.createItem(availableTrialItem1, function(err, item1){
                    if(err) {
                        cb(err,null);
                    }
                    cb(null, cabinet);
                });
            },
            function(cabinet, cb){
                availableTrialItem2.cabinet = cabinet._id;
                Item.createItem(availableTrialItem2, function(err, item2){
                    if(err) {
                        cb(err,null);
                    }
                    cb(null, {"newCabinet" : cabinet });
                });
            }
        ], function (err, result) {
            Item.find({cabinet:result.newCabinet._id}, function(err, items){
                items.should.have.length(2);
                items[0].name.should.eql(availableTrialItem1.name);
                items[0].cabinet.should.eql(result.newCabinet._id);
                items[1].name.should.eql(availableTrialItem2.name);
                items[1].cabinet.should.eql(result.newCabinet._id);
            })
            done();
        });
    });

    it('should add existing item to cabinet', function(done){
        var newCabinet = {
            name:  "Matthaei Garden Cabinet",
            description: "Utility cabinet at Matthei Garden",
            authorizedBorrowers : ["imatest","imanothertest"],
            cabinetInventory : []
        };
        var newItem1 = {
            name:"Solar Detector",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        };

        async.waterfall([
            function(cb){
                Cabinet.newCabinet(newCabinet, function(err, cabinet){
                    if (err) cb(err);
                    cb(null, cabinet);
                });
            },
            function(cabinet, cb){
                Item.createItem(newItem1, function(err, item1){
                    if(err) {
                        cb(err,null);
                    }
                    cb(null, [item1, cabinet]);
                });
            }
        ], function (err, result) {
            Item.addItemToCabinet(result[0]._id, result[1].item_id , function(err, item){
                //items.should.have.length(2);
                //items[0].name.should.eql(availableTrialItem1.name);
                //items[0].cabinet.should.eql(result.newCabinet._id);
                item.name.should.eql(newItem1.name);
            })
            done();
        });
    });

    it("should return 200 and only 2 items available for checkout ", function(done){
        initCabinetItems(testData.cabinetData.cabinet1, function(err,data){
            if (err) return done(err);
            Item.availableForCheckout(data.id , "notinwaitlistborrower", function(err, items){
                //should.not.exist(err);
                //Object.keys(data.items).length
                items.should.have.length(2);
            })
            done();
        })
    });

    it("should return 200 and  4 items unavailable for checkout ", function(done){
        initCabinetItems(testData.cabinetData.cabinet1, function(err,data){
            if (err) return done(err);
            Item.unavailableForCheckout(data.id , "notinwaitlistborrower", function(err, items){
                //should.not.exist(err);
                //Object.keys(data.items).length
                items.should.have.length(3);
            })
            done();
        })
    });

});
