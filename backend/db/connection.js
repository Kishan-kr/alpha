const mongooose = require("mongoose")
const seedSuperAdmin = require("../utilis/seedSuperAdmin")
const seedDatabase = require("../temp/seeders/seedDummyData");

const connect = async () => {
    try {
        const connection = await mongooose.connect(process.env.DATABASE_URI)
        if (connection) {
            console.log("Successfully connected to database");
            seedSuperAdmin()
            // seed dummy data 
            // seedDatabase();
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = connect