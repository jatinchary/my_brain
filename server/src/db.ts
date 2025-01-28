import mongoose, {model , Schema , Types} from "mongoose";

export async function ConnectDB (){
    try {
       await mongoose.connect("mongodb+srv://charyjatin:pHw767DPKYZmUaVf@cluster0.x8c9c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("connected succesfully");
        
    } catch (error) {
        console.log(`fat gaya ${error}`);
        
    }
}
const UserSchema = new Schema({
    username: { type:String , unique: true } ,
    password: String
})


export const UserModel = model ("User" , UserSchema );

const contentTypes = ['image', 'video', 'document', 'audio']; 

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: String }],
  userId: { type: Types.ObjectId, ref: 'User', required: true },
});

export const ContentModel = model ("Content" , contentSchema);


const linkSchema = new Schema({
    hash:{type:String ,require:true },
    userId:{type:Types.ObjectId , ref:'User', require:true , unique:true}
})

export const linkModel = model("Link",linkSchema);


// const tagSchema = new mongoose.Schema({
//     title: { type: String, required: true, unique: true }
//   });

//   export const tagModel = model("Tags",tagSchema);
  
