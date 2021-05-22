const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name:String,
  quantity:Number
})
const orderSchema = new mongoose.Schema ({
  items : [itemSchema],
  order_status:String,
  customer_id: mongoose.ObjectId,
  pickup_loc:Array
});



module.exports = new mongoose.model("order", orderSchema);
