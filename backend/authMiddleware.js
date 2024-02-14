// authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    // Get the token from the request headers
    const token = req.header('Authorization');

    // Check if token is present
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, '25bbe05fe41e374147858bf738274b0b1fea6f9879c06236da96a81e01d6236cc2e639b1108d84f66d89fb4502858166e6f2ad8280d68a6da250f9371d6e7d1e');

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Call the next middleware
        next();
    } catch (err) {
        // Handle invalid token
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateUser;
