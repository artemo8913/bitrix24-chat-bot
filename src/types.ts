export type BOT_REQ_BODY = {
    event: string,
    event_handler_id: string,
    data: {
        BOT: { BOT_ID: string, BOT_CODE: string }[],
        PARAMS: {
            MESSAGE: string,
            TEMPLATE_ID: string,
            MESSAGE_TYPE: string,
            FROM_USER_ID: string,
            DIALOG_ID: string,
            TO_CHAT_ID: string,
            AUTHOR_ID: string,
            SYSTEM: string,
            TO_USER_ID: string,
            PUSH: string,
            PUSH_IMPORTANT: string,
            RECENT_SKIP_AUTHOR: string,
            CONVERT: string,
            SKIP_COMMAND: string,
            SKIP_COUNTER_INCREMENTS: string,
            SILENT_CONNECTOR: string,
            SKIP_CONNECTOR: string,
            IMPORTANT_CONNECTOR: string,
            NO_SESSION_OL: string,
            FAKE_RELATION: string,
            SKIP_URL_INDEX: string,
            COMMAND_CONTEXT: string,
            CHAT_USER_COUNT: string,
            PLATFORM_CONTEXT: string,
            MESSAGE_ID: string,
            CHAT_TYPE: string,
            LANGUAGE: string
        },
        USER: {
            ID: string,
            NAME: string,
            FIRST_NAME: string,
            LAST_NAME: string,
            GENDER: string,
            IS_BOT: string,
            IS_CONNECTOR: string,
            IS_NETWORK: string,
            IS_EXTRANET: string
        }
    },
    ts: string,
    auth: {
        domain: string,
        client_endpoint: string,
        server_endpoint: string,
        member_id: string,
        application_token: string
    }
}