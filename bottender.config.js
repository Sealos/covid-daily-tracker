module.exports = {
  session: {
    driver: 'mongo',
    stores: {
      memory: {
        maxSize: 500,
      },
      mongo: {
        url: 'mongodb://localhost:27017',
        collectionName: 'sessions',
      },
    },
  },
  initialState: {
    payloads: [],
  },
  channels: {
    messenger: {
      enabled: true,
      getStarted: {
        payload: 'GET_STARTED',
      },
      greeting: [
        {
          locale: 'default',
          text: 'Hello {{user_first_name}}!',
        },
      ],
      iceBreakers: [
        {
          question: '<QUESTION>',
          payload: '<PAYLOAD>',
        },
        {
          question: '<QUESTION>',
          payload: '<PAYLOAD>',
        },
      ],
      persistentMenu: [
        {
          locale: 'default',
          composerInputDisabled: false,
          callToActions: [
            {
              type: 'postback',
              title: 'I think I might be sick',
              payload: 'CARE_HELP',
            },
          ],
        },
      ],
      fields: ['messages', 'messaging_postbacks', 'messaging_optins', 'message_deliveries', 'message_reads', 'messaging_payments', 'messaging_pre_checkouts', 'messaging_checkout_updates', 'messaging_account_linking', 'messaging_referrals', 'message_echoes', 'messaging_game_plays', 'standby', 'messaging_handovers', 'messaging_policy_enforcement', 'message_reactions'],
      path: '/webhooks/messenger',
      pageId: process.env.MESSENGER_PAGE_ID,
      accessToken: process.env.MESSENGER_ACCESS_TOKEN,
      appId: process.env.MESSENGER_APP_ID,
      appSecret: process.env.MESSENGER_APP_SECRET,
      verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
    },
    whatsapp: {
      enabled: false,
      path: '/webhooks/whatsapp',
      accountSid: process.env.WHATSAPP_ACCOUNT_SID,
      authToken: process.env.WHATSAPP_AUTH_TOKEN,
      phoneNumber: process.env.WHATSAPP_PHONE_NUMBER,
    },
    line: {
      enabled: false,
      path: '/webhooks/line',
      accessToken: process.env.LINE_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    },
    telegram: {
      enabled: false,
      path: '/webhooks/telegram',
      accessToken: process.env.TELEGRAM_ACCESS_TOKEN,
    },
    slack: {
      enabled: false,
      path: '/webhooks/slack',
      accessToken: process.env.SLACK_ACCESS_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    },
    viber: {
      enabled: false,
      path: '/webhooks/viber',
      accessToken: process.env.VIBER_ACCESS_TOKEN,
      sender: {
        name: 'xxxx',
      },
    },
  },
};
