export const config = {
    api: {
        // Number of conversations to fetch from API
        conversationLimit: parseInt(process.env.NEXT_PUBLIC_CONVERSATION_LIMIT || '20', 10),

        // Number of messages to show initially in long conversations
        messageLimit: parseInt(process.env.NEXT_PUBLIC_MESSAGE_LIMIT || '50', 10),

        // Refresh interval for conversations (ms)
        conversationRefreshInterval: parseInt(process.env.NEXT_PUBLIC_CONVERSATION_REFRESH || '15000', 10),

        // Refresh interval for agent status (ms)
        agentStatusRefreshInterval: parseInt(process.env.NEXT_PUBLIC_AGENT_STATUS_REFRESH || '30000', 10),

        // Initial number of conversations to display
        initialDisplayCount: parseInt(process.env.NEXT_PUBLIC_INITIAL_DISPLAY_COUNT || '8', 10),

        // Number of conversations to load per "Load More" click
        loadMoreIncrement: parseInt(process.env.NEXT_PUBLIC_LOAD_MORE_INCREMENT || '8', 10),
    },

    ui: {
        // Enable toast notifications
        enableToasts: process.env.NEXT_PUBLIC_ENABLE_TOASTS !== 'false',

        // Enable search functionality
        enableSearch: process.env.NEXT_PUBLIC_ENABLE_SEARCH !== 'false',

        // Enable keyboard shortcuts
        enableKeyboardShortcuts: process.env.NEXT_PUBLIC_ENABLE_SHORTCUTS !== 'false',
    },

    features: {
        // Enable conversation actions (delete, archive, etc.)
        enableConversationActions: process.env.NEXT_PUBLIC_ENABLE_CONVERSATION_ACTIONS === 'true',

        // Enable analytics
        enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    },
};
