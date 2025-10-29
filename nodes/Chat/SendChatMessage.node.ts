import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { haiiloApiRequest } from '../HaiiloApi/shared/transport';
import { findMessageChannel } from '../HaiiloApi/chat/findMessageChannel';
import { createChannel } from '../HaiiloApi/chat/createChannel';
import { getMe } from '../HaiiloApi/user/me';
import { uuid } from '../HaiiloApi/uuid';

export class SendChatMessage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Haiilo Chat Message',
		name: 'sendChatMessage',
		icon: { light: 'file:../../icons/haiilo.svg', dark: 'file:../../icons/haiilo.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Sends a chat message in Haiilo',
		defaults: {
			name: 'Haiilo Send Chat Message',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'haiiloOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'The recipient user ID',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				placeholder: 'Greeting from n8n!',
				description: 'The content of the chat message',
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const input = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < input.length; i++) {
			const userId = this.getNodeParameter('userId', i) as string;
			const message = this.getNodeParameter('message', i) as string;
			const me = await getMe(this);
			let channelId = await findMessageChannel(this, me.id, userId);
			console.log("Channel id", channelId);
			if (!channelId) {
				const newChannel = await createChannel(this, userId);
				channelId = newChannel.id;
				console.log("Channel id", channelId);
			}

			const path = `/message-channels/${channelId}/messages`;
			const data = {
				attachments: [],
				fileLibraryAttachments: [],
				clientMessageId: uuid(),
				data: {
					message,
				}
			}
			const response = await haiiloApiRequest.call(this, 'POST', path, {}, data);

			returnData.push({ json: response });
		}
		return [returnData];
	}
}
