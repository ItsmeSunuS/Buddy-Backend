const supabase = require("../config/supabase");

// Create Challenge
exports.createChallenge = async (req, res) => {
  try {
    const { title, description, goalType, targetValue, startDate, endDate } = req.body;

    const { data, error } = await supabase
      .from("challenges")
      .insert([{
        title,
        description,
        goal_type: goalType,
        target_value: targetValue,
        start_date: startDate,
        end_date: endDate,
        created_by: req.user.id
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Join Challenge
exports.joinChallenge = async (req, res) => {
  try {

    const challengeId = req.params.id;
    const userId = req.user.id;

    const { error } = await supabase
      .from("challenge_participants")
      .insert([{
        challenge_id: challengeId,
        user_id: userId,
        progress: 0
      }]);
// .insert({
//   challenge_id: challengeId,
//   user_id: userId,
//   progress: 0
// }, { upsert: true })
    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({ message: "Already joined this challenge" });
      }
      throw error;
    }

    res.json({ message: "Joined challenge successfully" });

  } catch (err) {
    console.error("Join challenge error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Update Progress
exports.updateProgress = async (req, res) => {
  try {
    const challengeId = req.params.id;

   const { data: challenge, error: challengeError } = await supabase
  .from("challenges")
  .select("*")
  .eq("id", challengeId)
  .single();

if (challengeError) throw challengeError;
   const { data: workouts, error: workoutError } = await supabase
  .from("workouts")
  .select("*")
  .eq("user_id", req.user.id)
  .gte("date", challenge.start_date)
  .lte("date", challenge.end_date);

if (workoutError) throw workoutError;


   let total = 0;

if (challenge.goal_type === "calories") {
  total = workouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0);
} else if (challenge.goal_type === "duration") {
  total = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
} else if (challenge.goal_type === "distance") {
  total = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
}
    await supabase
      .from("challenge_participants")
      .update({ progress: total })
      .eq("challenge_id", challengeId)
      .eq("user_id", req.user.id);

    const percentage = Math.min(
      (total / challenge.target_value) * 100,
      100
    );

    res.json({
      progress: total,
      percentage
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//  Get Challenge Details (INCLUDING PARTICIPANTS)
exports.getChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id;

    const { data, error } = await supabase
      .from("challenges")
      .select(`
        *,
        challenge_participants (
          user_id,
          progress
        )
      `)
      .eq("id", challengeId)
      .single();

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllChallenges = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select(`
        *,
        challenge_participants (
          user_id,
          progress
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  