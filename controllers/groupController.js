const supabase = require("../config/supabase");


// 
// CREATE GROUP
// 
exports.createGroup = async (req, res) => {
  try {
    const { name, description, goalType, targetValue, startDate, endDate } = req.body;

    const { data: group, error } = await supabase
      .from("groups")
      .insert([{
        name,
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

    // Add creator as first member
    const { error: memberError } = await supabase
      .from("group_members")
      .insert([{
        group_id: group.id,
        user_id: req.user.id,
        progress: 0
      }]);

    if (memberError) throw memberError;

    res.status(201).json(group);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// JOIN GROUP

// exports.joinGroup = async (req, res) => {
//   try {
//     const groupId = req.params.id;

//     // Check if already joined
//     const { data: existing } = await supabase
//       .from("group_members")
//       .select("*")
//       .eq("group_id", groupId)
//       .eq("user_id", req.user.id)
//       .single();

//     if (existing) {
//       return res.status(400).json({ message: "Already joined this group" });
//     }

//     const { data: members } = await supabase
//   .from("group_members")
//   .select("*")
//   .eq("group_id", groupId);

// if (members.length >= 5) {
//   return res.status(400).json({ message: "Group is full (max 5 members)" });
// } 

//     const { error } = await supabase
//       .from("group_members")
//       .insert([{
//         group_id: groupId,
//         user_id: req.user.id,
//         progress: 0
//       }]);

//     if (error) throw error;

//     res.json({ message: "Joined group successfully" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// JOIN GROUP


exports.joinGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    // Check if already joined (safe way)
    const { data: existing } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", groupId)
      .eq("user_id", req.user.id);

    if (existing && existing.length > 0) {
      return res.status(400).json({ message: "Already joined this group" });
    }

    // Check group size limit
    const { data: members, error: membersError } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", groupId);

    if (membersError) throw membersError;

    if (members.length >= 5) {
      return res.status(400).json({ message: "Group is full (max 5 members)" });
    }

    // Insert new member
    const { error } = await supabase
      .from("group_members")
      .insert([{
        group_id: groupId,
        user_id: req.user.id,
        progress: 0
      }]);

    if (error) throw error;

    res.json({ message: "Joined group successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// INCREMENT GROUP PROGRESS

exports.updateGroupProgress = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { progress } = req.body; // amount to add

    if (!progress || progress <= 0) {
      return res.status(400).json({ message: "Progress must be positive" });
    }

    // Get current progress
    const { data: member, error: fetchError } = await supabase
      .from("group_members")
      .select("progress")
      .eq("group_id", groupId)
      .eq("user_id", req.user.id)
      .single();

    if (fetchError) throw fetchError;

    const newProgress = (member.progress || 0) + progress;

    const { error } = await supabase
      .from("group_members")
      .update({ progress: newProgress })
      .eq("group_id", groupId)
      .eq("user_id", req.user.id);

    if (error) throw error;

    res.json({ message: "Progress updated", newProgress });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET GROUP DETAILS

exports.getGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    const { data, error } = await supabase
      .from("groups")
      .select(`
        *,
        group_members (
          user_id,
          progress
        )
      `)
      .eq("id", groupId)
      .single();

    if (error) throw error;

    // Calculate total combined progress
    const totalProgress = data.group_members.reduce(
      (sum, member) => sum + (member.progress || 0),
      0
    );

    res.json({
      ...data,
      totalProgress
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};