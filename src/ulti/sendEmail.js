// === EMAIL NOTIFICATION SECTION ===
import LinkAPI from "./T0_linkApi";
const sendEmail = async (
  subjectText,
  body,
  toEmail = "pvkadien0209@gmail.com",
  handleBehind = () => {
    console.log("Email sent successfully");
  }
) => {
  try {
    // Build request body safely
    const requestBody = {
      subjectText: subjectText,
      contentText: body,
      toEmail: toEmail, // Use the parameter instead of hardcoded email
    };

    // Enhanced validation
    if (!requestBody.subjectText?.trim() || !requestBody.contentText?.trim()) {
      throw new Error("Subject and content cannot be empty");
    }

    if (!requestBody.toEmail || !/\S+@\S+\.\S+/.test(requestBody.toEmail)) {
      throw new Error("Valid email address required");
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    // Make API request
    const response = await fetch(`${LinkAPI}mail-homework`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle response
    if (!response.ok) {
      console.warn(`Email API responded with status ${response.status}`);
      return false;
    }

    // Success case - handle response and execute callback
    try {
      const result = await response.json();
      console.log("Email notification sent successfully:", result);

      // Execute success callback
      if (typeof handleBehind === "function") {
        await handleBehind(result);
      }

      return true;
    } catch (parseError) {
      console.log("Email sent successfully (response parsing failed)");

      // Execute success callback even if parsing fails
      if (typeof handleBehind === "function") {
        await handleBehind();
      }

      return true;
    }
  } catch (emailError) {
    // Don't throw - email is not critical
    if (emailError.name === "AbortError") {
      console.warn("Email request timeout");
    } else {
      console.error("Error sending email notification:", emailError);
    }
    return false;
  }
};

export default sendEmail;
