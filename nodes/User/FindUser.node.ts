import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { haiiloApiRequest } from '../HaiiloApi/shared/transport';

export class FindUser implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Find User',
		name: 'findUser',
		icon: { light: 'file:../../icons/haiilo.svg', dark: 'file:../../icons/haiilo.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Finds a user in Haiilo',
		defaults: {
			name: 'Example',
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
			{
				displayName: 'User Name',
				name: 'userName',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'The user name to search for',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const input = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < input.length; i++) {
			const searchTerm = this.getNodeParameter('userName', 0) as string;
			const response = await haiiloApiRequest.call(this, 'GET', `/users?displayName=${searchTerm}&status=ACTIVE&with=adminFields`, {
				q: ``,
				page: 0,
				per_page: 10,
			});

			returnData.push({ json: response.content ?? [] });
		}
		return [returnData];
	}
}