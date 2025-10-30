import { INodeExecutionData } from 'n8n-workflow';

export interface Entity extends INodeExecutionData {
	id: string;
}
export interface PagedResult<T extends Entity> {
	content: T[];
	numberOfElements: number;
	first: boolean;
	last: boolean;
	totalElements: number;
	totalPages: number;
	size: number;
}