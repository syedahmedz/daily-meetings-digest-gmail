# Daily Meetings Digest for Gmail and Gsuite Emails 

This Apps Script uses the Gmail Apps Script Framework to time trigger a daily email with a list of all scheduled meetings in a day. I personally use this to get a list of meetings I have in a day straight to my email. 

## How to set this up on your gmail workspace:

1. Head over to the google scripts page and set up a new script with the code in the js file in this repo
2. Paste the code and save it.
3. Head over to the triggers menu in the sidebar and select `sendDailyMeetingDigest` as the function to run.
4. Set the event source to `Time-driven` and the type of time based trigger to `Day timer` and then select a time of day when you want the email to be sent. 
5. Click on save, most likely you will get a warning pop up saying the script is not approved and you will have to authorize it to access your calendar and Gmail.
