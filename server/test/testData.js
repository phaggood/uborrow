module.exports = {

    "cabinetData": {

        newCabinet : {
            name:  "A new cabinet",
            description: "Some remote cabinet",
            authorizedBorrowers : ["imatest","imanothertest"]
        },

        cabinet1 : {
            name:  "Garden Cabinet",
            description: "Some remote cabinet",
            authorizedBorrowers : ["imatest"]
        },
        cabinet2 : {
            name:  "Lobby Locker",
            description: "UM Detroit Center Locker",
            authorizedBorrowers : ["imanothertest"]
        },
        cabinet3 : {
            name:  "Matthaei Garden Cabinet",
            description: "Utility cabinet at Matthei Garden",
            authorizedBorrowers : ["imatest","imanothertest"]
        }
    },

    "itemData" : {

        borrowers : {
            borrower1 : "imatest",
            borrower2 : "imanothertest",
            borrower3 : "yetanothertest"

        },


        inactiveTrialItem : {
            name:"moisture meter",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            inactiveDate : new Date(new Date().setDate(new Date().getDate()-2))
        },

        reservedTrialItem : {
            name:"watering can",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList:["someotheruser"]
        },

        checkedOutTrialItem : {
            name:"measuring tape",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            currentCheckout:"yetanothruser",
            waitList:["someotheruser"]
        },

        availableTrialItem1 : {
            name:"Solar Detector",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        },

        availableTrialItem2 : {
            name:"Metal Scanner",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        },

        availableTrialItem3 : {
            name:"Rock Hammer",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        }

    }
};
