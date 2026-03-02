// const jwt = require("jsonwebtoken");
// const supabase = require("../config/supabase");

// exports.protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token)
//       return res.status(401).json({ message: "Not authorized" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const { data: user, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", decoded.id)
//       .single();

//     if (error || !user)
//       return res.status(401).json({ message: "Invalid token" });

//     req.user = user; // full user object

//     next();

//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    //  Verify custom JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Fetch full user from database
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    //  Attach DB user (with role)
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};