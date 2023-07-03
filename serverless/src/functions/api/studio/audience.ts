// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

import got from "got";

type MyContext = {
  ACCOUNT_SID: string;
  AUTH_TOKEN: string;
  STUDIO_AUDIENCE_FLOW_SID: string;
  TWILIO_API_KEY: string;
  TWILIO_API_SECRET: string;
};

type MyEvent = {
  request: any;
  event: string;
  type: string;
  anonymousId: string;
  messageId: string;
  properties: any;
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> =
  function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
  ) {
    console.log(">>> INCOMING SEGMENT EVENT >>>");
    console.log(event);

    let response = new Twilio.Response();

    console.log(
      `Creating studio flow execution ${context.STUDIO_AUDIENCE_FLOW_SID}`
    );

    // Remove the request property from the event, clone into eventProperties
    const { request, ...eventProperties } = event;

    const client = context.getTwilioClient();

    client.studio.v2
      .flows(context.STUDIO_AUDIENCE_FLOW_SID)
      .executions.create({
        parameters: {
          identity: event.anonymousId,
          event: event.event,
          ...event.properties,
        },
        to: event.anonymousId,
        from: event.messageId,
      })
      .then((execution) => {
        response.setBody({ execution: execution.sid });
        console.log(`Created execution ${execution.sid}`);
      })
      .finally(() => {
        console.log(`Returning data to segment`);

        return callback(null, response);
      });
  };
