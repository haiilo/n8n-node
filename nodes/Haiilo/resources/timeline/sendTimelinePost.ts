import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { createTimelinePost } from '../../../HaiiloApi/timeline/create';
import { getMe } from '../../../HaiiloApi/user/me';
import { HaiiloFunction, HaiiloParameter, NodeFunction } from '../../../HaiiloApi/HaiiloNodeRepository';

/**
 * Executes the sendTimelinePost operation and retrieve the result
 */
async function sendTimelinePost(
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
export class SendTimelinePost extends HaiiloFunction {
	getFunction(): NodeFunction {
		return sendTimelinePost;
	}
	getName(): string {
		return 'sendTimelinePost';
	}
	getDisplayName(): string {
		return 'Send Timeline Post';
	}
	getDescription(): string {
		return 'Sends a timeline post to a user';
	}
	getParameters(): HaiiloParameter[] {
		return [{
			displayName: 'Timeline Message',
			name: 'timelineMessage',
			type: 'string',
			typeOptions: {
			},
			required: true,
			default: '',
			placeholder: '',
			description: 'Select the workspaces to get information. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		}];
	}
}