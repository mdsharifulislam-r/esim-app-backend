import express from 'express';
import { BlogController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidations } from './blog.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

router.route("/")
    .post(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(BlogValidations.createBlogZodSchema), BlogController.createBlog)
    .get(BlogController.getAllBlogs)

router.route("/:id")
    .get(BlogController.getSingleBlog)
    .patch(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),fileUploadHandler(),validateRequest(BlogValidations.updateBlogZodSchema),BlogController.updateBlog)
    .delete(auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),BlogController.deleteBlog)

export const BlogRoutes = router;
