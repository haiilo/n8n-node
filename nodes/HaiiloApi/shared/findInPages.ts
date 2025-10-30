import type { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { haiiloApiRequest } from './transport';
import { Entity, PagedResult } from './pagedResult';

export async function findInPages<T extends Entity>(self: IExecuteFunctions,
																	method: IHttpRequestMethods,
																	path: string,
																	findFunc: (page: PagedResult<T>) => Promise<T | null>,
																	query?: IDataObject,
																	body?: IDataObject,
																	maxPages = 100)  {
	let page = 0;
	let done = false;
	do {
		const response: PagedResult<T> = await haiiloApiRequest.call(self, method, path, {
			...query,
			_page: page,
			_pageSize: 20,
		}, body);
		const item = await findFunc(response);
		if(item) {
			return item;
		}
		done = response.last;
		page++;
	} while(!done && page < maxPages);
	return null;
}