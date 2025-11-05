
import {
	HaiiloCategory,
	HaiiloFunction, TriggerFunction,
} from '../../../../HaiiloApi/HaiiloNodeRepository';
import { ChatMessageReceived } from './chatMessageReceived';


export class Chat extends HaiiloCategory<TriggerFunction> {
	private functions = [new ChatMessageReceived()];
	getName(): string {
		return 'chatTrigger';
	}
	getDisplayName(): string {
		return 'Chat Trigger';
	}
	getFunctions(): HaiiloFunction<TriggerFunction>[] {
		return this.functions;
	}
}