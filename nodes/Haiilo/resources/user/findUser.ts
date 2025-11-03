import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { findInPages } from '../../../HaiiloApi/shared/findInPages';
import { Entity } from '../../../HaiiloApi/shared/pagedResult';
import {
	HaiiloFunction,
	HaiiloParameter,
	NodeFunction,
} from '../../../HaiiloApi/HaiiloNodeRepository';

async function findUser(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const userName = this.getNodeParameter('userName', i) as Entity;
	const path = `/users?displayName=${userName}&status=ACTIVE&with=adminFields`;
	const result = await findInPages(this, 'GET', path, async (page) =>  page.content[0] ?? null)
	return [{ json: result ?? {}}]
}

export class FindUser extends HaiiloFunction {
	getFunction(): NodeFunction {
		return findUser;
	}
	getName(): string {
		return 'findUser';
	}
	getDisplayName(): string {
		return 'Find User';
	}
	getDescription(): string {
		return 'Finds a user by their display name';
	}
	getParameters(): HaiiloParameter[] {
		return [{
			displayName: 'User Name',
			name: 'userName',
			type: 'string',
			default: '',
			placeholder: '',
			description: 'The user name to search for',
			required: true
		}];
	}
}