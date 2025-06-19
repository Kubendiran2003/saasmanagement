const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

router.use(protect);
router.route("/").post(createClient).get(getClients);
router.route("/:id").put(updateClient).delete(deleteClient);

module.exports = router;
