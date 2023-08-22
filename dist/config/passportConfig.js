"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local"); // Import the strategy you want to use
const models_1 = require("../models"); // Adjust the path
const initializePassport = (passport) => {
    passport.use(new passport_local_1.Strategy(async (username, password, done) => {
        try {
            const user = await models_1.User.findOne({ where: { username } });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            /* if (!user.validPassword(password)) {
               return done(null, false, { message: 'Incorrect password.' });
             }
             */
            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    }));
    // Serialize user object
    passport.serializeUser((user, done) => {
        // done(null, user.id);
    });
    // Deserialize user object
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await models_1.User.findByPk(id);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    });
};
exports.default = initializePassport;
