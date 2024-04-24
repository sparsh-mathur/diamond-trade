const BankDetails = require("../models").bank_details;

exports.addBankDetails = async (req, res) => {
  const { userId } = req.params;
  const { account_number, branch_name, ifsc_code, account_holder_name } =
    req.body;
  if (
    !account_number ||
    !branch_name ||
    !ifsc_code ||
    !account_holder_name ||
    !userId
  ) {
    res.status(400).send({ message: "All fields are required!" });
    return;
  }
  const bank_details = await BankDetails.findOne({
    where: { user_id: userId },
  });
  if (bank_details) {
    bank_details.account_number = account_number;
    bank_details.branch_name = branch_name;
    bank_details.ifsc_code = ifsc_code;
    bank_details.account_holder_name = account_holder_name;
    bank_details
      .save()
      .then((bankDetails) => {
        res.send({
          message: "Bank details updated successfully",
          data: bankDetails,
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
    return;
  }

  BankDetails.create({
    account_number,
    branch_name,
    ifsc_code,
    account_holder_name,
    user_id: userId,
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

exports.getBankDetails = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).send({ message: "User Id is required!" });
    return;
  }
  const bankDetails = await BankDetails.findOne({ where: { user_id: userId } });
  if (!bankDetails) {
    res.status(404).send({ message: "Bank details not found!" });
    return;
  }
  res.send(bankDetails);
};
