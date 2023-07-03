// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

type MyContext = {
  ACCOUNT_SID: string;
  AUTH_TOKEN: string;
  SYNC_SERVICE_SID: string;
  TWILIO_API_KEY: string;
  TWILIO_API_SECRET: string;
  SYNC_MAP_OFFER_KEY_NAME: string;
};

type MyEvent = {
  request: any;
  identity: string;
  type: string;
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

    // Get the target user identity - Segment Anonymous ID
    const target_map_id = event.identity;

    if (!target_map_id) {
      response.setStatusCode(400);
      response.setBody({ message: "missing identity" });
      return callback(null, response);
    }

    console.log(
      `Creating event for ${target_map_id} in sync service ${context.SYNC_SERVICE_SID}`
    );

    // Remove the request property from the event, clone into eventProperties
    const { request, ...eventProperties } = event;

    const client = context.getTwilioClient();
    client.sync.v1
      .services(context.SYNC_SERVICE_SID)
      .syncMaps(target_map_id)
      .syncMapItems.get(context.SYNC_MAP_OFFER_KEY_NAME)
      .update({
        data: eventProperties,
      })
      .then((sync_map_item) => {
        console.log(` Updated entry ${sync_map_item.key}`);
        response.setBody({ message: "ok" });
      })
      .catch((error) => {
        // Items doesn't yet exist, create it
        console.log(`Error updating sync map item: ${error}`);
        client.sync.v1
          .services(context.SYNC_SERVICE_SID)
          .syncMaps(target_map_id)
          .syncMapItems.create({
            key: context.SYNC_MAP_OFFER_KEY_NAME,
            data: eventProperties,
          })
          .then((sync_map_item) => {
            console.log(` Created entry ${sync_map_item.key}`);
            response.setBody({ message: "ok" });
          })
          .catch((error) => {
            console.log(`Error creating sync map item: ${error}`);
            response.setStatusCode(500);
            response.setBody({ message: "error creating sync entry" });
          })
          .finally(() => {
            console.log(`Returning data to segment`);
            return callback(null, response);
          });
      })
      .finally(() => {
        console.log(`Returning data to caller`);
        return callback(null, response);
      });
  };
