const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PhonepePaymentLog = sequelize.define("PhonepePaymentLog", {
    merchantId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    merchantTransactionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    responseCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentInstrumentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardType: {
      type: DataTypes.STRING,
    },
    pgTransactionId: {
      type: DataTypes.STRING,
    },
    bankTransactionId: {
      type: DataTypes.STRING,
    },
    pgAuthorizationCode: {
      type: DataTypes.STRING,
    },
    arn: {
      type: DataTypes.STRING,
    },
    bankId: {
      type: DataTypes.STRING,
    },
    brn: {
      type: DataTypes.STRING,
    },
  });

  return PhonepePaymentLog;
};
