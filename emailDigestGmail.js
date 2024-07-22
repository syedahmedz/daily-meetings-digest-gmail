function gmailDailyMeetingDigest() {
  const today = new Date();
  const calendars = CalendarApp.getAllCalendars(); 
  const events = [];

  for (const calendar of calendars) {
    const calendarEvents = calendar.getEventsForDay(today);
    events.push(...calendarEvents);
  }

  if (events.length === 0) {
    console.log("Your day is clear. No Meetings for today.");
    return;
  }

  events.sort((a, b) => a.getStartTime().getTime() - b.getStartTime().getTime());

  const emailSubject = "Your Meeting Digest for the today";
  let emailBody = "<h2>Morning! Here are all your scheduled meetings for today:</h2><ul>";

  for (const event of events) {
    const startTime = Utilities.formatDate(event.getStartTime(), Session.getScriptTimeZone(), "hh:mm a");
    const endTime = Utilities.formatDate(event.getEndTime(), Session.getScriptTimeZone(), "hh:mm a");
    emailBody += `<li>
                      <strong>${event.getTitle()}</strong><br>
                      ${startTime} - ${endTime}<br>
                      ${event.getLocation() ? "Location: " + event.getLocation() + "<br>" : ""}
                      ${event.getDescription() ? event.getDescription() + "<br>" : ""}
                  </li>`;
  }

  emailBody += "</ul>";

  GmailApp.sendEmail(Session.getActiveUser().getEmail(), emailSubject, "", {htmlBody: emailBody});
}
