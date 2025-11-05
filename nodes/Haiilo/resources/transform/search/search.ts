
import { HaiiloCategory, HaiiloFunction } from '../../../../HaiiloApi/HaiiloNodeRepository';
import { SimpleSearch } from './simpleSearch';

export class Search extends HaiiloCategory {
	private functions = [new SimpleSearch()];
	getName(): string {
		return 'search';
	}
	getDisplayName(): string {
		return 'Search';
	}
	getFunctions(): HaiiloFunction[] {
		return this.functions;
	}
}