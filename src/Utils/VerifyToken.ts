import * as jsonwebtoken from "jsonwebtoken";
import config from "config";


export const verifyToken = async (_token:any) =>{
    
    //console.log("auth => ", _token)
    const token1 = _token.split(' ')
   //console.log("token1 =>", token1)
    const token:any = token1[1]
    console.log("token =>", token)
    
    var err = null
    var response:any = null
    jsonwebtoken.verify(token, config.get("jwtSecret"), (errorToken:any, data:any) =>{
        console.log("errorToken", errorToken)
        if(errorToken) {
            err = errorToken
            return response
        }else{
            console.log("data =>", JSON.stringify(data))
            console.log("email => ", data.email)            
            response = data
        }       
    })
    return  response
}