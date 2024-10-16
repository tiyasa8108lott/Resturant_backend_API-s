const { DataTypes } = require("sequelize");
const sequelize = require("./dbconnect");

// User Model
const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW, // Automatically update the timestamp on update
    },
});

// Menu Model
const Menu = sequelize.define("Menu", {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    item_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    item_price: {
        type: DataTypes.FLOAT, // Changed to FLOAT for better price handling
        allowNull: false
    },
    item_rating: {
        type: DataTypes.FLOAT, // Use FLOAT for ratings to accommodate decimal values
        allowNull: true
    },
    item_availability: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_veg: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    resturant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurants', // Name of the referenced table
            key: 'id' // Key in the referenced table
        }
    },
});

// Restaurant Model
const Restaurant = sequelize.define("Restaurant", {
    resturant_id: {  // Change 'id' to 'restaurant_id'
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    resturant_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resturant_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resturant_rating: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    resturant_phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resturant_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Orders Model
const Orders = sequelize.define("Orders", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Added reference for user_id
            key: 'id' // Key in the referenced table
        }
    },
    resturant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurants', // Added reference for restaurant_id
            key: 'id' // Key in the referenced table
        }
    },
    order_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW, // Automatically update the timestamp on update
    },
});

// OrderDetails Model
const OrderDetails = sequelize.define("OrderDetails", {
    order_details_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders', // Added reference for order_id
            key: 'id' // Key in the referenced table
        }
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Menus', // Added reference for item_id
            key: 'item_id' // Key in the referenced table
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT, // Changed to FLOAT for price
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW, // Automatically update the timestamp on update
    },
});

// Associations
Menu.belongsTo(Restaurant, { foreignKey: "resturant_id" }); // Update foreign key naming
Restaurant.hasMany(Menu, { foreignKey: "resturant_id" });
User.hasMany(Orders, { foreignKey: "user_id" });
Orders.belongsTo(User, { foreignKey: 'user_id' });
OrderDetails.belongsTo(Orders, { foreignKey: 'order_id' });
Orders.hasMany(OrderDetails, { foreignKey: "order_id" });
OrderDetails.belongsTo(Menu, { foreignKey: "item_id" });

module.exports = { User, Menu, Restaurant, Orders, OrderDetails };  // Ensure consistent naming
