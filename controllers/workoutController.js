const supabase = require("../config/supabase");
const {
  calculateBMI,
  weightLossFromCalories,
  estimateDaysToTarget
} = require("../utils/bmiUtils");

exports.addWorkout = async (req, res) => {
  try {
    const { workoutType, duration, caloriesBurned, distance } = req.body;

    // Insert workout
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .insert([{
        user_id: req.user.id,
        workout_type: workoutType,
        duration,
        calories_burned: caloriesBurned,
        distance: distance || 0
      }])
      .select()
      .single();

    if (workoutError) throw workoutError;
    await supabase.from("activity_logs").insert([{
    user_id: req.user.id,
    action: "Added workout"
    }]);

    // Get all workouts of user
    const { data: workouts, error: workoutsError } = await supabase
      .from("workouts")
      .select("calories_burned")
      .eq("user_id", req.user.id);

    if (workoutsError) throw workoutsError;

    const totalCalories = workouts.reduce(
      (sum, w) => sum + (w.calories_burned || 0),
      0
    );

    const weightLoss = weightLossFromCalories(totalCalories);

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    const updatedWeight = Math.max(user.target_weight, user.weight - weightLoss);
    const currentBMI = calculateBMI(updatedWeight, user.height);
    const targetBMI = calculateBMI(user.target_weight, user.height);

    const totalWorkoutDays = workouts.length || 1;
    const avgDailyCalories = totalCalories / totalWorkoutDays;
    
    
    const estimatedDays = estimateDaysToTarget(
      updatedWeight,
      user.target_weight,
      avgDailyCalories
    );

    res.json({
      workout,
      totalCalories,
      weightLoss,
      currentBMI,
      targetBMI,
      estimatedDays
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
 
};
exports.getAllWorkouts = async (req, res) => {
  try {
    const { data: workouts, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.json(workouts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};