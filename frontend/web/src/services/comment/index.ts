import axios from 'axios';
import { User } from '../authentication';

export interface CommentReply {
  id: string,
  createdAt: Date | string,
  updatedAt: Date | string,
  content: string,
  account: User,
}

export interface CommentType {
  id: string,
  createdAt: Date | string,
  updatedAt: Date | string,
  content: string,
  alert: string,
  account: User,
  replies: CommentReply[],
}

const url = import.meta.env.VITE_APP_ALERT_REQUEST_BASE_URL as string;

export class CommentService {
  public static async list(id: string): Promise<CommentType[] | undefined> {
    const { data } = await axios<{ value: CommentType[] }>({
      baseURL: url,
      url: `alert/comment/${id}`,
      method: 'GET',
    });

    return data.value;
  }

  public static async create(id: string, content: string): Promise<CommentType> {
    const { data } = await axios<{ value: CommentType }>({
      baseURL: url,
      url: `alert/comment/create/${id}`,
      method: 'POST',
      withCredentials: true,
      data: {
        content,
      },
    });

    return data.value;
  }

  public static async createReply(id: string, content: string): Promise<CommentType> {
    const { data } = await axios<{ value: CommentType }>({
      baseURL: url,
      url: `alert/comment/create-reply/${id}`,
      method: 'POST',
      withCredentials: true,
      data: {
        content,
      },
    });

    return data.value;
  }
}
