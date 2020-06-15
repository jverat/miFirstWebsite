import {Request, Response, Router} from "express";

import User from "../models/User";

class UserRoutes{
    public router: Router;

    public constructor() {
        this.router = Router();
        this.routes();
    }

    public async getUser(req: Request, res: Response) {
        const u = await User.findOne({username: req.params.username});
        console.log((req.params.username));
        res.json(u)
    }

    public async postUser(req: Request, res: Response) {
        const {username, password, email} = req.body;
        const newUser = new User({username, password, email});
        await newUser.save((err, newUser) => {
            if (err) return console.error(err);
            else console.log(newUser.get('username'));
        });
        res.json({data: newUser});
    }

    public async updateUser(req: Request, res: Response) {
        console.log(req.params.username);
        console.log(req.body);
        const updatedUser = await User.findOneAndUpdate({username: req.params.username}, req.body, {new: true});
        res.json({data: updatedUser});
    }

    public async deleteUser(req: Request, res: Response) {
        await User.findOneAndDelete({username: req.params.username});
        res.json('copas');
    }

    private routes(){
        this.router.get('/:username', (req: Request, res:Response) => {
            this.getUser(req, res)
                .then();
        });

        this.router.post('/', (req: Request, res:Response) => {
            this.postUser(req, res)
                .then();
        });

        this.router.put('/:username', (req: Request, res: Response) => {
           this.updateUser(req, res)
               .then();
        });

        this.router.delete('/:username', (req: Request, res: Response) => {
           this.deleteUser(req, res)
               .then();
        });
    }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;