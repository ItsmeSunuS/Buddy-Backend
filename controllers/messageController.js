const supabase = require("../config/supabase");


// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, message } = req.body;

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: req.user.id,
          receiver_id: receiver_id,
          message: message
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
// Get Conversation
exports.getConversation = async (req, res) => {
  try {

    const buddyId = req.params.id;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${req.user.id},receiver_id.eq.${buddyId}),and(sender_id.eq.${buddyId},receiver_id.eq.${req.user.id})`)
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};