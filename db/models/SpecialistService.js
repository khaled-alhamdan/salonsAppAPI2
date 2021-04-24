module.exports = (sequelize, DataTypes) => {
  const SpecialistServices = sequelize.define("SpecialistServices", {
    salonId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serviceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return SpecialistServices;
};
