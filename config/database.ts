import config from "config";
import { connect } from "mongoose";

const connectDB = async () => {  
  try {
    const mongoURI: string = config.get("mongoURI") 
    //const nameDb = config.get("nameDb")
    console.log("mongoURI =>", config.get("mongoURI"))
    await connect(mongoURI).then(dbName => {      
      console.log("MongoDB Connected...", dbName.connection.name)
    });
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;