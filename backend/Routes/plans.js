const express = require("express");
const router = express.Router();
const { isSignIn, isAdmin, isAuthenicated } = require("../Controller/auth");
const { getPlans, addPlan } = require("../Controller/plans");

// route to add a plan
router.post("/addplan", addPlan);

//route for get all plans
router.get("/getplans",  getPlans);

module.exports = router;