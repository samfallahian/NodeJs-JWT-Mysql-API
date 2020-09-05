const db = require("../models");
const Model = db.users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {

    create: (req, res) => {
        let result = {};
        let status = 201;

        let userData = {
            ...req.body
        };
        userData.password = bcrypt.hashSync(userData.password, 8);

        Model.create(userData)
            .then((data) => {
                result.status = status;
                result.result = `User '${data.username}' is created successfully`;
                res.status(status).send(result);
            })
            .catch((err) => {
                status = 400;
                result.status = status;
                result.error = [];
                for (var error of err.errors) {
                    console.log(error.message);
                    result.error.push(error.message);
                }
                res.status(status).send(result);
            });
    },

    login: (req, res) => {
        let result = {};
        let status = 200;
        const {
            username,
            password
        } = req.body;

        Model.findOne({
                where: {
                    username: username,
                },
            })
            .then((data) => {
                if (data) {
                    bcrypt
                        .compare(password, data.password)
                        .then((match) => {

                            if (match) {
                                // Create a token
                                const payload = {
                                    userid: data.id,
                                    username: data.username,
                                    email: data.email
                                };
                                const options = {
                                    expiresIn: process.env.JWT_EXP,
                                    algorithm: "HS256"
                                };
                                const refreshOptions = {
                                    expiresIn: process.env.JWT_REFRESH_EXP,
                                    algorithm: "HS256"
                                };
                                const secret = process.env.JWT_SECRET;
                                const refreshsecret = process.env.JWT_REFRESH_SECRET;
                                const token = jwt.sign(payload, secret, options);
                                const refreshToken = jwt.sign(payload, refreshsecret, refreshOptions);

                                result.status = status;
                                result.result = {
                                    user: {
                                        id: data.id,
                                        username: data.username,
                                        email: data.email
                                    },
                                    access_token: token,
                                    refresh_token: refreshToken
                                };
                            } else {
                                status = 401;
                                result.status = status;
                                result.error = "Authentication error";
                            }

                            res.status(status).send(result);
                        })
                        .catch((err) => {
                            result = {};
                            status = 400;
                            result.status = status;
                            result.error = err.message;
                            res.status(status).send(result);
                        });
                } else {
                    result = {};
                    status = 404;
                    result.status = status;
                    result.error = "User Not found.";
                    res.status(status).send(result);
                }
            })
            .catch((err) => {
                result = {};
                status = 500;
                result.status = status;
                result.error = err.message;
                res.status(status).send(result);
            });
    },

    token: (req, res) => {
        let result = {};
        let status = 200;

        const token = req.body.token;
        const refreshOptions = {
            expiresIn: process.env.JWT_REFRESH_EXP,
            algorithm: "HS256"
        };

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, refreshOptions);
        } catch (err) {
            status = 400;
            result.status = status;
            result.error = err.message;
            res.status(status).send(result);
        }

        const payload = {
            userid: decoded.id,
            username: decoded.username,
            email: decoded.email
        };
        const options = {
            expiresIn: process.env.JWT_EXP,
        };
        const secret = process.env.JWT_SECRET;
        const newToken = jwt.sign(payload, secret, options);

        result.result = {
            access_token: newToken,
            refresh_token: token
        };

        result.status = status;

        res.status(status).send(result);
    },

    me: (req, res) => {
        let result = {};
        let status = 200;
        const username = req.decoded.username;

        Model.findOne({
                attributes: ["id", "username", "email"],
                where: {
                    username: username
                },
            })
            .then((data) => {
                result.status = status;
                result.result = data;
                res.status(status).send(result);
            })
            .catch((err) => {
                status = 400
                result.status = status;
                result.error = err.message;
                res.status(status).send(result);
            });
    },

    getAll: (req, res) => {
        let result = {};
        let status = 200;

        Model.findAll()
            .then((data) => {
                result.status = status;
                result.result = data;
                res.status(status).send(result);
            })
            .catch((err) => {
                status = 400;
                result.status = status;
                result.error = err.message;
                res.status(status).send(result);
            });
    },

};