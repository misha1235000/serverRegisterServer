// error.handler

import { Request, Response, NextFunction } from 'express';
import { BaseError } from './error';
import { MongoError } from 'mongodb';

// TODO: Change error type from any
export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {

    console.log(error);

    if (error instanceof BaseError) {
        return res.status(error.status).send({ message: error.message });
    }

    /* There a wierd error, that i will later open an issue on it.
       Right now when mongo is throwing an error, its going right here without passing the error we are throwing.
       Need to figure out why it happens, and how to fix this.
       For now, i leave it like this. */
    if (error instanceof MongoError) {
        if (error.code === 11000) {
            return res.status(400).send({ message: 'Duplicate Error. Team already exists.' });
        }
    }

    // If error received from authorization server
    // TODO: Need to improve that error checking
    if (error.response) {
        return res.status(error.response.status).send(error.response.data);
    }

    return res.status(500).send({ message: error.message });
}
