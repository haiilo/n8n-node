import type {
	IDataObject,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IPollFunctions,
	ITriggerFunctions,
} from 'n8n-workflow';

export type CallContext =
	| IHookFunctions
	| IExecuteFunctions
	| IExecuteSingleFunctions
	| ILoadOptionsFunctions
	| ITriggerFunctions
	| IPollFunctions;
export async function haiiloApiRequest(
	this: CallContext,
	method: IHttpRequestMethods,
	path: string,
	qs: IDataObject = {},
	body: IDataObject | undefined = undefined,
) {
	const credentialType = 'haiiloOAuth2Api';
	const credentials = await this.getCredentials(credentialType);
	const host = (credentials!.tenantUrl as string).replace(/\/$/, '');
	const options: IHttpRequestOptions = {
		method: method,
		qs,
		body,
		url: `${host}/api${path}`,
		json: true,
	};
	return this.helpers.httpRequestWithAuthentication.call(this, credentialType, options);
}
