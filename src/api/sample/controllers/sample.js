const admin = require("../../../../config/firebaseConfig");

exports.sendSampleMessage = (req, res) => {
  const registrationToken =
    "fJTTL0EVXZo6_tdNsUytRY:APA91bH5LstGlPSY_LQPfP8hFCDpIUmYF8o4Ct5qR1vgctcxYxTRfVscCRsjmscoOdSEuO8skY3MgKrQ7k5VBeRe-vgmvC9oXnPlP7Pc65UQTyoI0F5Vvd-vo5fa99lIDIFVNUd5WHI6";

  const message = {
    token: registrationToken,
    notification: {
      title: "Sample Message",
      body: "Hi, this is a sample message!",
    },
  };

  const messaging = admin.messaging();

  messaging
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
      res.send("Message sent successfully!");
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.status(500).send("Error sending message");
    });
};
