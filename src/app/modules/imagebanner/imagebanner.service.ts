import { JwtPayload } from 'jsonwebtoken';
import { IImagebanner } from './imagebanner.interface';
import { Imagebanner } from './imagebanner.model';
import { USER_ROLES } from '../../../enums/user';

const createImagebanner = async (data: IImagebanner) => {
    const result = await Imagebanner.create(data);
    return result;
}


const getAllImagebanners = async (user:JwtPayload) => {
    const initQuery = [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(user?.role) ? {} : {status: "active"};
    const result = await Imagebanner.find(initQuery).sort({createdAt: -1});
    return result;
}


const updateImagebanner = async (id: string, data: Partial<IImagebanner>) => {
    const result = await Imagebanner.findByIdAndUpdate(id, data, { new: true });
    return result;
}

const deleteImagebanner = async (id: string) => {
    const result = await Imagebanner.findByIdAndDelete(id);
    return result;
}



export const ImagebannerServices = { createImagebanner, getAllImagebanners, updateImagebanner, deleteImagebanner };