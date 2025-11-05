import type { IDataObject } from 'n8n-workflow';
import { CallContext, haiiloApiRequest } from './transport';
import { Entity, PagedResult } from './pagedResult';

export async function getAllPages<T extends Entity>(
	self: CallContext,
	path: string,
	query?: IDataObject,
	body?: IDataObject,
	maxPages = 100,
): Promise<T[]> {
	let page = 0;
	let done = false;
	const result = new Array<T>();
	do {
		const response: PagedResult<T> = await haiiloApiRequest.call(
			self,
			'GET',
			path,
			{
				...query,
				_page: page,
				_pageSize: 20,
				_orderBy: 'updated,DESC',
			},
			body,
		);
		result.push(...response.content);
		done = response.last;
		page++;
	} while (!done && page < maxPages);
	return result;
}
