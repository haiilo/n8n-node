import type { IExecuteFunctions } from 'n8n-workflow';
import { haiiloApiRequest } from '../shared/transport';
import { Entity } from '../shared/pagedResult';

export async function createChannel(self: IExecuteFunctions, user: Entity)  {
	const path = '/message-channels';
	const payload = {
		memberIds: [user.id],
		type: 'SINGLE',
		name: ''
	};
	return await haiiloApiRequest.call(self, 'POST', path, {}, payload);
}