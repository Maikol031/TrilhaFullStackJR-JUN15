import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PictureSchema = new Schema({
    name: {type: String, require: true},
    description: {type: String, require: true},
    src: {type: String, require: true},
});

export default mongoose.model("Picture", PictureSchema);

