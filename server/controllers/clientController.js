const Client = require("../models/Client");

exports.createClient = async (req, res) => {
  const client = await Client.create({ ...req.body, user: req.user });
  res.json(client);
};

exports.getClients = async (req, res) => {
  const clients = await Client.find({ user: req.user });
  res.json(clients);
};

exports.updateClient = async (req, res) => {
  const client = await Client.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  res.json(client);
};

exports.deleteClient = async (req, res) => {
  await Client.findOneAndDelete({ _id: req.params.id, user: req.user });
  res.json({ message: "Client deleted" });
};
