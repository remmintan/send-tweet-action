import 'dotenv/config'
import * as actions from '@actions/core'
import { TwitterApi } from 'twitter-api-v2'
import process from 'process'

function splitIntoTweets(string, delimiter = ' ', maxLength = 280) {
    const words = string.split(delimiter);
    const tweets = [];
    let currentTweet = '';
  
    for (let i = 0; i < words.length; i++) {
      if (currentTweet.length + words[i].length + delimiter.length <= maxLength) {
        currentTweet += words[i] + delimiter;
      } else {
        tweets.push(currentTweet.trim());
        currentTweet = words[i] + delimiter;
      }
    }
  
    if (currentTweet !== '') {
      tweets.push(currentTweet.trim());
    }
  
    return tweets;
  }

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
        const tweets = [];
        unescapedtweet.forEach((text) => {
            const textTweets = splitIntoTweets(text);
            tweets.push(...textTweets);
          });
        const tweet = await client.v2.tweetThread(tweets);
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
