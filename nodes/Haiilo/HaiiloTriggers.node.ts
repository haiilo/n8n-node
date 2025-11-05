import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	NodeOperationError,
} from 'n8n-workflow';
import { HaiiloNodeRepository } from '../HaiiloApi/HaiiloNodeRepository';
import { Chat } from './resources/trigger/chat/chat';

interface IExtendedNodeTypeDescription extends INodeTypeDescription {
	codex?: {
		categories: string[];
		subcategories: Record<string, string[]>;
		alias: string[];
	};
	triggerPanel?: Record<string, IDataObject>;
}


export class HaiiloTriggers implements INodeType {
	repo = new HaiiloNodeRepository(
		'trigger',
		new Chat()
	);
	description: IExtendedNodeTypeDescription = {
		displayName: 'Haiilo Triggers',
		name: 'haiiloTriggers',
		icon: 'file:../../icons/haiilo.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Get trigger from Haiilo events',
		usableAsTool: true,
		polling: true,
		defaults: {
			name: 'Haiilo Triggers',
		},
		inputs: [],
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
		const repo = HaiiloNodeRepository.getInstance('trigger');
		this.description.usableAsTool = true;
		this.description.displayName = 'Haiilo Triggers';
		this.description.codex = {
			categories: ['haiiloTriggers'],
			subcategories: {
				'Haiilo Triggers': repo.getCategoryNames()
			},
			// Simplified name for AI usage (string array)
			alias: ['haiilo Triggers']
		};

		// If necessary, add other properties required for tools
		if (!this.description.triggerPanel) {
			Object.defineProperty(this.description, 'triggerPanel', {
				value: {},
				configurable: true
			});
		}
	}

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		try {
			const repo = HaiiloNodeRepository.getInstance('trigger');
			const func = repo.getNodeFunction(resource, operation);
			if (func) {
				const results = await func.call(this);
				if (results !== null) {
					returnData.push(...results);
				}
			} else {
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported for resource "${resource}"!`,
				);
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
		if (returnData.length === 0) {
			return [];
		}
		return [returnData];
	}
}

export default HaiiloTriggers;
