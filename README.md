# Twilio Conversation Cards

Demonstration of using AdaptiveCards.io in Twilio Flex + Web Chat to create interactive conversation cards

## Project Structure

This application includes two components:

1. [Twilio React Web Chat](https://www.twilio.com/code-exchange/twilio-webchat-react-app)
2. [Flex Plugin](https://www.twilio.com/docs/flex/developer/ui-and-plugins)
3. Serverless backend for flex plugin Conversation Cards feature



## React Web Chat App

Forked version of the Twilio Web Chat React widget, with Adaptive Card wrapper element added


## Flex Plugin

The baseline for the Flex Plugin is the PS Template, two features have been created (Message Drop Zone, Conversation Cards) and another modified (Canned Responses).

1. Canned responses - Adds data (message only) to elements and makes them draggable
2. Conversation Cards - Renders a list of cards from serverless backend, adds associated data (card JSON, message)
3. Message Drop Zone - Receives HTML drop requests and looks for associated data (card JSON, message)

##  Flex Plugin Feature Backend

A set of assets served up to Flex UI that represent the Adaptive Card to be shown

See the `serverless-functions/src/assets/conversation-cards` directory

`responses.private.json` file contains the title, message and a file name to the adaptive card

Each adaptive card is defined in the `definitions/*.json` sub folder

## Demo

![Demo](docs/demo.gif)