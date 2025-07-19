const User = require('../models/User');
const { validatePreferences } = require('../utils/validation');

const getPreferences = async (req, res) => {
    try {
        const user = User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.status(200).json({
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const updatePreferences = async (req, res) => {
    try {
        // Validate input
        const { error, value } = validatePreferences(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.details.map(detail => detail.message)
            });
        }

        const { preferences } = value;
        const updatedUser = User.updatePreferences(req.user.userId, preferences);
        
        if (!updatedUser) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.status(200).json({
            message: 'Preferences updated successfully',
            preferences: updatedUser.preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

module.exports = {
    getPreferences,
    updatePreferences
}; 