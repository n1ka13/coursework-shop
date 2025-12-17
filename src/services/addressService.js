const MyError = require("../errors/MyError");
const crud = require("../repositories/crud");

exports.createAddress = async (data) => {
    const address = await crud.create("address", data);
    if (!address) throw new MyError("Failed to create address", 500);
    return address;
};

exports.getClientAddresses = async (clientId) => {
    const addresses = await crud.getAll("address", { where: { client_id: Number(clientId) } });
    if (!addresses) throw new MyError("Addresses not found", 404);
    return addresses;
};