import { timelineOperations } from './timeline';
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { chatOperations } from './chat';
import { userOperations } from './user';
import { notificationOperations } from './notifications';

export const resources = {
	timeline: timelineOperations,
	chat: chatOperations,
	user: userOperations,
	notification: notificationOperations,
} as Record<string, Record<string, (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData[]>>>;
