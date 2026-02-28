const supabase = require("../config/supabase");

// =============================
// GET GYMS (By City)
// =============================
exports.getGyms = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const { data, error } = await supabase
      .from("gyms")
      .select("*")
      .ilike("city", `%${city}%`);

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};