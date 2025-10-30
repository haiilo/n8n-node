import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// Extended interface to support additional n8n tool properties
interface IExtendedNodeTypeDescription extends INodeTypeDescription {
	codex?: {
		categories: string[];
		subcategories: Record<string, string[]>;
		alias: string[];
	};
	triggerPanel?: Record<string, IDataObject>;
}

// Importing modularized resources
import { resources } from './resources';

export class Haiilo implements INodeType {
	description: IExtendedNodeTypeDescription = {
		displayName: 'Haiilo',
		name: 'haiilo',
		icon: 'file:../../icons/haiilo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Work with the Haiilo API',
		usableAsTool: true,
		defaults: {
			name: 'Haiilo',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'haiiloOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Timeline',
						value: 'timeline',
					},
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'User',
						value: 'user',
					}
				],
				default: 'timeline',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'timeline'
						],
					},
				},
				options: [
					{
						name: 'Create Timeline Item',
						value: 'sendTimelinePost',
						description: 'Create a timeline post',
						action: 'Create a timeline post',
					}
				],
				default: 'sendTimelinePost',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'chat',
						],
					},
				},
				options: [
					{
						name: 'Send Chat Message',
						value: 'sendChatMessage',
						description: 'Send a chat message to a user',
						action: 'Send a chat message to a user',
					}
				],
				default: 'sendChatMessage',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'user',
						],
					},
				},
				options: [
					{
						name: 'Find User',
						value: 'findUser',
						description: 'Find a user by display name',
						action: 'Find a user by display name',
					},
				],
				default: 'findUser',
			},
			{
				displayName: 'Timeline Message',
				name: 'timeline',
				type: 'string',
				typeOptions: {
				},
				required: true,
				displayOptions: {
					show: {
						resource: [
							'timeline',
						],
						operation: [
							'sendTimelinePost'
						],
					},
				},
				default: '',
				description: 'Select the workspaces to get information. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'User Name',
				name: 'userName',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'The user name to search for',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'user',
						],
						operation: [
							'findUser'
						],
					},
				}
			},
			{
				displayName: 'Receiver',
				name: 'receiver',
				type: 'json',
				default: '',
				placeholder: '',
				description: 'The entity of the message receiver',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'chat',
						],
						operation: [
							'sendChatMessage'
						],
					},
				}
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'The message payload',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'chat',
						],
						operation: [
							'sendChatMessage'
						],
					},
				}
			}
		],
	};
	// Methods to load options
	methods = {
		loadOptions: {

		},
	};

	// Adds the usableAsTool property dynamically
	constructor() {
		this.description.usableAsTool = true;

		this.description.displayName = 'Haiilo';
		this.description.codex = {
			categories: ['Haiilo'],
			subcategories: {
				'Haiilo': ['Timeline', 'Chat', 'User']
			},
			// Simplified name for AI usage (string array)
			alias: ['haiilo']
		};

		// If necessary, add other properties required for tools
		if (!this.description.triggerPanel) {
			Object.defineProperty(this.description, 'triggerPanel', {
				value: {},
				configurable: true
			});
		}
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);
		const length = items.length;

		try {
			// Execution based on selected resource and operation
			for (let i = 0; i < length; i++) {
				try {
					switch (resource) {
						case 'timeline':
							// Using modularized resources
							if (operation in resources.timeline) {
								// Execute the corresponding operation
								const results = await resources.timeline[operation].call(this, i);
								returnData.push(...results);
							}
							break;
						case 'chat':
							if (operation in resources.chat) {
								// Execute the corresponding operation
								const results = await resources.chat[operation].call(this, i);
								returnData.push(...results);
							}
							break;
						case 'user':
							if (operation in resources.user) {
								// Execute the corresponding operation
								const results = await resources.user[operation].call(this, i);
								returnData.push(...results);
							}
							break;
						default:
							throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported!`);
					}
				} catch (error) {
					if (this.continueOnFail()) {
						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray({ error: error.message }),
							{ itemData: { item: i } }
						);
						returnData.push(...executionData);
						continue;
					}
					throw error;
				}
			}

			return [returnData];
		} catch (error) {
			if (this.continueOnFail()) {
				return [this.helpers.returnJsonArray({ error: error.message })];
			}
			throw error;
		}
	}
}

// Export default para compatibilidade n8n
export default Haiilo;
