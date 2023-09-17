import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'; // Import the strategy you want to use
import { User } from '../models'; // Adjust the path

const initializePassport = (passport: passport.PassportStatic) => {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

     /* if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      */

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Serialize user object
  passport.serializeUser((user, done) => {
   // done(null, user.id);
  });

  // Deserialize user object
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
