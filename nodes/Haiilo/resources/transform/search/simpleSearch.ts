import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { haiiloApiRequest } from '../../../../HaiiloApi/shared/transport';
import { Entity } from '../../../../HaiiloApi/shared/pagedResult';
import {
	HaiiloFunction,
	HaiiloParameter,
	TransformFunction,
} from '../../../../HaiiloApi/HaiiloNodeRepository';

async function simpleSearch(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[] | null> {
	const term = this.getNodeParameter('term', i) as Entity;
	const language = this.getNodeParameter('language', i) as string;
	if(!term) {
		return null;
	}
  // https://coyo2.eu.ngrok.io/web/global-search?searchTerm=test&sort=SCORE,desc&semanticEnabled=false&language=en&fallbackLanguage=en&operator=OR&skipAggregations=false
	const path = `/global-search`;
	const query = {
		searchTerm: term,
		sort: 'SCORE,desc',
		semanticEnabled: 'false',
		language: language || 'en',
		fallbackLanguage: 'en',
		operator: 'OR',
		skipAggregations: 'false',
	};
	const result = await haiiloApiRequest.call(this, 'GET', path, query);
	return [{ json: result }];
}

export class SimpleSearch extends HaiiloFunction {
	getFunction(): TransformFunction {
		return simpleSearch;
	}
	getName(): string {
		return 'simpleSearch';
	}
	getDisplayName(): string {
		return 'Simple Search';
	}
	getDescription(): string {
		return 'Search for a term';
	}
	getParameters(): HaiiloParameter[] {
		return [
			{
				displayName: 'Search Term',
				name: 'term',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'What to search for',
				required: true,
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: 'en',
				placeholder: '',
				description: 'The language to use for the search',
			}
		];
	}
}
