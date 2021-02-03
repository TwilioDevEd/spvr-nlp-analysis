# Release Webinar Single Party Voice Demo

Twilio single-party voice recording using IBM Watson's Natural Language Processing API for speech to text analysis.

## Customer Call Recording Analysis

Twilio Voice Recordings allows businesses to record a conversation either in mono or stereo format, which includes audio received and transmitted in a call. Prior to this release, call centers struggled to monitor and **improve the performance of their agents** using recorded calls as a reference for training and **to gather insights driven by AI/ML technologies to improve the overall quality** of their service. Now, you can enable single party recording for any given call using a new `recordingTrack` parameter to indicate which audio track should be recorded. `inbound track` represents the audio received by Twilio, and `outbound track` represents the audio that Twilio generates on the call. Using this new feature, you now have the flexibility to record exactly what you want, all while meeting your **specific privacy and compliance needs**.

> A [Twilio account](http://www.twilio.com/console) and [IBM Watson account](https://cloud.ibm.com/registration) is required to run this application.

# Installation

1. Clone this repository
2. Run `npm install`
3. Rename `.example.env` to `.env`
   - Follow the instructions below to set your environment variables.
4. Create an IBM Watson Natural Language and Tone Credentials Service
   - Learn how to create Watson services from [Analyze Texts using IBM Watson and Twilio Functions with Node.js blog post](https://www.twilio.com/blog/analyze-texts-ibm-watson-twilio-functions).
5. In `src/server/` Overwrite `ibm-watson.tone.credentials.json` and `ibm-watson.transcription.credentials.json` with your newly created IBM Watson service credentials.
6. Type in the Terminal, `npm run dev`
7. Have [ngrok running](https://www.twilio.com/blog/tag/ngrok) on port 3000

### Set environment files

| Variable Name           | Where to get it                                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TWILIO_ACCOUNT_SID`      | Find your account Sid in the Project Info pane of the Console Dashboard page.                                                                                  |
| `TWILIO_AUTH_TOKEN`       | Find the authentication token in the Project Info pane of the Console Dashboard page.                                                                          |
| `TWILIO_API_KEY`          | Create an API Key via the [REST API](https://www.twilio.com/docs/iam/keys/api-key-resource) or [Console](https://www.twilio.com/console/runtime/api-keys).     |
| `TWILIO_API_SECRET`       | Create an API Key via the [REST API](https://www.twilio.com/docs/iam/keys/api-key-resource) or [Console](https://www.twilio.com/console/runtime/api-keys).     |
| `TWILIO_SYNC_SERVICE_SID` | Create a Sync Service Sid via the [REST API](https://www.twilio.com/docs/sync/api/service) or [Console](https://www.twilio.com/console/sync/services).         |
| `TWILIO_SYNC_MAP_SID`     | Create a Sync Map named `recordings` via the [REST API](https://www.twilio.com/docs/sync/api/map-resource) or [Console](https://www.twilio.com/console/sync/). |

## Configure TwiML Bin

```
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling. This call may be monitored for quality assurance.</Say>
   <Dial
   	record="record-from-answer"
        recordingTrack="inbound"
        recordingStatusCallback="http://{YOUR_NGROK_URL}/api/transcribe">
       <Number>{YOUR_NUMBER}</Number>
   </Dial>
</Response>
```

1. Create a new [TwiML Bin](https://www.twilio.com/console/twiml-bins/)
2. Replace `{NUMBER}` with the phone number of one of your phones
3. Replace `{YOUR_NGROK_URL}` with the [ngrok](https://ngrok.com/) url generated after running `ngrok http 3000`
4. Save
5. Make note of your TwiML Bin URL
   - You will use this to initiate the call below using the Twilio CLI

# Running the application

1. You need two phones for this demo
2. Open the [transcription webpage](http://localhost:3000)

## Initiate a call with the Twilio CLI

1. Install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)
2. Set your second phone number to `{TO_NUMBER}` in the CLI command below
3. Set the `{FROM_NUMBER}` to phone number [provisioned from the Twilio Console](https://www.twilio.com/console/phone-numbers/search)
4. Set `{TWIML_BIN}` to the TWiML Bin URL created earlier
5. Type the following command in a Terminal

```bash
twilio api:core:calls:create \
    --url {TWIML_BIN} \
    --to {TO_NUMBER} \
    --from {FROM_NUMBER}
```

## Wait for recording to come through

See recording appear on the web page. It may take a few moments. Hit the **play** icon to see transcription and hear audio.
