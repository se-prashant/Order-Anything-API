const mongoose = require("mongoose");

// const addressSchema = new Schema({ name: String });
const catalogueSchema = new mongoose.Schema ({
  name:{
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  addresses:{
    type:Array,
    required:true
  }
});


module.exports = new mongoose.model('catelogue', catalogueSchema);
