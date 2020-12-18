import { NextFunction, Request, Response, Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import Server from '../server';
import User, { UserInt } from "../models/User";

class UserRoutes {
    public router: Router;

    public constructor() {
        this.router = Router();
        this.middlewares();
        this.routes();
    }

    private middlewares() {
        this.router.use(this.authCheck);
    }

    private authCheck(req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated()) next();
        else res.status(401).json({ msg: 'Unauthorized' });
    }

    private async getUser(req: Request, res: Response) {
        const u = await User.findOne({ username: req.params.username });
        console.log((req.params.username));
        res.json(u);
    }

    private async getUsers(req: Request, res: Response) {
        res.json(await User.find());
    }

    private async postUser(req: Request, res: Response) {
        const { username, password, email } = req.body;
        console.log(username + " " + password + " " + email);
        const { salt, hash } = this.genPass(password);
        console.log(salt + " " + hash);
        const newUser = new User({ username: username, password: hash, salt: salt, email: email });
        console.log(newUser);
        await newUser.save((err, newUser) => {
            console.log('smth');
            if (err) {
                res.json('username or email already exist');
                return console.error(err);
            } else {
                console.log(newUser.get('username') + ' created');
                res.json({ data: newUser });
            }
        });
    }

    private async updateUser(req: Request, res: Response) {
        //to-do
    }

    private async deleteUser(req: Request, res: Response) {
        let u = await User.findOne({ username: req.params.username }) as UserInt;
        if (u.token === req.body.token.toString() && u.token != "") {
            await User.findOneAndDelete({ username: req.params.username });
            res.json(req.params.username + ' deleted');
        } else {
            console.log('invalid token');
            res.json('unauthorized');
        }
    }

    private async authUser(req: Request, res: Response) {
        let user = await User.findOne({ username: req.body['username'] });
        if (user == null || user == undefined) res.json('invalid username');
        else {
            if (user.get('password') === req.body['password']) {
                let token: String = jwt.sign({
                    'username': user.get('username')
                }, Server.app.get('key'));
                //@ts-ignore
                user?.token = token;
                await user.save((err, user) => {
                    if (err) return console.error(err);
                    else console.log(user.get('username') + ' token added');
                });
                //@ts-ignore
                console.log(user.username + "  " + user.token);
                res.json(token);
            } else res.json('wrong password');
        }
    }

    public routes() {
        /*this.router.get('/', (req: Request, res: Response) => {
           this.getUsers(req, res)
               .then();
        });*/

        this.router.post('/sign', (req: Request, res: Response) => {
            this.postUser(req, res);
        });

        this.router.post('/login',
            passport.authenticate('local', { failureMessage: 'Wrong user or password', failureRedirect: '/mal' }),
            (req: Request, res: Response, done: NextFunction) => {

            });

        this.router.get('/logout', (req: Request, res: Response) => {
            req.logout;
            console.log(req.session);
            res.redirect('/');
        });

        this.router.get('/:username', (req: Request, res: Response) => {
            this.getUser(req, res)
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

    public genPass(password: string): { salt: string; hash: string; } {
        let salt: string = crypto.randomBytes(32).toString('hex');
        let genHash: string = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return {
            salt: salt,
            hash: genHash
        };
    }

    public checkPass(inPassword: string, hash: string, salt: string): boolean {
        return hash === crypto.pbkdf2Sync(inPassword, salt, 10000, 64, 'sha512').toString('hex');
    }
}

const userRoutes = new UserRoutes();

export default userRoutes;