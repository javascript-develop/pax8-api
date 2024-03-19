const express = require("express");
const {
  userRegister,
  userLogin,
  getAllUser,
  getAllAdvaiser,
  getAllOwner,
  getSingleUser,
  deleteUser,
  createAdmin,
  removeAdmin,
  cheackAdmin,
  cheackAdviser,
} = require("../controler/userControler");
const verifayToken = require("../utilities/verifayToken");
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/user", getAllUser);
router.get("/adviser", getAllAdvaiser);
router.get("/owner", getAllOwner);
router.get("/single/:id", getSingleUser);
router.delete("/delete/:id", deleteUser);
router.put("/admin/:email", verifayToken, createAdmin);
router.put("/remove/:email",verifayToken, removeAdmin);
router.get("/chackAdmin/:email", cheackAdmin);
router.get("/chackAdviser/:email", cheackAdviser);
module.exports = router;
