var errorMsgs = require('../errors');
var async = require('async');
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,Mixed = Schema.Types.Mixed
    ,ObjectId = Schema.ObjectId;


var itemSchema = new Schema({
    name:  { type: String, required: true, index : {unique:true}},
    description: String,
    thumbnail : Buffer,
    waitList : [],
    checkoutHistory : [],
    currentCheckout : String,
    lastCheckoutDate : Date,
    availableDate: { type: Date, default: Date.now },
    inactiveDate : Date,
    cabinet : ObjectId
});

var isAvailable = function(item, borrower) {
    if (item.currentCheckout != null ) return errorMsgs.err(errorMsgs.itemAlreadyCheckedOut);
    if (item.waitList.length > 0 && item.waitList[0] != borrower) return errorMsgs.err(errorMsgs.ItemPrevioslyReserved);
    if (item.inactiveDate != null && item.inactiveDate < new Date()) return errorMsgs.err(errorMsgs.ItemNotActive);
    return null;
}

// item must not already be checked out, or on reserved by other borrower, or inactive
itemSchema.methods.isAvailableForCheckout = function(borrower, cb) {
    cb(isAvailable(this,borrower));
};

itemSchema.statics.deactivate = function(id, closeDate, cb) {
    this.findOne({_id: id}, function(err, item){
        if (err) cb(err,null);
        item.inactiveDate = closeDate ? closeDate : new Date();
        item.save(function (err, closedItem) {
            if (err) cb(err,null);
            cb(null,closedItem);
        })
    });
};

itemSchema.statics.createItem = function(item, cb) {
    var itemModel = mongoose.model("Item");
    new itemModel(item).save( function (err, newItem){
        if (err)  cb(err, null);
        cb(null,newItem);
    })
};

itemSchema.statics.addBorrowerToWaitList = function(id, uniquename, cb) {
    this.findOne({_id: id}, function(err, item){
        if (err) cb(err,null);
        if (item.currentCheckout != null) cb(new Error({message:errorMsgs.itemAlreadyCheckedOut}), item);
        item.waitList.push(uniquename);
        item.save(function (err, updatedItem) {
            if (err) cb(err,null);
            cb(null,updatedItem);
        })
    });
};

itemSchema.statics.checkin = function(id,cb){
    this.findOne({_id: id}, function(err, item){
        if (err)  cb(err,null);
        item.checkoutHistory.push({borrower:item.currentCheckout, checkinDate: new Date()});
        item.currentCheckout = null;
        item.save(cb(err, item));
    });
};

itemSchema.statics.checkout = function(id, uniquename, cb) {
    this.findOne({_id: id}, function(err, item){
        if (err)  cb(err,null);
        item.isAvailableForCheckout(uniquename, function(err){
            if(err) cb(err,item);
        });
        item.currentCheckout = uniquename;
        item.lastCheckoutDate = new Date();
        item.save(function (err, updatedItem) {
            if (err) cb(err,updatedItem);
            cb(null,updatedItem);
        })
    });
};

itemSchema.statics.addItemToCabinet = function(item_id, cabinet_id, cb) {
    this.findOne({_id: item_id}, function(err, item){
        if (err)  cb(err,null);
        item.cabinet = cabinet_id;
        item.save(function (err, updatedItem) {
            if (err) cb(err,updatedItem);
            cb(null,updatedItem);
        })
    });
};

itemSchema.statics.availableForCheckout = function(cabinet_id, borrowername, cb) {
    var inventory = [];
    this.find({cabinet: cabinet_id}, function(err, items){
        if (err)  cb(err,null);
        async.forEachSeries(items, function(item, callback) { //The second argument (callback) is the "task callback" for a specific messageId
            item.isAvailableForCheckout(borrowername, function(co_err){
                if (!co_err) {
                    inventory.push(item);
                    callback(null,item);
                } else {
                    callback(null,null);
                }
            });
        }, function(err) {  // should be array of items that didn't return error
            cb(null,inventory);
        });
    });
};


itemSchema.statics.unavailableForCheckout = function(cabinet_id, borrowername, cb) {
    var inventory = [];
    this.find({cabinet: cabinet_id}, function(err, items){
        if (err)  cb(err,null);
        async.forEachSeries(items, function(item, callback) { //The second argument (callback) is the "task callback" for a specific messageId
            item.isAvailableForCheckout(borrowername, function(co_err){
                if (!co_err) {
                    callback(null,null);
                } else {
                    inventory.push(item);
                    callback(null,item);
                }
            });
        }, function(err) {  // should be array of items that didn't return error
            cb(null,inventory);
        });
    });

};

exports.schema = itemSchema;