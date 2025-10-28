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
			name: 'Find User',
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
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 0,
				placeholder: '0',
				description: 'The page number to retrieve',
			},
			{
				displayName: 'Items Per Page',
				name: 'itemsPerPage',
				type: 'number',
				default: 10,
				placeholder: '10',
				description: 'The number of items to retrieve per page',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const input = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < input.length; i++) {
			const searchTerm = this.getNodeParameter('userName', i) as string;
			const path = `/users?displayName=${searchTerm}&status=ACTIVE&with=adminFields`;
			const response = await haiiloApiRequest.call(this, 'GET', path, {
				page: this.getNodeParameter('page', i) as number,
				per_page: this.getNodeParameter('itemsPerPage', 0) as number,
			});

			returnData.push({ json: response.content ?? [] });
		}
		return [returnData];
	}
}