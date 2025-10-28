import {
	ApplicationError,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
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
				name: 'postContent',
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
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let timelineMessage: string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				timelineMessage = this.getNodeParameter('timelineMessage', itemIndex, '') as string;

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
				haiiloApiRequest.call(this, 'POST',  'timeline-items', post).catch((error) => {
					throw new ApplicationError(`Haiilo Timeline Post creation failed: ${error.message}`);
				});
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
