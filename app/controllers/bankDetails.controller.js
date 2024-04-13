const BankDetails = require("../models").bankDetails;

exports.addBankDetails = (req, res) => {
  const { userId } = req.params;
  const { accountNumber, branchName, ifscCode, accountHolderName } = req.body;
  if (
    !accountNumber ||
    !branchName ||
    !ifscCode ||
    !accountHolderName ||
    !userId
  ) {
    console.log("accountDetailsInfo", {
      accountNumber,
      branchName,
      ifscCode,
      accountHolderName,
      userId,
    });
    res.status(400).send({ message: "All fields are required!" });
    return;
  }
  BankDetails.create({
    userId,
    accountNumber,
    branchName,
    ifscCode,
    accountHolderName,
  })
    .then((bankDetails) => {
      res.send({
        message: "Bank details added successfully",
        data: bankDetails,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
