import type { IExecuteFunctions } from 'n8n-workflow';
import { haiiloApiRequest } from '../shared/transport';

export async function createChannel(self: IExecuteFunctions, userId: string)  {
	const path = '/message-channels';
	const payload = {
		memberIds: [userId],
		type: 'SINGLE',
		name: ''
	};
	return await haiiloApiRequest.call(self, 'POST', path, {}, payload);
}