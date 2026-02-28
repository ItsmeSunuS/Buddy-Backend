exports.requireCompleteProfile = (req, res, next) => {
  if (!req.user.profile_completed) {
    return res.status(403).json({
      message: "Please complete your profile before accessing this feature."
    });
  }
  next();
};