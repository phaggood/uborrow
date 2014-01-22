module.exports = {
    "itemNotFound" : "Item not found",
    "itemAlreadyCheckedOut" : "Item currently checked out",
    "ItemPrevioslyReserved" : "Item reserved by other borrower",
    "ItemNotActive" : "Item is not active",
    "borrowerNotAuthorized" : "Borrower is not authorized",
    "cabinetInactive" : "Cabinet not active",
    "cabinetNotFound" : "Cabinet Not Found",
    "badItemRequest" : "Action not found",
    err : function(msg){
        return new Error({"message": msg});
    }
};