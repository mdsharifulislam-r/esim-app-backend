import { Request, Response, NextFunction } from 'express';
import { BlogServices } from './blog.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { getSingleFilePath } from '../../../shared/getFilePath';

const createBlog = catchAsync(async (req: Request, res: Response) => {
    req.body.thumbnail = getSingleFilePath(req.files, 'image');
    const result = await BlogServices.createBlogToDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Blog created successfully',
        data: result
    })
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogServices.getBlogsFromDB(req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Blogs fetched successfully',
        data: result.data,
        pagination: result.pagination
    })
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogServices.getSingleBlogFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Blog fetched successfully',
        data: result
    })
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogServices.deleteBlogFromDB(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Blog deleted successfully',
        data: result
    })
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
    req.body.thumbnail = getSingleFilePath(req.files, 'image');
    const result = await BlogServices.updateBlogToDB(req.params.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Blog updated successfully',
        data: result
    })
})


export const BlogController = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    deleteBlog,
    updateBlog
};
