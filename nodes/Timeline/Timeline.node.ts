import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { getSenders } from '../HaiiloApi/sender/getSenders';
import { haiiloApiRequest } from '../HaiiloApi/shared/transport';

export class Timeline implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Create a timeline Post',
		name: 'timeline',
		icon: { light: 'file:../../icons/haiilo.svg', dark: 'file:../../icons/haiilo.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Create Timeline Post Node',
		defaults: {
			name: 'Timeline',
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
			const post = {
				recipientIds: ['10a9e5b4-f3b3-4a42-b244-498080480d70'],
				restricted: false,
				webPreviews: {},
				stickyExpiry: null,
				type: 'post',
				authorId: '10a9e5b4-f3b3-4a42-b244-498080480d70',
				data: { message: timelineMessage },
				attachments: [],
				fileLibraryAttachments: [],
			};
			console.log(post);
			const response = await haiiloApiRequest.call(this, 'POST', '/timeline-items', post);
			returnData.push({ json: response.content ?? [] });
		}
		return [returnData];
	}
}
