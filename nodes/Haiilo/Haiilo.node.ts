import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { HaiiloNodeRepository } from '../HaiiloApi/HaiiloNodeRepository';
import { Notification } from './resources/notification/notification';
import { Chat } from './resources/chat/chat';
import { Timeline } from './resources/timeline/timeline';
import { User } from './resources/user/user';

interface IExtendedNodeTypeDescription extends INodeTypeDescription {
	codex?: {
		categories: string[];
		subcategories: Record<string, string[]>;
		alias: string[];
	};
	triggerPanel?: Record<string, IDataObject>;
}


export class Haiilo implements INodeType {
	repo = new HaiiloNodeRepository(
		new Chat(),
		new Notification(),
		new Timeline(),
		new User()
	);
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
				options: this.repo.getHaiiloOptions(),
				default: '',
			},
			...this.repo.getAllOperations(),
			...this.repo.getAllParameters(),
		],
	};

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
					const repo = HaiiloNodeRepository.instance;
					const func = repo.getNodeFunction(resource, operation);
					if (func) {
						const results = await func.call(this, i);
						returnData.push(...results);
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for resource "${resource}"!`);
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

export default Haiilo;
