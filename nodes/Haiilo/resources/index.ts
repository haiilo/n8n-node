import { timelineOperations } from './timeline';
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

// We export an object with all resources
// Token operations have been removed due to security concerns
export const resources = {
	timeline: timelineOperations
} as Record<string, Record<string, (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData[]>>>;
