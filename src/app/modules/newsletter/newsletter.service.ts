import { sendNotificationsAdmin } from '../../../helpers/notificationHelper';
import QueryBuilder from '../../builder/QueryBuilder';
import { INewsletter } from './newsletter.interface';
import { Newsletter } from './newsletter.model';

const createNewsletter = async (data: INewsletter) => {
  const result = await Newsletter.create(data);
  sendNotificationsAdmin({
    title: "New Newsletter Subscription",
    message: `A new user has subscribed to the newsletter with email: ${data.email}`,
    filePath: "newssletter",
    isRead: false,
    referenceId: result._id
  })
  return result;
}

const getAllNewsletters = async (query: Record<string, any>) => {
    const newsletterQuery = new QueryBuilder(Newsletter.find(), query).paginate().sort().filter().search(['email']);
    const [data, pagination] = await Promise.all([newsletterQuery.modelQuery.exec(), newsletterQuery.getPaginationInfo()]);
    return { data, pagination };
}

const deleteNewsletter = async (id: string) => {
    const result = await Newsletter.findByIdAndDelete(id);
    return result;
}

export const NewsletterServices = { createNewsletter, getAllNewsletters, deleteNewsletter };

