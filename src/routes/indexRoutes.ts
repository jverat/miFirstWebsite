import {Response, Request, Router} from 'express';

class IndexRoutes {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/', (req: Request, res: Response) => {
            res.send('holi otra vez');
        });

        this.router.get('/mal', (req: Request, res: Response) => {
           res.send('paila');
        });
    }
}

const indexRoutes = new IndexRoutes();

export default indexRoutes.router;