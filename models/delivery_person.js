const mongoose = require("mongoose");


const deliveryPersonSchema = new mongoose.Schema ({
  mobile: {
    type: Number,
    min: 1000000000,
    max: 9999999999,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required:true
  },
  order_id: mongoose.ObjectId,
});




module.exports = new mongoose.model("shipper", deliveryPersonSchema);
