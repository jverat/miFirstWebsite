import express, {Request, Response, Router} from "express";
import {User} from "../User";

//const loginRouter = Router();
const app = express();

let u: User = {username:"pepito", password:"perez", email:"pepito@perez.com"}
let users: User[] = [u];


app.route("/api").get((req: Request, res: Response)=>{ res.json("miapi"); })

//Request = username
app.get("/api/user/:username", (req: Request, res: Response)=>{
    res.json(users.find(user => user.username === req.params.username));
})