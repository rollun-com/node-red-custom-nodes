"use strict";
const { getLifecycleToken } = require('../../node-red-contrib-common-utils/1-global-utils');

const requests = {};

function enqueue(req, res, next) {
    const { LT, PLT } = getLifecycleToken({req});
    requests[LT] = {
        id: LT,
        req: req,
        res: res,
        next: next,
    };
    return { LT, PLT };
}
exports.enqueue = enqueue;
function dequeue(id, handler) {
    const ctx = requests[id];
    if (!ctx) {
        throw new Error('Not found');
    }
    const { req, res, next } = ctx;
    try {
        handler(req, res, next);
    }
    catch (e) {
        next(e);
        console.log(e);
    }
    finally {
        delete requests[id];
    }
}
exports.dequeue = dequeue;
