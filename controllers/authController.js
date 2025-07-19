const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../utils/validation');

const signup = async (req, res) => {
    try {
        // Validate input
        const { error, value } = validateUserRegistration(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.details.map(detail => detail.message)
            });
        }

        // Create user
        const user = await User.create(value);
        
        res.status(200).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).json({
                error: 'User with this email already exists'
            });
        }
        
        console.error('Signup error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const login = async (req, res) => {
    try {
        // Validate input
        const { error, value } = validateUserLogin(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.details.map(detail => detail.message)
            });
        }

        const { email, password } = value;

        // Find user by email
        const user = User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Validate password
        const isValidPassword = await User.validatePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user.id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: User.sanitizeUser(user)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

module.exports = {
    signup,
    login
}; 