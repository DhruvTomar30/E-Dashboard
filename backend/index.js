const express = require('express');
const cors = require("cors");
require('./db/config');
const User = require('./db/User');
const Product = require('./db/Products');

const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com';

const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send({ message: "Something went wrong", status: 500 });
        }
        resp.send({ result, auth: token });
    });
});

app.post("/login", async (req, resp) => {
    console.log(req.body);
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send({ message: "Something went wrong", status: 500 });
                }
                resp.send({ user, auth: token });
            });
        } else {
            resp.send({ result: "No user found" });
        }
    } else {
        resp.send({ result: "No user found" });
    }
});

app.post('/add-products', verifyToken, async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
});

app.get('/products', verifyToken, async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No products found" });
    }
});

app.delete('/product/:id', verifyToken, async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    resp.send({ message: `Product with ID ${req.params.id} deleted successfully` });
});

app.get("/product/:id", verifyToken, async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result);
    } else {
        resp.send({ result: "No product found" });
    }
});

app.put("/product/:id", verifyToken, async (req, resp) => {
    let result = await Product.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body }
    );
    resp.send(result);
});

app.get('/search/:key', verifyToken, async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key, $options: 'i' } },
            { category: { $regex: req.params.key, $options: 'i' } },
            { company: { $regex: req.params.key, $options: 'i' } }
        ]
    });

    if (result.length > 0) {
        resp.send(result);
    } else {
        resp.send({ result: "No products found" });
    }
});

// Token Verification Middleware
function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    console.log("middleware called", token);

    if (token) {
        token = token.split(' ')[1];  // Split the 'Bearer' prefix from the token
        console.log("middleware called if", token);

        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    resp.status(401).send({ message: "Token expired" });  // Return 401 status for expired token
                } else {
                    console.log("middleware called else", err);
                    resp.status(401).send({ message: "Invalid Token" });  // Return 401 status for invalid token
                }
            } else {
                next();
            }
        });
    } else {
        resp.status(403).send({ result: "Please add token with header" });  // Return 403 status for missing token
    }
}

// Refresh Token Endpoint
app.post('/refresh-token', (req, resp) => {
    const token = req.headers['authorization'].split(' ')[1];
    
    if (token) {
        Jwt.verify(token, jwtKey, { ignoreExpiration: true }, (err, user) => {
            if (user) {
                const newToken = Jwt.sign({ user: user.user }, jwtKey, { expiresIn: "2h" });
                resp.send({ auth: newToken });
            } else {
                resp.status(401).send({ message: "Invalid Token" });
            }
        });
    } else {
        resp.status(403).send({ result: "Please add token with header" });
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
