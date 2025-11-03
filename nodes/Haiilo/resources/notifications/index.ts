
import { HaiiloCategory, HaiiloFunction } from '../../../HaiiloApi/HaiiloNodeRepository';
import { SendNotification } from './sendNotification';

export class Notifications extends HaiiloCategory {
	private functions = [new SendNotification()];
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