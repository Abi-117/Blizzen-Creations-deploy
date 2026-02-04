import Landing from "../models/Landing.js";

/* GET landing content */
export const getLanding = async (req, res) => {
  const data = await Landing.findOne();
  res.json(data);
};

/* CREATE / UPDATE (Admin save) */
export const saveLanding = async (req, res) => {
  let landing = await Landing.findOne();

  if (landing) {
    landing.set(req.body);
    await landing.save();
  } else {
    landing = await Landing.create(req.body);
  }

  res.json({ success: true, landing });
};
