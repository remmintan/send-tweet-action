import 'dotenv/config'
import * as actions from '@actions/core'
import { TwitterApi } from 'twitter-api-v2'
import process from 'process'

async function main() {
    const consumerKey = actions.getInput('consumer key', { required: true })
    const consumerSecret = actions.getInput('consumer key secret', { required: true })
    const accessToken = actions.getInput('access token', { required: true })
    const accessTokenSecret = actions.getInput('access token secret', { required: true })

    const client = new TwitterApi({
        appKey: consumerKey,
        appSecret: consumerSecret,
        accessToken,
        accessSecret: accessTokenSecret
    })
    try {
        const tweet = await client.v1.tweet('Test');
        actions.info('tweet: ' + tweet)
    } catch (error) {
        actions.setFailed(error)
    }
}

main().catch((error) => {
    actions.setFailed(error.message)
    process.exit(1)
});
