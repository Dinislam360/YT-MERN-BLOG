import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        minlength: [3, 'Category name must be at least 3 characters long'],
        maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Slug must be at least 3 characters long'],
        maxlength: [50, 'Slug cannot exceed 50 characters'],
        validate: {
            validator: function(v) {
                return /^[a-z0-9-]+$/.test(v);
            },
            message: props => `${props.value} is not a valid slug! Use only lowercase letters, numbers and hyphens.`
        }
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema, 'categories');
export default Category;
