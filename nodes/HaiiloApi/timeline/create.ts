import { CallContext, haiiloApiRequest } from '../shared/transport';

export async function createTimelinePost(
	self: CallContext,
	recipientId: string,
	timelineMessage: string,
) {
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
	const response = await haiiloApiRequest.call(self, 'POST', '/timeline-items', {}, post);
	return response;
}
