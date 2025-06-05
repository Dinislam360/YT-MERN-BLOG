import { handleError } from "../helpers/handleError.js"
import Category from "../models/category.model.js"

export const addCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body;

        // Input validation
        if (!name || !slug) {
            return next(handleError(400, 'Name and slug are required.'));
        }

        // Check for existing category with same slug
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
            return next(handleError(400, 'Category with this slug already exists.'));
        }

        const category = new Category({
            name, 
            slug
        });

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category added successfully.'
        });

    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            next(handleError(400, 'Category with this slug already exists.'));
        } else {
            next(handleError(500, error.message));
        }
    }
}

export const showCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params;
        const category = await Category.findById(categoryid);
        
        if (!category) {
            return next(handleError(404, 'Category not found.'));
        }

        res.status(200).json({
            category
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const updateCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body;
        const { categoryid } = req.params;

        // Check if slug is being changed to an existing one
        const existingCategory = await Category.findOne({ slug, _id: { $ne: categoryid } });
        if (existingCategory) {
            return next(handleError(400, 'Another category with this slug already exists.'));
        }

        const category = await Category.findByIdAndUpdate(
            categoryid,
            { name, slug },
            { new: true, runValidators: true }
        );

        if (!category) {
            return next(handleError(404, 'Category not found.'));
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            category
        });
    } catch (error) {
        if (error.code === 11000) {
            next(handleError(400, 'Another category with this slug already exists.'));
        } else {
            next(handleError(500, error.message));
        }
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params;
        const category = await Category.findByIdAndDelete(categoryid);

        if (!category) {
            return next(handleError(404, 'Category not found.'));
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully.',
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const getAllCategory = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 }).lean().exec();
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
}
