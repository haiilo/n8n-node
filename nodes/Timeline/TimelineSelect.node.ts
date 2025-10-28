import type {
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	IExecuteFunctions,
} from 'n8n-workflow';

export class TimelineSelect implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Item Fetcher',
		name: 'timelineSelect',
		group: ['transform'],
		version: 1,
		description: 'Fetch timelines from an Haiilo API and provide them as selectable timelines',
		defaults: {
			name: 'Timeline Select',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Item Name or ID',
				name: 'itemId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'fetchTimelines',
				},
				default: '',
				description: 'Select an item fetched from the API. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
		icon: { light: 'file:../../icons/haiilo.svg', dark: 'file:../../icons/haiilo.dark.svg' },
		usableAsTool: true,
	};

	// Load items dynamically for the dropdown
	methods = {
		loadOptions: {
			async fetchTimelines(this: ILoadOptionsFunctions) {
				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: 'https://coyo2.eu.ngrok.io/api/',
					json: true,
				});

				// Assume API returns: [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }]
				const returnData = [];
				for (const item of response) {
					returnData.push({
						name: item.name,
						value: item.id,
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];

		for (let i = 0; i < items.length; i++) {
			const itemId = this.getNodeParameter('itemId', i) as string;
			returnData.push({ json: { selectedItemId: itemId } });
		}

		return this.prepareOutputData(returnData);
	}
}
