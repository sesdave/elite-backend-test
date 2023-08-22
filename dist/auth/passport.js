"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const models_1 = require("../models"); // Import your User model
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your-secret-key', // Replace with your actual secret key
};
const jwtStrategy = new passport_jwt_1.Strategy(options, async (payload, done) => {
    try {
        // Find the user based on the payload
        const user = await models_1.User.findByPk(payload.sub);
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        return done(error, false);
    }
});
passport_1.default.use(jwtStrategy);
exports.default = passport_1.default;
