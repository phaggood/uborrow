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
            name:"General Tools MMD4E Digital Moisture Meter",
            description: "Generals ultra-sensitive Digital Moisture Meter easily detects hidden leaks in wood, concrete, plaster and carpet. Providing accurate moisture level readings make this moisture meter great for new home inspections, locating roof leaks or even selecting dry lumber at the yard. Ideal to use in woodworking, building construction, agriculture restoration and floor-laying. Used to check wood, drywall and concrete before painting, sealing or treating and locate and identify water leaks in roofs, floors and walls. Features LED display, wide measuring range, strong stainless steel pins, audible alarms and battery status indication. Display will show the moisture content in Percent Moisture Content directly. Ergonomically designed and CE approved.",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            inactiveDate : new Date(new Date().setDate(new Date().getDate()-2))
        },

        reservedTrialItem : {
            name:"Fiskars Pottery 20-47287 Fiskars Easy-Pour 2.6 Gallon Watering Can - 20-47287",
            description: "Easy-Pour Watering holds 2.6-Gallon. Easy to carry and pour because of unique handle design. Dual handles accomodate multiple hand postions. Spout rotates for adjustable flow control, from a gentle shower to a steady stream. Filling hole is located on the side so the handles don't get in the way.",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList:["someotheruser"]
        },

        checkedOutTrialItem : {
            name:"Komelon 4912IM The Professional 12-Foot Inch/Metric Scale Power Tape, Yellow",
            description: "12 ft./3.5m x 5/8-inch, 16ft./5m x 3/4-inch, 25ft./7.5m x 1-inch, and 30ft./9m x 1-inch tape measures.",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            currentCheckout:"yetanothruser",
            waitList:["someotheruser"]
        },

        availableTrialItem1 : {
            name:"NORLAKE 119958 Solar Thermometer, 8' Lead Sensor",
            description: "119958, THERMOMETER SOLAR WITH 8 FOOT SENSOR LEAD. Norlake Genuine OEM replacement part. Norlake has become a leader in high-quality refrigeration for the commercial foodservice operating. Use genuine OEM parts for safety reliability and performance.",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        },

        availableTrialItem2 : {
            name:"Garrett Ace 150 Metal Detector",
            description: "Introducing the ALL-NEW Garrett ACE series - not just a new line of detectors, but a new way of thinking. We've taken much of the leading edge technology and well thought-out features from our GTI and GTAx lines and packaged them into the most aggressive, rugged outdoor design in the industry. These attention-stealing detectors are turning heads and sending the competition back to the drawing board. But put aside their aggressive good looks and you'll see just how much amazing technology we've packed into these NEW machines. From custom notch discrimination, pinpointing, adjustable sensitivity and depth settings to the newest addition of the Performance coils series, the 6.5x9 ACE coil, these detectors will never stop impressing you - or finding treasure",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        },

        availableTrialItem3 : {
            name:"SE 8399-RH-ROCK 11-Inch Rock Pick Hammer",
            description: "Brand new 20 oz. Rock Pick Hammer. This heavy, well balanced hammer has a rubberized hammer for a comfortable grip. This hammer is made of a single-Piece of drop forged metal.",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        },

        availableTrialItem4 : {
            name:"Fiskars 9667 Garden Spade",
            description: "Impress the relatives by referring to it as your Ladies Spade. Ideal for digging over a vegetable border, creating a trench or slicing through turf. Not very lady like when it comes to prying out rocks and smashing large clods because it handles those chores with reckless abandon. The oversized D-Handle provides ample space for both hands and a variety of hand positions. Bigger step for more digging power and a teardrop shaped shaft for more hand comfort. Shovel blade is welded to the shaft for additional strength. Powder-coated steel prevents rust and is easy to clean. Lifetime warranty",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        },

        availableTrialItem5 : {
            name:"G & F Women's Garden Gloves, 6 Pair Pack, assorted colors. Women's Large(Pack of 6)",
            description: "Women's Garden Gloves - 6-Pair. Nitrile Coated Knit Gloves for wet and muddy gardening conditions.Includes: pink, purple and green",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        },

        availableTrialItem6 : {
            name:"Radius Garden 203 PRO Ergonomic Stainless Steel Digging Fork",
            description: "Discover garden tools unlike any you've ever held before. The Radius Garden Natural Radius Grip PRO Digging Fork #203 was designed using the most current research into human factors and tool usage. The patent-pending, Natural Radius Grip, maximizes your power and comfort while minimizing hand and wrist stress. Traditional garden tools force you to use your hands and wrists in a way that can cause injuries.",
            availableDate : new Date(new Date().setDate(new Date().getDate()-10)),
            waitList : []
        }

    }
};
