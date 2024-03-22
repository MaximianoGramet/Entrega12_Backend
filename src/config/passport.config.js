import passport from 'passport';
import passportLocal from 'passport-local';
import GitHubStrategy from "passport-github2"
import userModel from '../models/user.model.js';
import { createHash, isValidPas } from '../utils/utils.js';

const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
    passport.use('github', new GitHubStrategy(
        { 
            clientID: "Iv1.e9cf1eafd2b9f6a6",
            clientSecret: "04c934412bb6f6d079c16c2a50588a799b203e1c",
            callbackUrl: "http://localhost:8080/api/sessions/githubcallback"
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario de GitHub: ");
            try {
                const user = await userModel.findOne({ email: profile._json.email });
                console.log("user Found:");
                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);
                    let newUser = {
                        first_name: profile._json.login,
                        last_name: '',
                        age: 1,
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub"
                    }
                    const result = await userModel.create(newUser);
                    return done(null, result)
                } else {
                    return done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        })
    );
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body 
            try {
                const exist = await userModel.findOne({ email });
                if (exist) {
                    console.log("User already exists");
                    done(null, false)
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userModel.create(user);
                return done(null, result)

            } catch (error) {
                return done("Error registering the user " + error);
            }
        }
    ));

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                console.log("User found:");
                if (!user) {
                    console.warn("User doesn't exists with username: " + username);
                    return done(null, false);
                }
                if (!isValidPas(user, password)) {
                    console.warn("Invalid credentials for user: " + username);
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
    }));
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user)
        } catch (error) {
            console.error("Error deserializing the user: " + error);
        }
    });
}

export default initializePassport;