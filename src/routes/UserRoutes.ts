import {Request, Response, Router} from "express";

import User from "../models/User";

//const loginRouter = Router();
class UserRoutes{
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }


    async getUser(req: Request, res: Response){
        //Request = username
        const u = await User.find({username: req.params.username});
        console.log((req.params.username));
        res.json(u)
    }

    async postUser(req: Request, res: Response){
        const {username, password, email} = req.body;
        const newUser = new User({username, password, email});
        await newUser.save();
        res.json({data: newUser});
    }

    routes(){
        this.router.get('/user/:username', (req: Request, res:Response) => {
            this.getUser(req, res);
        });

        this.router.post('/user', (req: Request, res:Response) => {
            this.postUser(req, res);
        });
    }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;