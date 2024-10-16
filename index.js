const express = require('express');
const { User, Menu,Restaurant, Orders, OrderDetails } = require("./model");
const app = express();
const PORT = 8080;

app.listen(PORT, (err) => {
    if (err) console.log("Error: " + err);
    else console.log("Server started successfully on port " + PORT);
});

app.use(express.json());

// Register User
app.post("/registerUser", async (req, res) => {
    const { user_name, email, password, phone_number } = req.body;

    try {
        const newUser = await User.create({
            user_name,
            email,
            password,
            phone_number,
        });
        res.status(201).send("User created successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating user: " + err.message);
    }
});

// Login User
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const findUser = await User.findOne({ where: { email: email } });

        if (findUser) {
            const data = findUser.get({ plain: true });
            if (data.password === password) {
                res.status(200).send("Logged in successfully");
            } else {
                res.status(401).send("Invalid email or password");
            }
        } else {
            res.status(404).send("User does not exist, kindly register");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error logging in: " + err.message);
    }
});

// Register Restaurant

 // Register Restaurant
 app.post("/registerRestaurant", async (req, res) => {
    console.log("Request Body:", req.body); // Log the incoming request data
    
    const { resturant_name, resturant_address, resturant_rating, resturant_phone, resturant_status } = req.body;

    try {
        const newRestaurant = await Restaurant.create({
            resturant_name,
            resturant_address,
            resturant_rating,
            resturant_phone,
            resturant_status,
        });
        res.status(201).send("Restaurant added successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding restaurant");
    }
});


// Add Menu
app.post("/addMenu", async (req, res) => {
    const { resturant_id, item_name, item_description, item_price, item_rating, item_availability, is_veg } = req.body;

    try {
        const newMenu = await Menu.create({
            resturant_id, // Ensure this matches the model
            item_name,
            item_description,
            item_price,
            item_rating,
            item_availability,
            is_veg,
        });
        res.status(201).send("Menu added successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding menu");
    }
});

// Place an Order
app.post("/order", async (req, res) => {
    const { userId, resturant_id, item_id, quantity, payment_method } = req.body;

    // Validate incoming request data
    if (!userId || !resturant_id || !item_id || !quantity || !payment_method) {
        return res.status(400).send("All fields are required.");
    }

    try {
        // Retrieve the item price from the Menu
        const menuItem = await Menu.findOne({ where: { item_id } });
        if (!menuItem) {
            return res.status(404).send("Menu item not found");
        }

        // Calculate the total price
        const totalPrice = menuItem.item_price * quantity;

        // Create a new order
        const newOrder = await Orders.create({
            user_id: userId,
            resturant_id,
            order_status: "Pending", // Set a default order status
        });

        // Create the order details
        await OrderDetails.create({
            order_id: newOrder.id, // Use the correct ID for referencing
            item_id,
            quantity,
            price: totalPrice, // Set the calculated total price
            payment_method,
        });

        res.status(201).send("Order created successfully");
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).send("Error creating order: " + err.message);
    }
});

module.exports = app;
