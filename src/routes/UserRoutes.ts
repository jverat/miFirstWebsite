import {Request, Response, Router} from "express";
import jwt from 'jsonwebtoken';

import App from '../server';
import User from "../models/User";

class UserRoutes{
    public router: Router;

    public constructor() {
        this.router = Router();
        this.routes();
    }

    private async getUser(req: Request, res: Response) {
        const u = await User.findOne({ username: req.params.username });
        console.log((req.params.username));
        res.json(u);
    }

    private async getUsers(req: Request, res: Response){
        res.json(await User.find());
    }

    private async postUser(req: Request, res: Response) {
        const {username, password, email} = req.body;
        const newUser = new User({ username, password, email });
        await newUser.save((err, newUser) => {
            if (err) {
                res.json('username or email already exist');
                return console.error(err);
            }
            else {
                console.log(newUser.get('username') + ' created');
                res.json({data: newUser});
            }
        });
    }

    private async updateUser(req: Request, res: Response) {
        console.log(req.params.username);
        console.log(req.body);
        const userToUpdate = await User.findOne({ username: req.params.username });
        // @ts-ignore
        if (userToUpdate.token === req.params.token && userToUpdate.token != ""){
             let updatedUser = await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true });
            res.json({ data: updatedUser });
        }
        else {
            console.log('invalid token');
            res.json('unauthorized');
        }
    }

    private async deleteUser(req: Request, res: Response) {
        let u = await User.findOne({ username: req.params.username });
        //@ts-ignore
        if (u.token === req.body.token.toString() && u.token != ""){
            await User.findOneAndDelete({ username: req.params.username });
            res.json(req.params.username + ' deleted');
        }
        else {
            console.log('invalid token');
            res.json('unauthorized');
        }
    }

    private async authUser(req: Request, res: Response) {
        let user = await User.findOne({ username: req.body['username'] });
        if (user == null) res.json('invalid username');
        else {
            if (user.get('password') === req.body['password']){
                let token: String = jwt.sign({
                    'username': user.get('username')
                }, App.get('key'));
                // @ts-ignore
                user.token = token;
                await user.save((err, user) => {
                    if (err) return console.error(err);
                    else console.log(user.get('username') + ' token added');
                });
                //@ts-ignore
                console.log(user.username + "  " + user.token);
                res.json(token);
            }
            else res.json ('wrong password');
        }
    }

    public routes(){
        this.router.get('/:username', (req: Request, res:Response) => {
            this.getUser(req, res)
                .then();
        });

        /*this.router.get('/', (req: Request, res: Response) => {
           this.getUsers(req, res)
               .then();
        });*/

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

        this.router.post('/auth', (req: Request, res: Response) => {
           this.authUser(req, res)
               .then();
        });
    }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;