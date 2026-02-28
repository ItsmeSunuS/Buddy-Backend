exports.calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;

  // Convert height from cm to meters if needed
  const heightInMeters = height > 3 ? height / 100 : height;

  return +(weight / (heightInMeters * heightInMeters)).toFixed(2);
};

exports.weightLossFromCalories = (calories) => {
  if (!calories) return 0;
  return +(calories / 7700).toFixed(2);
};

exports.estimateDaysToTarget = (
  currentWeight,
  targetWeight,
  avgDailyCalories
) => {
  if (!currentWeight || !targetWeight || avgDailyCalories <= 0)
    return 0;

  const weightToLose = currentWeight - targetWeight;

  if (weightToLose <= 0) return 0;

  const caloriesNeeded = weightToLose * 7700;

  return Math.ceil(caloriesNeeded / avgDailyCalories);
};