import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { getMe } from '../HaiiloApi/user/me';
import { createTimelinePost } from '../HaiiloApi/timeline/create';

export async function timelinePostAction(self: IExecuteFunctions) {
	const returnData:  IDataObject[] = [];

	const timelineMessage = self.getNodeParameter('timelineMessage', 0) as string;
	const me = await getMe(self);
	const response = await createTimelinePost(self, me.id, timelineMessage);
	returnData.push({ json: response.content ?? [] });
	return [returnData];
}
