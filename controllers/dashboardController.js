const supabase = require("../config/supabase");
const { calculateBMI } = require("../utils/bmiUtils");

exports.getDashboardSummary = async (req, res) => {
  try {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    const { data: workouts } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", req.user.id);

    const totalWorkouts = workouts.length;

    // const totalCalories = workouts.reduce(
    //   (sum, w) => sum + w.calories_burned,
    //   0
    // );
    const totalCalories = workouts.reduce(
  (sum, w) => sum + (w.calories_burned || 0),0);
    const currentBMI = calculateBMI(user.weight, user.height);

    res.json({
      user: {
        name: user.name,
        weight: user.weight,
        height: user.height
      },
      stats: {
        totalWorkouts,
        totalCalories,
        currentBMI
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  if (!user) {
  return res.status(404).json({ message: "User not found" });
}
};