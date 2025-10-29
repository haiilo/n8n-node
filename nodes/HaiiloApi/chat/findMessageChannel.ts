import type { IExecuteFunctions } from 'n8n-workflow';
import { haiiloApiRequest } from '../shared/transport';

export async function findMessageChannel(self: IExecuteFunctions, userIdA: string, userIdB: string)  {
	const path = '/message-channels';
	let page = 0;
	let done = false;
	console.log("Looking for existing message channel between ", userIdA, " and ", userIdB);
	do {
		const response = await haiiloApiRequest.call(self, 'GET', path, {
			_page: page++,
			_pageSize: 20,
			userIdA,
			_orderBy: 'updated, DESC',
		});
		console.log("Found ", response.content.length, " channels on page ", page);
		const channels = response.content;
		for(const channel of channels) {
			console.log("Checking channel ", channel.id);
			if(channel.type === 'SINGLE' && channel.members.includes((c: { user?: { id: string }}) => c.user?.id === userIdB)) {
				console.log("Found existing channel ", channel.id);
				return channel.id;
			}
		}
		done = response.last;
		} while(!done && page < 100);
	console.log("No existing channel found");
	return null;
}