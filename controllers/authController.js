const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");


// Register
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const { data, error } = await supabase
//       .from("users")
//       .insert([{ name, email, password: hashedPassword }])
//       .select();

//     if (error) throw error;

//     res.status(201).json({ message: "User registered successfully" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
    
// // const { data, error } = await supabase
// //   .from("users")
// //   .insert([
// //     {
// //       name,
// //       email,
// //       password: hashedPassword,
// //       role: "user",
// //       profile_completed: false,
// //     },
// //   ])
// //   .select("*");   // <-- IMPORTANT CHANGE

// // if (error) throw error;

// // const newUser = data[0];   // <-- IMPORTANT CHANGE

// // res.status(201).json({
// //   token: generateToken(newUser.id),
// //   user: newUser,
// // });


//Regiser
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role: "user",
          profile_completed: false,
        },
      ])
      .select("*");

    if (error) throw error;

    const newUser = data[0];

    res.status(201).json({
      token: generateToken(newUser.id),
      user: {
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileCompleted: newUser.profile_completed,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//login

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const { data: user, error } = await supabase
//       .from("users")
//       .select("*")
//       .eq("email", email)
//       .single();

//     if (error || !user)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = generateToken(user.id);

//     res.json({ token, user });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

//Login 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    // Format user for frontend
    const formattedUser = {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileCompleted: user.profile_completed,
    };

    res.json({ token, user: formattedUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//token generation

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "10d" }
  );
};