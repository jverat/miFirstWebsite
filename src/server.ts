import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import userRoutes from './routes/UserRoutes';

const KEY: string = 'contraseña123';
const MONGO_URI: string = 'mongodb://localhost/mfws';

class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        //DB setup
        mongoose.set('useFindAndModify', true);
        mongoose.connect(process.env.MONGODB_URL || MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
            .then(db => console.log('DB is connected'));

        //Settings
        this.app.set('key', KEY);
        this.app.set('port', process.env.PORT || 3000);

        //Middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes(){
        this.app.use(indexRoutes);
        this.app.use('/api/user', userRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();

export default server.app;