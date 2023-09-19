import { check, validationResult } from 'express-validator';
import {hasNumber, hasSpecialCharacter, isLowerCase, isUnpredictable, isUpperCase} from "./validator";
export class UserValidation {
    static validateRegistration(req: any, res: any, next: any) {
        // TODO: Username and email validations are missing
        // TODO: User input sanitization
        const validationRules = [
            check('password')
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .custom(isUpperCase)
                .withMessage('Password must contain at least one uppercase letter')
                .custom(isLowerCase)
                .withMessage('Password must contain at least one lowercase letter')
                .custom(hasNumber)
                .withMessage('Password must contain at least one number')
                .custom(hasSpecialCharacter)
                .withMessage('Password must contain at least one special character')
                .custom(isUnpredictable)
                .withMessage('Password is too predictable'),
        ];

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const extractedErrors: any[] = [];
            errors.array().map((err: any) => extractedErrors.push({ [err.param]: err.msg }));
            return res.status(400).json({
                errors: extractedErrors,
            });
        }

        return next();
    }

    static validateLogin(req: any, res: any, next: any) {
        const validationRules = [
            check('email')
                .isEmail()
                .withMessage('Invalid email format')
                .trim()
                .normalizeEmail(),
            check('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .trim()
        ];

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const extractedErrors: any[] = [];
            errors.array().map((err: any) => extractedErrors.push({ [err.param]: err.msg }));
            return res.status(400).json({
                errors: extractedErrors,
            });
        }

        return next();
    }
}