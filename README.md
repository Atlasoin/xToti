# xToti

## Description 

xToti is a Telegram bot to subscribe notifications from Crossbell. The bot will send the notifications to your own Telegram channel. 

xToti 是一个订阅 Crossbell 上的通知的 Telegram bot，它会把通知消息发送到你自己的 Telegram channel 里。

Currently there's no easy way to get updates on if there's anyone who comments my post or if Alice posts a new blog etc. Besides, I believe the we should get notifications across different platforms as we want. So I customized this Telegram bot to help me get my notifications.

一方面因为目前没有很好的方式能够知道是否有人评论了我的消息，或者是否 Alice 新发布了博客等，另一方面我相信我们应该可以按照我们的喜好跨平台接收消息，所以我定制化了这个 Telegram bot 来让我接收通知。

Currently you have to deploy your bot by yourself. Though in the future it may plan to host to serve the public, it's still recommended to deploy your own especially when it launches the feature to post notes on behalf of your characters. Running your own bot is not difficult, you could even start it in your own laptop. You are worth owning your own data, your all privacy ❤️.

目前你必须自己部署自己的 bot。尽管未来可能会计划部署一个服务大众的 bot，但是仍然十分推荐你自己部署自己的 bot，尤其是如果之后有了代替你的 character 发送消息的功能之后。运行自己的 bot 并不困难，你甚至可以在自己的笔记本上运行。你值得拥有你的数据，和你全部的隐私 ❤️。


## Prerequisites

1. To use the bot, you need firstly acquire a bot id via [@BotFather](https://t.me/botfather). 

2. Then you should create a Telegram channel to receive the messages. It could be both public and private. If it's private, you need to get the channel Id. (This [bot] may(https://t.me/RawDataBot) help)

3. Invite your bot to your channel as the admin.

4. Get the ids of the characters you want to subscribe or receive the notifications. 
See id from the result of
``https://indexer.crossbell.io/v1/handles/{YOUR_CROSSBELL_HANDLE}/character``

5. Finally, to start the bot, you need to start a redis via docker:
```
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```


## Usage
Copy the ``.env.example`` file as ``.env``. Put your bot token, channel id, and character ids you want to subscribe in the ``.env`` file.

Put your watch list.


```
npm install

# Dev
npm run dev

# Prod
npm run build
npm run prod

```

## Roadmap

### Features
- [x] Subscribe the notifications of one character
- [x] Subscribe the new posts of another character
- [] Better output format(e.g. in HTML)
- [] Parse more different types of notification action
  - [x] LINKED
  - [] UNLINKED
  - [x] NOTE_POSTED
  - [] NOTE_MINTED
  - [] MENTIONED
  - [] TIPPED
  - [] OPERATOR_ADDED
  - [] OPERATOR_REMOVED
- [] Parse more different types of feed action
  - [x] LINKED
  - [] UNLINKED
  - [x] NOTE_POSTED
  - [] NOTE_MINTED
  - [] MENTIONED
  - [] TIPPED
  - [] OPERATOR_ADDED
  - [] OPERATOR_REMOVED
- [] Subscribe the notifications of multiple characters
  - e.g. Subscribe all notifications of my characters
- [] Subscribe the feed of a list
  - e.g. Subscribe all new posts of my followings
- [] Sync the replies to messages in Telegram to Crossbell
- [] Sync the likes to messages in Telegram to Crossbell
- [] Host others' 

### Dev
- [] Use docker file to build
- [] Package as docker
- [] More tests
- [] More grace error handle

## License

MIT
