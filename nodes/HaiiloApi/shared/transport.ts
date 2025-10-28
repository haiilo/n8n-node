import type {
	IHookFunctions,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export async function haiiloApiRequest(
	this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
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
