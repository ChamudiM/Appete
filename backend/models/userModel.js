import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    currentLocation:{
        type: {
            type: String,
            enum: ['Point'],
            //required: true
        },
        coordinates: {
            type: [Number],
            //required: true
        }
    }
},{timeseries: true}); //the time of creation and the time of edit
userSchema.index({ currentLocation: '2dsphere'});
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User',userSchema);

export default User;