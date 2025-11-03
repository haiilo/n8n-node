import { SendChatMessage } from './sendChatMessage';
import { HaiiloCategory, HaiiloFunction } from '../../../HaiiloApi/HaiiloNodeRepository';


export class Chat extends HaiiloCategory {
	private functions = [new SendChatMessage()];
	getName(): string {
		return 'chat';
	}
	getDisplayName(): string {
		return 'Chat';
	}
	getFunctions(): HaiiloFunction[] {
		return this.functions;
	}
}