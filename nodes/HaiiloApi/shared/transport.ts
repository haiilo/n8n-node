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
	const options: IHttpRequestOptions = {
		method: method,
		qs,
		body,
		url: `https://haiilo.com/api/${path}`,
		json: true,
	};

	const credentialType = 'haiiloOAuth2Api';

	return this.helpers.httpRequestWithAuthentication.call(this, credentialType, options);
}
