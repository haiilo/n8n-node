import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { haiiloApiRequest } from '../../../HaiiloApi/shared/transport';
import { Entity } from '../../../HaiiloApi/shared/pagedResult';
import { getMe } from '../../../HaiiloApi/user/me';

export async function sendNotification(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const receiver = this.getNodeParameter('receiver', i) as Entity;
	const title = this.getNodeParameter('title', i) as string;
	const message = this.getNodeParameter('message', i) as string;
	const channel = (this.getNodeParameter('notificationChannel', i) as string) ?? 'WEB';
	const link = this.getNodeParameter('linkUrl', i) as string;
	const me = await getMe(this);
	const tenantId = me.tenantId;

	const path = `/notifications`;
	const data = {
		senderId: me.id,
		receiverId: receiver.id,
		tenantId: tenantId,
		messages: { [channel]: title },
		excerpt: message,
		typeName: 'external-article',
		category: 'ACTIVITY',
		externalNotificationTarget: {
			name: "external_link",
			displayName: "View Article",
	  	params: {
				url: link,
				 newTab: "true"
			 }
		}
	}
	const result = await haiiloApiRequest.call(this, 'POST', path, {}, data);
	return [{ json: result }]
}