const { withAndroidManifest } = require("expo/config-plugins");

const withAndroidQueries = (config) => {
  return withAndroidManifest(config, (config) => {
    const queries = config.modResults.manifest.queries || [];

    const newIntents = [
      {
        action: "android.intent.action.VIEW",
        data: "youtube",
      },
      {
        action: "android.intent.action.VIEW",
        data: "nmap",
      },
    ];

    newIntents.forEach(({ action, category, data }) => {
      const intentExists = queries.some((q) =>
        q.intent?.some(
          (intent) =>
            intent.action?.[0]?.$["android:name"] === action &&
            intent.data?.[0]?.$["android:scheme"] === data
        )
      );

      if (!intentExists) {
        const newIntent = {
          action: [{ $: { "android:name": action } }],
          data: [{ $: { "android:scheme": data } }],
        };

        if (category) {
          newIntent.category = [{ $: { "android:name": category } }];
        }

        queries.push({ intent: [newIntent] });
      }
    });

    config.modResults.manifest.queries = queries;

    return config;
  });
};

module.exports = withAndroidQueries;
