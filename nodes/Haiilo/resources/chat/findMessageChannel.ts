import type { IExecuteFunctions } from 'n8n-workflow';
import { Entity } from '../../../HaiiloApi/shared/pagedResult';
import { findInPages } from '../../../HaiiloApi/shared/findInPages';
type Member = { user?: Entity };
type Channel = { type: string, members: Member[] } & Entity;

export async function findMessageChannel(self: IExecuteFunctions, user: Entity): Promise<Entity | null>  {
	return await findInPages<Channel>(self, 'GET', '/message-channels', async (page) => {
		for(const channel of page.content) {
			console.log("Checking channel ", channel.id);
			if(channel.type === 'SINGLE' && channel.members.some((c: Member) => c.user?.id === user.id)) {
				console.log("Found existing channel ", channel.id);
				return channel;
			}
		}
		return null;
	}, {
		_orderBy: 'updated, DESC'
	});
}