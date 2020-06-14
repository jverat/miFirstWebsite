import {Request, Response, Router} from "express";

import User from "../models/User";

class UserRoutes{
    public router: Router;

    public constructor() {
        this.router = Router();
        this.routes();
    }

    public async getUser(req: Request, res: Response): Promise<void> {
        const u = await User.findOne({username: req.params.username});
        console.log((req.params.username));
        res.json(u)
    }

    public async postUser(req: Request, res: Response): Promise<void> {
        const {username, password, email} = req.body;
        const newUser = new User({username, password, email});
        await newUser.save();
        res.json({data: newUser});
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        console.log(req.params.username);
        console.log(req.body);
        const updatedUser = await User.findOneAndUpdate({username: req.params.username}, req.body, {new: true});
        res.json({data: updatedUser});
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        await User.findOneAndDelete({username: req.params.username});
        res.json('copas')
    }

    routes(){
        this.router.get('/:username', (req: Request, res:Response) => {
            this.getUser(req, res);
        });

        this.router.post('/', (req: Request, res:Response) => {
            this.postUser(req, res);
        });

        this.router.put('/:username', (req: Request, res: Response) => {
           this.updateUser(req, res);
        });

        this.router.delete('/:username', (req: Request, res: Response) => {
           this.deleteUser(req, res);
        });
    }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;