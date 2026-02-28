const supabase = require("../config/supabase");

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const { data, error } = await supabase
      .from("messages")
      .insert([{
        sender_id: req.user.id,
        receiver_id: receiverId,
        message
      }])
      .select()
      .single();

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Conversation
exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const myId = req.user.id;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
     .or(`and(sender_id.eq.${myId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${myId})`)
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};