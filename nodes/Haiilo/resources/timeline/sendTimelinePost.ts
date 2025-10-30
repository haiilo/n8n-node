import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { createTimelinePost } from '../../../HaiiloApi/timeline/create';
import { getMe } from '../../../HaiiloApi/user/me';

/**
 * Executes the sendTimelinePost operation and retrieve the result
 */
export async function sendTimelinePost(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	const message = this.getNodeParameter('timelineMessage', i) as string;

	const me = await getMe(this);
	console.info('Creating timeline post for user:', me.id);
	console.info('Timeline message:', message);
	const res = await createTimelinePost(this, me.id, message);
	returnData.push({ json: res.content ?? {} });
	return returnData;
}
