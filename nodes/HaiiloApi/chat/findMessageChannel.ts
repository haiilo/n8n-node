import { Entity } from '../shared/pagedResult';
import { findInPages } from '../shared/findInPages';
import { CallContext } from '../shared/transport';

type Member = { user?: Entity };
type Channel = { type: string; members: Member[] } & Entity;

export async function findMessageChannel(self: CallContext, user: Entity): Promise<Entity | null> {
	return await findInPages<Channel>(
		self,
		'GET',
		'/message-channels',
		async (page) => {
			for (const channel of page.content) {
				console.log('Checking channel ', channel.id);
				if (
					channel.type === 'SINGLE' &&
					channel.members.some((c: Member) => c.user?.id === user.id)
				) {
					console.log('Found existing channel ', channel.id);
					return channel;
				}
			}
			return null;
		},
		{
			_orderBy: 'updated, DESC',
		},
	);
}
