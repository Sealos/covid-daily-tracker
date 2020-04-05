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
      profile: {
        getStarted: {
          payload: 'GET_STARTED',
        },
        greeting: [
          {
            locale: 'default',
            text: 'Hello {{user_first_name}}!',
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
      },
      fields: ['messages', 'messaging_postbacks'],
      path: '/webhooks/messenger',
      pageId: process.env.MESSENGER_PAGE_ID,
      accessToken: process.env.MESSENGER_ACCESS_TOKEN,
      appId: process.env.MESSENGER_APP_ID,
      appSecret: process.env.MESSENGER_APP_SECRET,
      verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
    },
  },
};
