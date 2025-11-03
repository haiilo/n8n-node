
import { HaiiloCategory, HaiiloFunction } from '../../../HaiiloApi/HaiiloNodeRepository';
import { SendChatMessage } from '../chat/sendChatMessage';

export class Notifications extends HaiiloCategory {
	private functions = [new SendChatMessage()];
	getName(): string {
		return 'notification';
	}
	getDisplayName(): string {
		return 'Notifications';
	}
	getFunctions(): HaiiloFunction[] {
		return this.functions;
	}
}