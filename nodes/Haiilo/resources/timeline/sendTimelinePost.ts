import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { createTimelinePost } from '../../../HaiiloApi/timeline/create';

/**
 * Executes the sendTimelinePost operation and retrieve the result
 */
export async function sendTimelinePost(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const res = await createTimelinePost(
		this,
		this.getNodeParameter('recipientId', i) as string,
		this.getNodeParameter('timelineMessage', i) as string,
	);
	returnData.push({ json: res.content ?? {} });
	return returnData;
}
