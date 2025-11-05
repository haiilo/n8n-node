import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	IPollFunctions
} from 'n8n-workflow';
import { NodeParameterValueType, NodePropertyTypes } from 'n8n-workflow/dist/esm/interfaces';


export type TransformFunction = (this: IExecuteFunctions, executionIndex: number) => Promise<INodeExecutionData[] | null>;
export type TriggerFunction = (this: IPollFunctions) => Promise<INodeExecutionData[]>;

// Map each NodeGroup to its corresponding function type
type NodeGroupFunctionMap = {
	'input': TransformFunction;
	'output': TransformFunction;
	'organization': TransformFunction;
	'schedule': TransformFunction;
	'transform': TransformFunction;
	'trigger': TriggerFunction;
};

export type NodeGroup = keyof NodeGroupFunctionMap;

export class HaiiloNodeRepository<G extends NodeGroup> {
	private static _instances: Partial<Record<NodeGroup, HaiiloNodeRepository<NodeGroup>>> = {};
	private _categories: Record<string, HaiiloCategory<NodeGroupFunctionMap[G]>> = {};
	private _nodes: Record<string, Record<string, NodeGroupFunctionMap[G]>> = {};

	static getInstance<G extends NodeGroup>(group: G): HaiiloNodeRepository<G> {
		return HaiiloNodeRepository._instances[group] as HaiiloNodeRepository<G>;
	}

	constructor(group: G, ...categories: HaiiloCategory<NodeGroupFunctionMap[G]>[]) {
		HaiiloNodeRepository._instances[group] = this;
		categories.forEach((category) => this.registerNodeCategory(category));
		console.log("Registered HaiiloNodeRepository for group:", group);
		for (const category of categories) {
			console.log(`- Category: ${category.getName()}`);
			for (const func of category.getFunctions()) {
				console.log(`  - Function: ${func.getName()}`);
			}
		}
	}

	getHaiiloOptions(): Array<{ name: string; value: string }> {
		const opts =  this.getCategories().map((category) => ({
			name: category.getDisplayName(),
			value: category.getName(),
		}));
		console.log("########################");
		console.log(JSON.stringify(opts, null, 2));
		console.log(JSON.stringify(this._categories, null, 2));
		console.log("########################");
		return opts;
	}
	getCategories(): HaiiloCategory<NodeGroupFunctionMap[G]>[] {
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
		const p = this.getCategories()
			.flatMap((category => category.getAllParameters(category.getName())));
		return p;

	}
	getNodeFunction(category: string, operation: string): NodeGroupFunctionMap[G] | undefined {
		return this._nodes[category]?.[operation];
	}
	private registerNodeFunction(category: string, name: string, func: NodeGroupFunctionMap[G]): void {
		this._nodes[category][name] = func;
	}
	private registerNodeCategory(category: HaiiloCategory<NodeGroupFunctionMap[G]>): void {
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

export abstract class HaiiloCategory<T extends TransformFunction | TriggerFunction = TransformFunction> {
	abstract getName(): string;
	abstract getDisplayName(): string;
	abstract getFunctions(): HaiiloFunction<T>[];
	getGroup(): NodeGroup {
		return 'transform';
	}
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
					action: func.getDisplayName(),
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

export abstract class HaiiloFunction<T extends TransformFunction | TriggerFunction = TransformFunction> {
	abstract getName(): string;
	abstract getDisplayName(): string;
	abstract getDescription(): string;
	abstract getFunction(): T;
	abstract getParameters(): HaiiloParameter[];
}

export interface HaiiloParameter extends Partial<INodeProperties> {
	displayName: string,
	name: string,
	type: NodePropertyTypes,
	default: NodeParameterValueType,
	placeholder: string,
	description: string,
	required?: boolean,
}
