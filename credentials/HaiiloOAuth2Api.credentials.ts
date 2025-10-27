import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';
import { IAuthenticate, ICredentialDataDecryptedObject, IHttpRequestOptions } from 'n8n-workflow/dist/esm/interfaces';

export class HaiiloOAuth2Api implements ICredentialType {
	name = 'haiiloOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Haiilo OAuth2 API';

	icon: Icon = { light: 'file:../icons/github.svg', dark: 'file:../icons/github.dark.svg' };

	documentationUrl = 'https://docs.haiilo.com/restdoc/latest/general';

	properties: INodeProperties[] = [
		{
			displayName: 'Tenant url (host)',
			name: 'tenantUrl',
			type: 'string',
			default: 'https://my-tenant.haiilo.app/',
			required: true
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
		}
	];
	authenticate: IAuthenticate = (
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions) => {
		// base64 encode username:password (browser-compatible
		const bearerToken = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
		if(!requestOptions.headers) requestOptions.headers = {};
		requestOptions.headers['Authorization'] = 'Basic ' + bearerToken;
		requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		// parse tenant url and attach path and query
		const tenantUrl = new URL(credentials.tenantUrl as string);
		tenantUrl.pathname = '/api/oauth/token';
		tenantUrl.searchParams.append('grant_type', 'password');
		tenantUrl.searchParams.append('password', credentials.password as string);
		tenantUrl.searchParams.append('username', credentials.username as string);
		requestOptions.url = tenantUrl.toString();
		return Promise.resolve(requestOptions);
	};
}
