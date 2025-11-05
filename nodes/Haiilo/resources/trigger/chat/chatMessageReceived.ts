import type { INodeExecutionData, IPollFunctions } from 'n8n-workflow';
import {
	HaiiloFunction,
	HaiiloParameter,
	TriggerFunction,
} from '../../../../HaiiloApi/HaiiloNodeRepository';
import { getAllPages } from '../../../../HaiiloApi/shared/getAllPages';
import { Entity } from '../../../../HaiiloApi/shared/pagedResult';
import { getMe } from '../../../../HaiiloApi/user/me';

async function chatMessageReceived(this: IPollFunctions): Promise<INodeExecutionData[]> {
	const result: Entity[] = [];
	const me = await getMe(this);
	const channels = await getAllPages(this, '/message-channels', {
		userId: me.id,
		_orderBy: 'updated,DESC',
	});
	console.log('Found', channels.length, 'message channels');
	const workflowData = this.getWorkflowStaticData('node');
	for (const channel of channels) {
		const storedLastMessage = workflowData[`channel_${channel.id}_lastMessageId`] as
			| string
			| undefined;
		const lastMessage = channel.lastCreatedMessage as Entity | undefined;
		if (lastMessage && storedLastMessage !== lastMessage.id && lastMessage.author && (lastMessage.author as Entity)?.id !== me.id) {
			workflowData[`channel_${channel.id}_lastMessageId`] = lastMessage.id;
			result.push(lastMessage);
		}
	}
	return result.length > 0 ? [{ json: { messages: result } }] : [];
}

export class ChatMessageReceived extends HaiiloFunction<TriggerFunction> {
	getFunction(): TriggerFunction {
		return chatMessageReceived;
	}
	getName(): string {
		return 'chatMessageReceived';
	}
	getDisplayName(): string {
		return 'Chat Message Received';
	}
	getDescription(): string {
		return 'When a new chat message is received';
	}
	getParameters(): HaiiloParameter[] {
		return [];
	}
}
