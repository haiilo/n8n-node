import { CallContext, haiiloApiRequest } from '../shared/transport';
import { Entity } from '../shared/pagedResult';

export async function getMe(self: CallContext): Promise<Entity> {
	const path = '/users/me';
	return await haiiloApiRequest.call(self, 'GET', path);
}
