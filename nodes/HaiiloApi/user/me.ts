import type { IExecuteFunctions } from 'n8n-workflow';
import { haiiloApiRequest } from '../shared/transport';

export async function getMe(self: IExecuteFunctions)  {
	const path = '/users/me';
	return await haiiloApiRequest.call(self, 'GET', path);
}