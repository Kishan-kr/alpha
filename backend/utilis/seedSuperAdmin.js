const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

const seedSuperAdmin = async () => {
    try {
        const checkadmin = await Admin.find()
        if (!checkadmin.length) {
            const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
            const firstAdmin = new Admin({
                name: "Anuj", 
                email: "anuj@tashn.in", 
                role:"SUPER_ADMIN", 
                password: hashedPassword
            })
            await firstAdmin.save()

            if (!firstAdmin) {
                throw new Error("Error occured while creating first admin")
            }
            console.log("First Admin Created Successfully")

        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = seedSuperAdmin