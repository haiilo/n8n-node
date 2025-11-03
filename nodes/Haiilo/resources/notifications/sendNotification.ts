import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { haiiloApiRequest } from '../../../HaiiloApi/shared/transport';
import { Entity } from '../../../HaiiloApi/shared/pagedResult';
import { getMe } from '../../../HaiiloApi/user/me';
import {
	HaiiloFunction,
	HaiiloParameter,
	NodeFunction,
} from '../../../HaiiloApi/HaiiloNodeRepository';

async function sendNotification(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
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
			name: 'external_link',
			displayName: 'View Article',
			params: {
				url: link,
				newTab: 'true',
			},
		},
	};
	const result = await haiiloApiRequest.call(this, 'POST', path, {}, data);
	return [{ json: result }];
}

export class SendNotification extends HaiiloFunction {
	getFunction(): NodeFunction {
		return sendNotification;
	}
	getName(): string {
		return 'sendNotification';
	}
	getDisplayName(): string {
		return 'Send Notification';
	}
	getDescription(): string {
		return 'Sends a notification to a user';
	}
	getParameters(): HaiiloParameter[] {
		return [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'The message title',
				required: true,
			},
			{
				displayName: 'Link (URL)',
				name: 'linkUrl',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'A link target',
				required: true,
			},
			{
				displayName: 'Target Channel',
				name: 'notificationChannel',
				type: 'multiOptions',
				default: ['WEB'],
				placeholder: '',
				description: 'The distribution channel for the notification',
				required: true,
			},
		];
	}
}
