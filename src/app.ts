import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'euryecetelecom-download-store-file',
	name: 'Download and store file',
	icon: 'box',
	description: 'Download and store a file from an external URL',
	overview: ({ url, fileName }) => [
		{
			label: '$t:operations.request.url',
			text: url,
		}, {
			label: 'File name',
			text: fileName,
		},
	],
	options: [
		{
			field: 'url',
			name: '$t:operations.request.url',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					placeholder: 'https://example.com/myFileURI',
				},
			},
		},{
			field: 'fileName',
			name: 'File name',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					placeholder: 'MyFileName.pdf',
				},
			},
		},{
			field: 'folder',
			name: '$t:folder',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'system-folder',
			},
		},{
			field: 'storage',
			name: 'Storage adapter (local by default)',
			type: 'string',
			meta: {
				width: 'half',
			},
		},{
			field: 'headers',
			name: '$t:operations.request.headers',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					fields: [
						{
							field: 'header',
							name: '$t:operations.request.header',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'input',
								required: true,
								options: {
									placeholder: '$t:operations.request.header_placeholder',
								},
							},
						},
						{
							field: 'value',
							name: '$t:value',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'input',
								required: true,
								options: {
									placeholder: '$t:operations.request.value_placeholder',
								},
							},
						},
					],
				},
			},
		},{
			field: 'permissions',
			name: '$t:permissions',
			type: 'string',
			schema: {
				default_value: '$trigger',
			},
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{
							text: 'From Trigger',
							value: '$trigger',
						},
						// {
						// 	text: 'Public Role',
						// 	value: '$public',
						// },
						{
							text: 'Full Access',
							value: '$full',
						},
					],
					// allowOther: true,
					allowOther: false,
				},
			},
		},
	],
});
