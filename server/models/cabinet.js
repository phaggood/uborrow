var errorMsgs = require('../errors');
var mongoose = require('mongoose')
    ,Schema = mongoose.Schema
    ,Mixed = Schema.Types.Mixed
    ,ObjectId = Schema.ObjectId;


var cabinetSchema = new Schema({
    name:  String,
    description: String,
    owner : String,
    thumbnail : Buffer,
    authorizedBorrowers : [],
    defaultCheckout : {type : Number, default: 0} // default checkout mins = no time

});

var hasBorrower = function(cabinet, borrower){
    if (cabinet===null) return false;
    if (cabinet.authorizedBorrowers.length === 0) return false;
    return (cabinet.authorizedBorrowers.indexOf(borrower) >= 0)
}

cabinetSchema.statics.isAuthorizedBorrower = function(cabinet_id, borrowername, cb ){
    this.findOne({_id: cabinet_id}, function(err, cabinet){
        if (err) cb(err,null);
        if (!hasBorrower(cabinet, borrowername))  cb(new Error(errorMsgs.borrowerNotAuthorized),null);
        cb(null,borrowername);
    });
};

cabinetSchema.statics.deauthorizeBorrower = function(cabinet_id, borrowername, cb ){
    this.findOne({_id: cabinet_id}, function(err, cabinet){
        if (err) cb(err,null);
        if (hasBorrower(cabinet, borrowername)==true) {
            var pos = cabinet.authorizedBorrowers.indexOf(borrowername);
            cabinet.authorizedBorrowers.splice(pos, 1);
            cabinet.save(function (err, new_cabinet){
                if (err) cb(err,null);
                cb(null,new_cabinet.authorizedBorrowers);
            })
        }
    });
};

cabinetSchema.statics.authorizeBorrower = function(cabinet_id, borrowername, cb ){
    this.findOne({_id: cabinet_id}, function(err, cabinet){
        if (err) cb(err,null);
        if (hasBorrower(cabinet, borrowername)==false) {
            cabinet.authorizedBorrowers.push(borrowername);
            cabinet.save(function (err, new_cabinet){
                if (err) {
                    cb(err,null);
                }
                cb(null,new_cabinet.authorizedBorrowers);
            })
        }
    });
};

cabinetSchema.statics.newCabinet = function(newCab, cb ){
    var cabinetModel = this.model("Cabinet");
    new cabinetModel(newCab).save( function (err, cabinet){
        if (err)  {
            cb(err, null);
        }
        cb(null,cabinet);
    });
};

cabinetSchema.statics.isAuthorizedBorrower = function(cabinet_id, borrowername, cb ){
    this.findOne({_id: cabinet_id}, function(err, cabinet){
        if (err) cb(err,null);
        if (!hasBorrower(cabinet, borrowername))  {
            cb(new Error(errorMsgs.borrowerNotAuthorized),null);
            return;
        }
        cb(null,borrowername);
    });
};

exports.schema = cabinetSchema;
