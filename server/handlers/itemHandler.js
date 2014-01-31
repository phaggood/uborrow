//http://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module
var errorsMsgs = require('../errors');

module.exports = function (Item) {

    var module = {};

    // return all in cabinet
    module.getItemById = function(req,res) {
        Item.findById(req.params.id,function(err,item){
            if (err) res.json(401,err);
            res.json(200,item);
        })
    };

    module.processItem = function(req,res){
        var action = req.body.action;

        if (action==="add"){
            //console.log("\nHEADERS - item:" + req.body.item + " action:" + req.body.action)
            //console.log("ADDING ITEM");
            Item.createItem(req.body.item, function(err,item){
                if (err) return res.json(401,err);
                res.json(202,item);
            })
        }

        if (action==="close"){
            Item.deactivate(req.body.itemid, req.body.closeDate, function(err,item){
                if (err) return res.json(401,err);
                res.json(202,item);
            })
        }

        if (action === undefined) {
            res.json(400,errorsMsgs.badItemRequest);
        }
    }


    module.processCabinetItem = function(req,res){
        var action = req.body.action;
        //console.log("action " + req.body.action + " id " + req.body.itemid);
        if (action==="checkin"){
            Item.checkin(req.body.itemid, function(err,item){
                if (err) return res.json(401,err);
                res.json(202,item);
            })
        }

        if (action==="checkout"){
            Item.checkout(req.body.itemid, req.body.borrower,function(err,item){
                if (err) return res.json(401,err);
                res.json(202,item);
            })
        }

        if (action==="reserve"){
            Item.addBorrowerToWaitList(req.body.itemid, req.body.borrower,function(err,item){
                if (err) return res.json(401,err);
                res.json(202,item);
            })
        }

        if (action==="add"){
            Item.addItemToCabinet(req.body.itemid, req.params.cabinetid,function(err,item){
                if (err) return res.json(401,err);
                res.json(202,item);
            })
        }

        if (action === undefined) {
            res.json(400,errorsMsgs.badItemRequest);
        }

    }

    module.getCabinetItems = function(req,res){
        var cabinetId = req.params.cabinetid;

        // return items via availability toggle
        if (req.query.available != undefined){
            if (req.query.available==="true"){
                Item.availableForCheckout(cabinetId, req.query.borrower,function(err,items){
                    if (err) res.json(401,err);
                    res.json(200,items);
                })
            } else {
                Item.unavailableForCheckout(cabinetId, req.query.borrower,function(err,items){
                    if (err) res.json(401,err);
                    res.json(200,items);
                })
            }
        }

        // default, return all cabinet items
        Item.find({cabinet:cabinetId},function(err,items){
            if (err) res.json(401,err);
            res.json(200,items);
        })
    }


    return module;
};