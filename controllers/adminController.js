const supabase = require("../config/supabase");

// //GetAllUsers
// exports.getAllUsers = async (req, res) => {
//   const { data, error } = await supabase
//     .from("users")
//     .select("id, name, email, role, profile_completed, created_at");

//   if (error) return res.status(500).json({ error: error.message });

//   res.json(data);
// };

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};


// UPDATE USER ROLE
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Role updated" });
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "User deleted" });
};

//SignupAnalytics
exports.getSignupAnalytics = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("created_at");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

//Engagement Analytics
exports.getEngagementAnalytics = async (req, res) => {
  res.json({
    activeUsers: 120,
    workoutsCompleted: 540,
    challengesJoined: 78,
  });
};
// //ActivityLog
exports.getActivityLogs = async (req, res) => {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

//Create Gym

exports.createGym = async (req, res) => {
  try {
    const { name, city, address, latitude, longitude } = req.body;

    const { data, error } = await supabase
      .from("gyms")
      .insert([{ name, city, address, latitude, longitude }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ALL GROUPS
exports.getAllGroups = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("*");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE GROUP
exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//getAllChallenges

exports.getAllChallenges = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//deleteChallenge

exports.deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("challenges")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Challenge deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GetAllGyms // GetAllGyms


exports.getAllGyms = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("gyms")
      .select("*");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Delete gym

exports.deleteGym = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("gyms")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Gym deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//AdminDashBoardSummary

// exports.getAdminDashboardSummary = async (req, res) => {
//   try {
//     const { count: userCount } = await supabase
//       .from("users")
//       .select("*", { count: "exact", head: true });

//     const { count: workoutCount } = await supabase
//       .from("workouts")
//       .select("*", { count: "exact", head: true });

//     const { count: challengeCount } = await supabase
//       .from("challenges")
//       .select("*", { count: "exact", head: true });

//     const { count: gymCount } = await supabase
//       .from("gyms")
//       .select("*", { count: "exact", head: true });

//     res.json({
//       totalUsers: userCount,
//       totalWorkouts: workoutCount,
//       totalChallenges: challengeCount,
//       totalGyms: gymCount
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.getAdminDashboardSummary = async (req, res) => {
  try {
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: totalWorkouts } = await supabase
      .from("workouts")
      .select("*", { count: "exact", head: true });

    const { count: totalGroups } = await supabase
      .from("groups")
      .select("*", { count: "exact", head: true });

    const { count: totalChallenges } = await supabase
      .from("challenges")
      .select("*", { count: "exact", head: true });

    const { count: totalBuddies } = await supabase
      .from("buddies")
      .select("*", { count: "exact", head: true });

    const { count: activeUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("profile_completed", true);

    res.json({
      totalUsers,
      totalWorkouts,
      totalGroups,
      totalChallenges,
      totalBuddies,
      activeUsers
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= USERS =================

exports.getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        name,
        email,
        role,
        profile_completed,
        created_at
      `);

    if (error) throw error;

    // Get workout count per user
    const usersWithStats = await Promise.all(
      data.map(async (user) => {
        const { count } = await supabase
          .from("workouts")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompleted: user.profile_completed,
          createdAt: user.created_at,
          lastActive: "Recently",
          workoutsCount: count || 0,
        };
      })
    );

    res.json(usersWithStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= GYMS =================

exports.getAllGyms = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("gyms")
      .select("*");

    if (error) throw error;

    const formatted = data.map(gym => ({
      id: gym.id,
      name: gym.name,
      location: `${gym.city}, ${gym.address}`,
      members: gym.members_count || 0,
      status: gym.status || "active",
      createdAt: gym.created_at,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= CHALLENGES =================

exports.getAllChallenges = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*");

    if (error) throw error;

    const formatted = data.map(ch => ({
      id: ch.id,
      title: ch.title,
      participants: ch.participants_count || 0,
      duration: ch.duration || "N/A",
      status: ch.status || "active",
      createdAt: ch.created_at,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= GROUPS =================

exports.getAllGroups = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("*");

    if (error) throw error;

    const formatted = data.map(group => ({
      id: group.id,
      name: group.name,
      members: group.members_count || 0,
      category: group.category || "General",
      createdAt: group.created_at,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= DASHBOARD SUMMARY =================

exports.getAdminDashboardSummary = async (req, res) => {
  try {
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: totalGyms } = await supabase
      .from("gyms")
      .select("*", { count: "exact", head: true });

    const { count: totalChallenges } = await supabase
      .from("challenges")
      .select("*", { count: "exact", head: true });

    const { count: totalGroups } = await supabase
      .from("groups")
      .select("*", { count: "exact", head: true });

    res.json({
      totalUsers,
      totalGyms,
      totalChallenges,
      totalGroups,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};