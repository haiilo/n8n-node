import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { findMessageChannel } from '../../../HaiiloApi/chat/findMessageChannel';
import { createChannel } from '../../../HaiiloApi/chat/createChannel';
import { uuid } from '../../../HaiiloApi/uuid';
import { haiiloApiRequest } from '../../../HaiiloApi/shared/transport';
import { Entity } from '../../../HaiiloApi/shared/pagedResult';
import {
	HaiiloFunction,
	HaiiloParameter,
	NodeFunction,
} from '../../../HaiiloApi/HaiiloNodeRepository';

async function sendChatMessage(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const receiver = this.getNodeParameter('receiver', i) as Entity;
	const message = this.getNodeParameter('message', i) as string;
	let channel = await findMessageChannel(this, receiver);
	console.log("Channel", channel);
	if (!channel) {
		channel = await createChannel(this, receiver);
		console.log("Channel", channel);
	}

	const path = `/message-channels/${channel?.id}/messages`;
	const data = {
		attachments: [],
		fileLibraryAttachments: [],
		clientMessageId: uuid(),
		data: {
			message,
		}
	}
	const result = await haiiloApiRequest.call(this, 'POST', path, {}, data);
	return [{ json: result }]
}

export class SendChatMessage extends HaiiloFunction {
	getFunction(): NodeFunction {
		return sendChatMessage;
	}
	getName(): string {
		return 'sendChatMessage';
	}
	getDisplayName(): string {
		return 'Send Chat Message';
	}
	getDescription(): string {
		return 'Send a chat message to a user';
	}
	getParameters(): HaiiloParameter[] {
		return [
				{
					displayName: 'Receiver',
					name: 'receiver',
					type: 'json',
					default: '',
					placeholder: '',
					description: 'The entity of the message receiver',
					required: true,
				},
				{
					displayName: 'Message',
					name: 'message',
					type: 'string',
					default: '',
					placeholder: '',
					description: 'The message payload',
					required: true,
				}
			]
	}
}