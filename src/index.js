#!/usr/bin/env node

const fs = require('fs')
const https = require('https')
const chalk = require('chalk')
const axios = require('axios')
const yaml = require('js-yaml')
const { spawn } = require('child_process')

const messages = {
	failed_sart_server: '----------- Mock Server Failed to Start ----------',
	pull_spec: '----------- Pulling API Spec ---------------------',
	faild_load_spec: '----------- Failed to Load API Spec --------------',
	server_runnig: '----------- Mock Server is Running ---------------',
	divider: '--------------------------------------------------',
}
const env = {}

const requiredInputs = [
	'API_SPEC_DOMAIN',
	'API_SPEC_PROJECT',
	'API_SPEC_TOKEN',
	'API_SPEC_BRANCH',
	'API_SPEC_PATH',
]
const missingInputs = []

requiredInputs.forEach((field) => {
	env[field] = process.env[field]
	argIndex = process.argv.findIndex((arg) => arg === `--${field}`)
	if (argIndex >= 0 && argIndex < process.argv.length)
		env[field] = process.argv[argIndex + 1]
	if (!env[field]) missingInputs.push(field)
})

if (missingInputs.length > 0) {
	console.log(chalk.red(messages.failed_sart_server))
	console.log()
	missingInputs.forEach((field) =>
		console.log(chalk.red(`${field} is missing`))
	)
	console.log()
	console.log(chalk.red(messages.divider))
	process.exit()
}

console.log(chalk.green(messages.pull_spec))
axios
	.create({
		httpsAgent: new https.Agent({
			rejectUnauthorized: false,
		}),
	})
	.get(
		`https://${env.API_SPEC_DOMAIN}/api/v4/projects/${
			env.API_SPEC_PROJECT
		}/repository/files/${encodeURIComponent(env.API_SPEC_PATH)}?ref=${
			env.API_SPEC_BRANCH
		}`,
		{ headers: { 'PRIVATE-TOKEN': env.API_SPEC_TOKEN } }
	)
	.then((res) => {
		if (res.request.host !== env.API_SPEC_DOMAIN) {
			console.log(chalk.red(`Redirected to ${res.request.host}`))
			throw new Error()
		}
		const data = new Buffer.from(res.data.content, 'base64')
		fs.writeFileSync('.api_spec.yaml', yaml.dump(yaml.load(data), 'utf8'))
		spawn('npx', ['prism', 'mock', '.api_spec.yaml'], {
			stdio: 'inherit',
			env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: 0 },
		})
		console.log(chalk.green(messages.server_runnig))
	})
	.catch((error) => {
		console.log(error)
		console.log(chalk.red(messages.faild_load_spec))
	})

const exceptions = [
	'exit',
	'SIGINT',
	'SIGUSR1',
	'SIGUSR2',
	'uncaughtException',
	'SIGTERM',
]

exceptions.forEach((eventType) => {
	process.on(eventType, () => {
		if (fs.existsSync('.api_spec.yaml')) {
			fs.unlinkSync('.api_spec.yaml')
		}
	})
})
