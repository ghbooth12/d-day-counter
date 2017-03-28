## D-day Counter
Alexa is a voice-enabled platform used to interact with devices such as Amazon Echo, Dot, and Tap. Alexa has a lot of great skills to satisfy your needs, such as playing music, adjusting the brightness of the lighting, or reading an audio book. Alexa is always ready to perform our commands, so it’s very convenient not to need to push buttons or tap the device to wake up our devices.
Another skill I’d like to make is a d-day counter, which can tell how many weeks and days remaining till the date that the user mention.

### Design the voice interaction menu of Skill
1. Intent Schema & Custom Slot Type
```javascript
{
 "intents": [
   {
     "intent": "HowManyWeeksUntilIntent",
     "slots": [
       {
         "name": "Date",
         "type": "LIST_OF_DATES"
       }
     ]
   },
 ...
}
```
2. Sample Utterances
```bash
HowManyWeeksUntilIntent how many days until {Date}
HowManyWeeksUntilIntent how many days till {Date}
HowManyWeeksUntilIntent how many days left until {Date}
HowManyWeeksUntilIntent how many days left till {Date}
HowManyWeeksUntilIntent how long until {Date}
HowManyWeeksUntilIntent how long till {Date}
```
3. A Visual Representation of The Menu/Model
```bash
(No mention of year)
User: "How many weeks until December 25th?"
Alexa: "21 weeks and 6 days left until December 25th 2016."

(Mention of year)
User: "How many weeks until December 25th 2017?"
Alexa: "74 weeks left until December 25th 2017."
```
