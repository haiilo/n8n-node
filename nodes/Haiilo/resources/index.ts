import { timelineOperations } from './timeline';
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { chatOperations } from './chat';
import { userOperations } from './user';

export const resources = {
	timeline: timelineOperations,
	chat: chatOperations,
	user: userOperations,
} as Record<string, Record<string, (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData[]>>>;
