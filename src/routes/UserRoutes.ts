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
        const users = await User.find();
        res.json(users);
    }

    routes(){
        this.router.get('/user', (req: Request, res:Response) => {
            this.getUser(req, res);
        });

        this.router.post('/user/:username', (req: Request, res:Response) => {
            console.log(req.body);
        });
    }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;