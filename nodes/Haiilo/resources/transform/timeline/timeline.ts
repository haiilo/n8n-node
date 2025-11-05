
import { HaiiloCategory, HaiiloFunction } from '../../../../HaiiloApi/HaiiloNodeRepository';
import { SendTimelinePost } from './sendTimelinePost';

export class Timeline extends HaiiloCategory {
	private functions = [new SendTimelinePost()];
	getName(): string {
		return 'timeline';
	}
	getDisplayName(): string {
		return 'Timeline';
	}
	getFunctions(): HaiiloFunction[] {
		return this.functions;
	}
}