module.exports = (sequlize, DataTypes) => {
  const User = sequlize.define("User", {
    name: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image: DataTypes.STRING(100),
    token: {
      type: DataTypes.STRING(1000),
    },
    tokenExp: {
      type: DataTypes.INTEGER,
    },
  });
  return User;
};
