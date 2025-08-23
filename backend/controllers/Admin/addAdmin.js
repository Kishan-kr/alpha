const Admin = require("../../models/admin")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs");
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

const addAdmin = async (req, res) => {
    try {
        // Step 1: Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return the first validation error
            return res.status(400).json({ status: false, error: errors.array()[0]?.msg });
        }

        const { email, password, name, role } = req.body;
        const normalizedEmail = email?.toLowerCase();

        // Step 2: Check for duplicate admin by email
        const existingAdmin = await Admin.findOne({ email: normalizedEmail });
        if (existingAdmin) {
            throw new CustomError("Email already exists", 409);
        }

        // Step 3: Create new admin
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            name,
            role: role || "ADMIN",
            email: normalizedEmail,
            password: hashedPassword,
        });

        if (!newAdmin) {
            throw new CustomError("Failed to add the new admin", 500);
        }

        // Exclude password from response
        const newAdminPlainObject = newAdmin.toObject();
        delete newAdminPlainObject.password;

        // Step 4: Return success response
        return res.status(201).json({
            status: true,
            message: "Admin added successfully",
            admin: newAdminPlainObject
        });

    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        });
    }
}


module.exports = addAdmin