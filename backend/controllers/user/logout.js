
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ status: false, error: "Logout failed" });
        res.clearCookie('connect.sid');
        res.json({ status: true, message: "Logged out" });
    });
};

module.exports = logout;