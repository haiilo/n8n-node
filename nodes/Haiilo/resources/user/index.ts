
import { HaiiloCategory, HaiiloFunction } from '../../../HaiiloApi/HaiiloNodeRepository';
import { FindUser } from './findUser';

export class User extends HaiiloCategory {
	private functions = [new FindUser()];
	getName(): string {
		return 'user';
	}
	getDisplayName(): string {
		return 'User';
	}
	getFunctions(): HaiiloFunction[] {
		return this.functions;
	}
}