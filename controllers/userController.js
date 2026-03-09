const supabase = require("../config/supabase");

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      targetWeight,
      location,
      fitnessGoals,
      preferredWorkouts
    } = req.body;

    const profileCompleted =
  height != null &&
  weight != null &&
  targetWeight != null &&
  location != null;

//   console.log({
//   age,
//   gender,
//   height,
//   weight,
//   targetWeight,
//   location,
//   fitnessGoals,
//   preferredWorkouts,
//   profileCompleted
// });

    const { data, error } = await supabase
      .from("users")
      .update({
        age,
        gender,
        height,
        weight,
        target_weight: targetWeight,
        location,
        fitness_goals: fitnessGoals,
        preferred_workouts: preferredWorkouts,
        profile_completed: profileCompleted
      })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: "Profile updated successfully",
      profileCompleted: data.profile_completed,
      user: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
  const { data } = await supabase
    .from("users")
    .select("id, name, email, role");

  res.json(data);
};

// // Find Matches
// exports.findMatches = async (req, res) => {
//   try {
//     const { data: currentUser } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", req.user.id)
//       .single();

//     const { data: users } = await supabase
//       .from("users")
//       .select("*")
//       .neq("id", req.user.id)
//       .eq("profile_completed", true)
//       .eq("location", currentUser.location);

//     const matches = users.filter(user =>
//       user.fitness_goals?.some(goal =>
//         currentUser.fitness_goals?.includes(goal)
//       ) &&
//       user.preferred_workouts?.some(workout =>
//         currentUser.preferred_workouts?.includes(workout)
//       )
//     );

//     res.json(matches);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// Add Buddy
// exports.addBuddy = async (req, res) => {
//   try {

//     if (buddyId === req.user.id) {
//   return res.status(400).json({ message: "Cannot add yourself" });
// }
//     const buddyId = req.params.id;

//     const { data: existing } = await supabase
//       .from("buddies")
//       .select("*")
//       .eq("user_id", req.user.id)
//       .eq("buddy_id", buddyId)
//       .single();

//     if (existing)
//       return res.status(400).json({ message: "Already added" });

//     const { error } = await supabase
//       .from("buddies")
//       .insert([{
//         user_id: req.user.id,
//         buddy_id: buddyId
//       }]);

//     if (error) throw error;

//     res.json({ message: "Buddy added successfully" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.addBuddy = async (req, res) => {
  try {
    const buddyId = req.params.id;

    if (buddyId === req.user.id) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }

    const { data: existing, error: checkError } = await supabase
      .from("buddies")
      .select("*")
      .or(`and(user_id.eq.${req.user.id},buddy_id.eq.${buddyId}),and(user_id.eq.${buddyId},buddy_id.eq.${req.user.id})`);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "Already added" });
    }

    const { error } = await supabase
      .from("buddies")
      .insert([
        {
          user_id: req.user.id,
          buddy_id: buddyId
        }
      ]);

    if (error) throw error;

    res.json({ message: "Buddy added successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GetBuddies
exports.getMyBuddies = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("buddies")
      .select(`
        buddy_id,
        users!buddies_buddy_id_fkey (
          id,
          name,
          email,
          location,
          fitness_goals,
          preferred_workouts
        )
      `)
      .eq("user_id", req.user.id);

    if (error) throw error;

    const buddies = data.map(item => item.users);

    res.json(buddies);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.removeBuddy = async (req, res) => {
  try {
    const buddyId = req.params.id;

    const { error } = await supabase
      .from("buddies")
      .delete()
      .eq("user_id", req.user.id)
      .eq("buddy_id", buddyId);

    if (error) throw error;

    res.json({ message: "Buddy removed" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getSuggestedBuddies = async (req, res) => {
  try {

    const { data: currentUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    const { data: users } = await supabase
      .from("users")
      .select("*")
      .neq("id", req.user.id)
      .eq("profile_completed", true);

    const matches = users.filter(user => {

      const sameGoal = user.fitness_goals?.some(goal =>
        currentUser.fitness_goals?.includes(goal)
      );

      const sameWorkout = user.preferred_workouts?.some(workout =>
        currentUser.preferred_workouts?.includes(workout)
      );

      const sameLocation = user.location === currentUser.location;

      return sameGoal || sameWorkout || sameLocation;

    });

    res.json(matches);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};