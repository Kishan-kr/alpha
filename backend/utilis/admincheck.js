const Admin = require("../models/admin")
const bcrypt = require("bcryptjs")

const admincheck = async () => {
    try {
        const checkadmin = await Admin.find()
        // console.log(checkadmin);
        if (!checkadmin.length) {
            const firstAdmin = new Admin({
                name: "Anuj", email: "anuj@tashn.in", role:"superAdmin", password: await bcrypt.hash("tashn523@", 10)
            })
            const createfirstadmin = await firstAdmin.save()
            // console.log(createfirstadmin);
            if (!createfirstadmin) {
                throw new Error("Error occured while creating first admin")
            }
            console.log("First Admin Created Successfully")

        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = admincheck