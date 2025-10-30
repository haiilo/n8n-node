import { IExecuteFunctions } from 'n8n-workflow';
import { haiiloApiRequest } from '../shared/transport';
import { Entity } from '../shared/pagedResult';

export async function getMe(self: IExecuteFunctions): Promise<Entity>  {
	const path = '/users/me';
	return await haiiloApiRequest.call(self, 'GET', path);
}
