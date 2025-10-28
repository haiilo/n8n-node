import type {
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodeListSearchItems,
} from 'n8n-workflow';
import { haiiloApiRequest } from '../shared/transport';

type TimelineItem = {
	id: string;
	slug: string;
	displayName: string;
};

type TimelineResponse = {
	items: TimelineItem[];
};

export async function getSenders(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? + paginationToken : 1;
	const per_page = 10;

	let responseData: TimelineResponse = {
		items: [
			{
				id: '',
				slug: '',
				displayName: '',
			},
		],
	};

	responseData = await haiiloApiRequest.call(this, 'GET', 'senders/timeline', {
		q: '',
		page,
		per_page,
	});

	const results: INodeListSearchItems[] = responseData.items.map((item: TimelineItem) => ({
		name: item.displayName,
		value: item.id,
	}));
	return { results };
}
