import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { findInPages } from '../../../HaiiloApi/shared/findInPages';
import { Entity } from '../../../HaiiloApi/shared/pagedResult';

export async function findUser(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const userName = this.getNodeParameter('userName', i) as Entity;
	const path = `/users?displayName=${userName}&status=ACTIVE&with=adminFields`;
	const result = await findInPages(this, 'GET', path, async (page) =>  page.content[0] ?? null)
	return [{ json: result ?? {}}]
}