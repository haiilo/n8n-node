import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';
import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	IHttpRequestOptions,
	IHttpRequestHelper,
	IDataObject,
} from 'n8n-workflow';

export class HaiiloOAuth2Api implements ICredentialType {
	name = 'haiiloOAuth2Api';

	displayName = 'Haiilo OAuth2 API';

	icon: Icon = { light: 'file:../icons/haiilo.svg', dark: 'file:../icons/haiilo.dark.svg' };

	documentationUrl = 'https://docs.haiilo.com/restdoc/latest/general';

	properties: INodeProperties[] = [
		{
			displayName: 'Tenant URL',
			name: 'tenantUrl',
			type: 'string',
			default: 'https://next.coyostaging.com',
			required: true,
			description: 'Your Haiilo tenant URL (without trailing slash)',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			default: '',
			required: true,
			typeOptions: { password: true },
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'access_token',
			type: 'hidden',
			default: '',
			typeOptions: {
				expirable: true, password: true,
			}
		}
	];

	async preAuthentication(
		this: IHttpRequestHelper,
		credentials: ICredentialDataDecryptedObject,
	): Promise<IDataObject> {
		const tenantUrl = (credentials.tenantUrl as string).replace(/\/$/, '');
		const basicAuth = Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64');

		const response = await this.helpers.httpRequest({
			method: 'POST',
			url: `${tenantUrl}/api/oauth/token`,
			headers: {
				'Authorization': `Basic ${basicAuth}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `grant_type=password&username=${encodeURIComponent(credentials.username as string)}&password=${encodeURIComponent(credentials.password as string)}`,
		});
		console.log(response);
		return { access_token: response.access_token };
	}

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {

		if (!requestOptions.headers) {
			requestOptions.headers = {};
		}

		requestOptions.headers['Authorization'] = `Bearer ${credentials.access_token}`;

		return requestOptions;
	}

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: '={{$credentials.tenantUrl}}/web/users/me',
		},
	};
}
