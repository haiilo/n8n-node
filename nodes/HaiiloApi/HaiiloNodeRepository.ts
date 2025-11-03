import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { NodeParameterValueType, NodePropertyTypes } from 'n8n-workflow/dist/esm/interfaces';

export type NodeFunction = (this: IExecuteFunctions, executionIndex: number) => Promise<INodeExecutionData[]>;

export class HaiiloNodeRepository {
	private static _instance: HaiiloNodeRepository;
	private _categories: Record<string, HaiiloCategory> = {};
	private _nodes: Record<string, Record<string, NodeFunction>> = {};

	static get instance(): HaiiloNodeRepository {
		return HaiiloNodeRepository._instance;
	}

	constructor(...categories: HaiiloCategory[]) {
		HaiiloNodeRepository._instance = this;
		categories.forEach((category) => this.registerNodeCategory(category));
	}

	getHaiiloOptions(): Array<{ name: string; value: string }> {
		return this.getCategories().map((category) => ({
			name: category.getDisplayName(),
			value: category.getName(),
		}));
	}
	getCategories(): HaiiloCategory[] {
		return Object.values(this._categories);
	}
	getCategoryNames(): string[] {
		return Object.keys(this._categories);
	}
	getAllOperations(): INodeProperties[] {
		let operations: INodeProperties[] = [];
		this.getCategories().forEach((category) => {
			operations = operations.concat(category.getOperations());
		});

		return operations;
	}
	getAllParameters(): INodeProperties[] {
		const p = this.getCategories().flatMap((category => category.getAllParameters(category.getName())));
		console.log(JSON.stringify(p, null, 2));
		return p;

	}
	getNodeFunction(category: string, operation: string): NodeFunction | undefined {
		return this._nodes[category]?.[operation];
	}
	private registerNodeFunction(category: string, name: string, func: NodeFunction): void {
		this._nodes[category][name] = func;
	}
	private registerNodeCategory(category: HaiiloCategory): void {
		this._categories[category.getName()] = category;
		this._nodes[category.getName()] = {};
		category.getFunctions().forEach((func) => {
			this.registerNodeFunction(
				category.getName(),
				func.getName(),
				func.getFunction(),
			);
		});
	}
}

export abstract class HaiiloCategory {
	abstract getName(): string;
	abstract getDisplayName(): string;
	abstract getFunctions(): HaiiloFunction[];
	getOperations(): INodeProperties[] {
		return this.getFunctions().map((func) => ({
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			default: func.getName(),
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: [this.getName()],
				},
			},
			options: [
				{
					name: func.getDisplayName(),
					value: func.getName(),
					description: func.getDescription(),
					action: func.getDescription(),
				},
			],
		}));
	}
	getAllParameters(resource: string): INodeProperties[] {
		return this.getFunctions().flatMap((func) =>
			func.getParameters().map(parameter => ({
				...parameter,
				displayOptions: {
					show: {
						resource: [
							resource,
						],
						operation: [
							func.getName(),
						],
					},
				}
			})
		));
	}
}

export abstract class HaiiloFunction {
	abstract getName(): string;
	abstract getDisplayName(): string;
	abstract getDescription(): string;
	abstract getFunction(): NodeFunction;
	abstract getParameters(): HaiiloParameter[];
}

export interface HaiiloParameter extends Partial<INodeProperties> {
	displayName: string,
	name: string,
	type: NodePropertyTypes,
	default: NodeParameterValueType,
	placeholder: string,
	description: string,
	required: boolean,
}
