const User = require("../models/User");

module.exports.account = async (req, res) => {
  const userId = req.session.userId;
  try {
    const user = await User.findOne({ _id: userId });
    return res.json({ name: user.name, email: user.email, country: user.country });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.savePreferences = async (req, res) => {
  const userBody = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email: userBody.email },
      { $set: { name: userBody.name, email: userBody.email, country: userBody.country } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Preferences updated", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
