const Alexa = require('ask-sdk-core');
var https = require('https');

const PlayHandler = {
	canHandle(handlerInput)
	{
		return (
			handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
			(
				handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
				handlerInput.requestEnvelope.request.intent.name === 'Play'
			) ||
			(
				handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
				(   handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent'  ||           
				    handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOnIntent' ||
                    handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent' ||
                    handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent' ||
                    handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent' ||
                    handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOnIntent' ||
                    handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent'
                )
			)
		);
	},
	handle(handlerInput)
	{
		const speechText = `You are now listening to Only The Hits Radio.`;
    	return handlerInput.responseBuilder
			.speak(speechText)
			.addDirective({
				type: 'AudioPlayer.Play',
				playBehavior: 'REPLACE_ALL',
				audioItem:{
					stream:{
						token: '0',
						url: 'https://stream-othradio.creativedork.com/live',
						offsetInMilliseconds: 0
					},
					metadata : {
                      title: "OTH Radio, Only The Hits!",
                      subtitle: "All of your favorites in one place",
                      "art": {
                        "sources": [
                          {
                            "contentDescription": "Only The Hits Radio",
                            "url": "https://echo-backgrounds.s3.ap-south-1.amazonaws.com/OTH+Radio.jpg",
                            "widthPixels": 512,
                            "heightPixels": 512
                          }
                        ]
                      },
                      "backgroundImage": {
                        "sources": [
                          {
                            "contentDescription": "Only The Hits Radio",
                            "url": "https://echo-backgrounds.s3.ap-south-1.amazonaws.com/AlexaBackground.png",
                            "widthPixels": 1200,
                            "heightPixels": 800
                          }
                        ]
                      }
                    }
				},
			})
			.getResponse();
	}
};

const PauseStopHandler = {
	canHandle(handlerInput)
	{
		return (
				handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
				(
					handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
					handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
				)
			) ||
			(
				handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
				handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent'
			);
	},
	handle(handlerInput)
	{
    	return handlerInput.responseBuilder
			.addDirective({
				type: 'AudioPlayer.ClearQueue',
				clearBehavior: 'CLEAR_ALL'
			})
			.getResponse();
	}
};

const HelpIntentHandler = {
	canHandle(handlerInput)
	{
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput)
	{
		const speechText = 'You can say Play, Stop or Resume.';
		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	}
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput)
	{
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput)
	{
		return handlerInput.responseBuilder.getResponse();
	}
};

const IntentReflectorHandler = {
	canHandle(handlerInput)
	{
		return handlerInput.requestEnvelope.request.type === 'IntentRequest';
	},
	handle(handlerInput)
	{
		const intentName = handlerInput.requestEnvelope.request.intent.name;
		const speechText = 'NO INTENT HELP TEXT';
		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	}
};

const ErrorHandler = {
	canHandle()
	{
		return true;
	},
	handle(handlerInput, error)
	{
		const speechText = `Sorry, I could not understand what you said. Please try again.`;
		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	}
};

exports.handler = Alexa.SkillBuilders.custom()
	.addRequestHandlers(
		PlayHandler,
		PauseStopHandler,
		HelpIntentHandler,
		SessionEndedRequestHandler,
		IntentReflectorHandler)
	.addErrorHandlers(
		ErrorHandler)
	.lambda();