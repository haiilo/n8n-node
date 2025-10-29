import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { haiiloApiRequest } from '../HaiiloApi/shared/transport';
import { getAllMessageChannels } from '../HaiiloApi/chat/getAllChannels';
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

			const channels = await getAllMessageChannels(this, userId);
			if (channels.length < 1) {
				const me = await getMe(this);
				const newChannel = await createChannel(this, me.id, userId);
				channels.push(newChannel);
			}

			const path = `/message-channels/${channels[0].id}/messages`;
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
