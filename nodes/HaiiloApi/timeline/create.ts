import { haiiloApiRequest } from '../shared/transport';
import { IExecuteFunctions } from 'n8n-workflow';

export async function createTimelinePost(self: IExecuteFunctions, recipientId: string, timelineMessage: string) {
	const post = {
		recipientIds: [recipientId],
		restricted: false,
		webPreviews: {},
		stickyExpiry: null,
		type: 'post',
		authorId: recipientId,
		data: { message: timelineMessage },
		attachments: [],
		fileLibraryAttachments: [],
	};
	console.log(post);
	const response = await haiiloApiRequest.call(self, 'POST', '/timeline-items', {},  post);
	return response;
}
