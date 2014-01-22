//http://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module
var errorsMsgs = require('../errors');

module.exports = function (Cabinet) {

    var module = {};

    module.getCabinets = function(req,res) {
        Cabinet.find({},function(err,cabinets){
            if (err) res.json(401,err);
            res.json(200,cabinets);
        })
    };

    module.getCabinetById = function(req,res){
        Cabinet.findById(req.params.id, function(err,cabinet){
            if (err) res.json(401,errorsMsgs.cabinetNotFound);
            res.json(200,cabinet);
        })
    };

    module.processCabinet = function(req,res) {
        var action = req.body.action;

        if (action==="add"){
            Cabinet.newCabinet(req.body.cabinet,function(err,cabinet){
                if (err) return res.json(401,err);
                res.json(201,cabinet);
            })
        }

        if (action==="revoke"){
            Cabinet.deauthorizeBorrower(req.body.cabinetid, req.body.borrower,function(err,authorizedBorrowers){
                if (err) return res.json(401,err);
                res.json(202,authorizedBorrowers);
            })
        }

        if (action==="grant"){
            Cabinet.authorizeBorrower(req.body.cabinetid, req.body.borrower, function(err,authorizedBorrowers){
                if (err) return res.json(401,err);
                res.json(202,authorizedBorrowers);
            })
        }

        if (action === undefined) {
            res.json(400,errorsMsgs.badItemRequest);
        }

    }


    return module;
};