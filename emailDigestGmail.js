function gmailDailyMeetingDigest() {
  const today = new Date();
  const calendars = CalendarApp.getAllCalendars(); // Get all calendars (adjust if needed)
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

  // Custom Search API Settings
  const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
  const cseId = "YOUR_CSE_ID"; // Replace with your Custom Search Engine ID

  const attendeesWithProfiles = {}; 

  for (const event of events) {
    const attendees = event.getGuestList();

    for (const attendee of attendees) {
      const attendeeEmail = attendee.getEmail();

      // Check if profile is already found in the cache
      if (attendeeEmail in attendeesWithProfiles) {
        const linkedInProfileUrl = attendeesWithProfiles[attendeeEmail];
        emailBody += `<li>
                        <strong>${event.getTitle()}</strong><br>
                        ${startTime} - ${endTime}<br>
                        ${event.getLocation() ? "Location: " + event.getLocation() + "<br>" : ""}
                        ${event.getDescription() ? event.getDescription() + "<br>" : ""}
                        ${attendeeEmail} - <a href="${linkedInProfileUrl}">LinkedIn Profile</a><br>
                    </li>`;
        continue; 
      }

      const searchQuery = `${attendee.getName()} LinkedIn`;
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(searchQuery)}`;

      try {
        const response = UrlFetchApp.fetch(searchUrl);
        const jsonResponse = JSON.parse(response.getContentText());

        if (jsonResponse.items && jsonResponse.items.length > 0) {
          const linkedInProfileUrl = jsonResponse.items[0].link; // Gets the first result in the search list assumes that will always be the case
          attendeesWithProfiles[attendeeEmail] = linkedInProfileUrl; 
          emailBody += `<li>
                          <strong>${event.getTitle()}</strong><br>
                          ${startTime} - ${endTime}<br>
                          ${event.getLocation() ? "Location: " + event.getLocation() + "<br>" : ""}
                          ${event.getDescription() ? event.getDescription() + "<br>" : ""}
                          ${attendeeEmail} - <a href="${linkedInProfileUrl}">LinkedIn Profile</a><br>
                      </li>`;
        } else {
          // No LinkedIn profile found in the search results
          emailBody += `<li>
                          <strong>${event.getTitle()}</strong><br>
                          ${startTime} - ${endTime}<br>
                          ${event.getLocation() ? "Location: " + event.getLocation() + "<br>" : ""}
                          ${event.getDescription() ? event.getDescription() + "<br>" : ""}
                          ${attendeeEmail}<br> 
                      </li>`;
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        emailBody += `<li>
                        <strong>${event.getTitle()}</strong><br>
                        ${startTime} - ${endTime}<br>
                        ${event.getLocation() ? "Location: " + event.getLocation() + "<br>" : ""}
                        ${event.getDescription() ? event.getDescription() + "<br>" : ""}
                        ${attendeeEmail}<br> 
                    </li>`;
      }
    } 
  }

  emailBody += "</ul>";
  GmailApp.sendEmail(Session.getActiveUser().getEmail(), emailSubject, "", {htmlBody: emailBody});
}
