import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { getSenders } from '../HaiiloApi/sender/getSenders';
import { getMe } from '../HaiiloApi/user/me';
import { createTimelinePost } from '../HaiiloApi/timeline/create';

export class Timeline implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Haiilo Timeline Post',
		name: 'timeline',
		icon: { light: 'file:../../icons/haiilo.svg', dark: 'file:../../icons/haiilo.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Haiilo Timeline Post',
		defaults: {
			name: 'Haiilo Timeline Post',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'haiiloOAuth2Api',
				required: true,
			},
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Timeline Post Content',
				name: 'timelineMessage',
				type: 'string',
				default: '',
				placeholder: 'Timeline post content',
				description: 'The content of the timeline post to create',
			},
		],
	};
	methods = {
		listSearch: {
			getTimelines: getSenders,
		},
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `timelineMessage` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const input = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < input.length; i++) {
			const timelineMessage = this.getNodeParameter('timelineMessage', i) as string;
			const me = await getMe(this);
			const response = await createTimelinePost(this, me.id, timelineMessage);
			returnData.push({ json: response.content ?? [] });
		}
		return [returnData];
	}
}
