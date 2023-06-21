import 'dotenv/config'
import * as actions from '@actions/core'
import { TwitterApi } from 'twitter-api-v2'
import process from 'process'

async function main() {
    const apiKey = actions.getInput('api-key', { required: true })
    const apiSecret = actions.getInput('api-key-secret', { required: true })
    const accessToken = actions.getInput('access-token', { required: true })
    const accessTokenSecret = actions.getInput('access-token-secret', { required: true })
    const tweetText = actions.getInput('tweet-text', { required: true })

    const client = new TwitterApi({
        appKey: apiKey,
        appSecret: apiSecret,
        accessToken,
        accessSecret: accessTokenSecret
    })
    try {
        const unescapedtweet = tweetText.replace(/\\n/g, '\n').replace(/\\/g, '').split('===next-tweet===')
        const tweet = await client.v2.tweetThread(unescapedtweet);
        actions.info('tweet: ' + JSON.stringify(tweet))
    } catch (error) {
        console.log(error)
        actions.setFailed(error)
    }
}

main().catch((error) => {
    console.log(error)
    actions.setFailed(error)
    process.exit(1)
});
