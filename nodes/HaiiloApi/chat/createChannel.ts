import type { IExecuteFunctions } from 'n8n-workflow';
import { haiiloApiRequest } from '../shared/transport';

export async function createChannel(self: IExecuteFunctions, userIdA: string, userIdB: string)  {
	const path = '/message-channels';
	const payload = {
		memberIds: [userIdA, userIdB],
		type: 'SINGLE',
		name: ''
	};
	return await haiiloApiRequest.call(self, 'GET', path, payload);
}