import { defineOperationApi } from '@directus/extensions-sdk';
import type { Accountability } from '@directus/types';
import axios from 'axios';
import { isAxiosError } from 'axios';
// FIXME: needed?
// import encodeUrl from 'encodeurl'; 
// FIXME: getAccountabilityForRole is not exported yet by directus utils
// https://github.com/directus/directus/discussions/5820
// import { getAccountabilityForRole } from '@directus/utils';

type Options = {
	url: string;
	fileName: string;
	folder?: string;
	headers?: { header: string; value: string }[] | null;
	permissions?: string; // target is $public, $trigger, $full, or UUID of a role
	storage?: string;
};

export default defineOperationApi<Options>({
	id: 'euryecetelecom-download-store-file',
	handler: async ({ url, fileName, folder, storage, headers, permissions }, { accountability, database, getSchema, logger, services }) => {
		const customHeaders = headers?.reduce(
			(acc, { header, value }) => {
				acc[header] = value;
				return acc;
			},
			{} as Record<string, string>,
		) ?? {};

		let customAccountability: Accountability | null;
		if (!permissions || permissions === '$trigger') {
			customAccountability = accountability;
		} else if (permissions === '$full') {
			customAccountability = {
				user: null,
				role: null,
				admin: true,
				app: true,
				permissions: [],
			};
		} else {
			logger.error("Unsupported permission specified: " + permissions);
			throw "Unsupported permission specified: " + permissions;
		}

		const schema = await getSchema({ database });
		let filesService = new services.FilesService({
			knex: database,
			schema: schema,
			accountability: customAccountability,
		});

		let customStorage = 'local';
		if(storage && storage != ''){
			customStorage = storage;
		}
		let primaryKey;
		try {
			await axios({
				// url: encodeUrl(url),
				url: url,
				headers: customHeaders,
				responseType: 'stream',
			}).then(async (response) => {
				const metaData = {
					filename_download: fileName,
					folder: folder,
					storage: customStorage,
					title: fileName,
					type: response.headers['content-type'],
				};
				if(response && response.data){
					primaryKey = await filesService.uploadOne(response.data, metaData);
					if(!primaryKey){
						throw("No response from Directus Upload / Store operation")
					}
				}else{
					throw("No response from Download operation: " + response)
				}
			});
			return primaryKey;
		} catch (error: unknown) {
			if (isAxiosError(error) && error.response) {
				throw JSON.stringify({
					status: error.response.status,
					statusText: error.response.statusText,
					headers: error.response.headers,
					data: error.response.data,
				});
			} else {
				throw error;
			}
		}
	},
});
