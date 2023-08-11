const Plan = require("../Model/plans");

exports.addPlan = (req, res) => {
  const { name, monthlyPrice, yearlyPrice, videoQuality, resolution, devices } =
    req.body;

  const plan = new Plan({
    name,
    monthlyPrice,
    yearlyPrice,
    videoQuality,
    resolution,
    devices,
  });

  plan
    .save()
    .then(() => {
      return res.status(200).json({ Message: "Plan added successfully" });
    })
    .catch((error) => {
      return res.status(401).send("Error while adding the new plan");
    });
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    return res.status(200).json(plans);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching plans" });
  }
};
