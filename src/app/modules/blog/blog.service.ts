import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { RedisHelper } from '../../../tools/redis/redis.helper';
import QueryBuilder from '../../builder/QueryBuilder';
import { BlogModel, IBlog } from './blog.interface';
import { Blog } from './blog.model';
import unlinkFile from '../../../shared/unlinkFile';

const createBlogToDB = async (data:IBlog)=>{
    const createBlog = await Blog.create(data)
    await RedisHelper.keyDelete(`blog:*`);
    return createBlog
}

const getBlogsFromDB = async (query:Record<string,any>)=>{
    const cache = await RedisHelper.redisGet(`blog`, query);
    if (cache) return cache;
    const blogQuery = new QueryBuilder(Blog.find({}),query).paginate().sort()
    const [blogs,pagination] = await Promise.all([blogQuery.modelQuery.exec(),blogQuery.getPaginationInfo()]);
    await RedisHelper.redisSet(`blog`, {data:blogs,pagination}, query, 60);
    return {data:blogs,pagination}
}

const getSingleBlogFromDB = async (id:string)=>{
    const cache = await RedisHelper.redisGet(`blog:${id}`);
    if (cache) return cache;
    const blog = await Blog.findById(id);
    if(!blog){
        throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found!");
    }
    await RedisHelper.redisSet(`blog:${id}`, blog, {}, 60);
    return blog
}

const updateBlogToDB = async (id:string,data:IBlog)=>{
    const blog = await Blog.findById(id);
    if(!blog){
        throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found!");
    }
    if((blog.thumbnail && data.thumbnail) && (blog.thumbnail != data.thumbnail)){
        unlinkFile(blog.thumbnail);
    }
    const updateBlog = await Blog.findByIdAndUpdate(id,data,{new:true});
    await RedisHelper.keyDelete(`blog:*`);
    return updateBlog
}

const deleteBlogFromDB = async (id:string)=>{
    const blog = await Blog.findById(id);
    if(!blog){
        throw new ApiError(StatusCodes.NOT_FOUND, "Blog not found!");
    }
    unlinkFile(blog.thumbnail);
    const deleteBlog = await Blog.findByIdAndDelete(id);
    await RedisHelper.keyDelete(`blog:*`);
    return deleteBlog
}


export const BlogServices = {
    createBlogToDB,
    getBlogsFromDB,
    getSingleBlogFromDB,
    updateBlogToDB,
    deleteBlogFromDB
}
