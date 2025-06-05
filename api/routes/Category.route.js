import express from 'express';
import { 
    addCategory, 
    deleteCategory, 
    getAllCategory, 
    showCategory, 
    updateCategory 
} from '../controllers/Category.controller.js';
import { onlyadmin } from '../middleware/onlyadmin.js';

const CategoryRoute = express.Router();

// Admin-only routes
CategoryRoute.post('/add', onlyadmin, addCategory);
CategoryRoute.put('/update/:categoryid', onlyadmin, updateCategory);
CategoryRoute.get('/show/:categoryid', onlyadmin, showCategory);
CategoryRoute.delete('/delete/:categoryid', onlyadmin, deleteCategory);

// Public route
CategoryRoute.get('/all-category', getAllCategory);

export default CategoryRoute;
