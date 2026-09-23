import config from "../config";
import {
  ICreateAccount,
  IResetPassword,
} from "../types/emailTamplate";

const PRIMARY = "#009A54";

const LOGO =
  "https://res.cloudinary.com/dkbcx9amc/image/upload/q_auto/f_auto/v1775448661/Layer_1_vggb5q.png";

const baseTemplate = (content: string) => `
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="background:#f4f6f8;padding:20px 0;"
  >
    <tr>
      <td align="center">

        <table
          width="600"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            box-shadow:0 4px 12px rgba(0,0,0,0.05);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="padding:30px 20px;border-bottom:1px solid #eee;"
            >
              <img
                src="${LOGO}"
                alt="LinkFast eSIM"
                style="height:40px;"
              />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px 25px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding:20px;
                color:#999;
                font-size:12px;
                border-top:1px solid #eee;
              "
            >
              © ${new Date().getFullYear()} LinkFast eSIM.
              All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
`;

const otpBox = (otp: string) => `
<div
  style="
    background:${PRIMARY};
    color:#fff;
    font-size:28px;
    letter-spacing:4px;
    padding:14px 24px;
    border-radius:8px;
    display:inline-block;
    margin:20px 0;
    font-weight:bold;
  "
>
  ${otp}
</div>
`;

const bookingDetails = (values: any) => `
<table
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="
    margin:20px 0;
    background:#f8faf9;
    border-radius:8px;
    overflow:hidden;
  "
>

  <!-- Booking ID -->
  <tr>
    <td
      style="
        padding:12px 15px;
        color:#666;
        font-size:14px;
      "
    >
      Booking ID
    </td>

    <td
      align="right"
      style="
        padding:12px 15px;
        color:#111;
        font-size:14px;
        font-weight:bold;
      "
    >
      ${values.bookingId}
    </td>
  </tr>

  <!-- Package -->
  <tr>
    <td
      style="
        padding:12px 15px;
        color:#666;
        font-size:14px;
      "
    >
      Package
    </td>

    <td
      align="right"
      style="
        padding:12px 15px;
        color:#111;
        font-size:14px;
        font-weight:bold;
      "
    >
      ${values.packageName}
    </td>
  </tr>

  <!-- Country -->
  <tr>
    <td
      style="
        padding:12px 15px;
        color:#666;
        font-size:14px;
      "
    >
      Country
    </td>

    <td
      align="right"
      style="
        padding:12px 15px;
        color:#111;
        font-size:14px;
        font-weight:bold;
      "
    >
      ${values.country}
    </td>
  </tr>

  <!-- Data -->
  <tr>
    <td
      style="
        padding:12px 15px;
        color:#666;
        font-size:14px;
      "
    >
      Data
    </td>

    <td
      align="right"
      style="
        padding:12px 15px;
        color:#111;
        font-size:14px;
        font-weight:bold;
      "
    >
      ${values.data}
    </td>
  </tr>

  <!-- Validity -->
  <tr>
    <td
      style="
        padding:12px 15px;
        color:#666;
        font-size:14px;
      "
    >
      Validity
    </td>

    <td
      align="right"
      style="
        padding:12px 15px;
        color:#111;
        font-size:14px;
        font-weight:bold;
      "
    >
      ${values.validity} days
    </td>
  </tr>

  <!-- Quantity -->
  <tr>
    <td
      style="
        padding:12px 15px;
        color:#666;
        font-size:14px;
      "
    >
      Quantity
    </td>

    <td
      align="right"
      style="
        padding:12px 15px;
        color:#111;
        font-size:14px;
        font-weight:bold;
      "
    >
      ${values.quantity}
    </td>
  </tr>

  <!-- Price -->
  <tr>
    <td
      style="
        padding:12px 15px;
        color:#666;
        font-size:14px;
      "
    >
      Total Price
    </td>

    <td
      align="right"
      style="
        padding:12px 15px;
        color:${PRIMARY};
        font-size:16px;
        font-weight:bold;
      "
    >
      $${values.price}
    </td>
  </tr>

  <!-- Status -->
  <tr>
    <td
      style="
        padding:12px 15px;
        color:#666;
        font-size:14px;
      "
    >
      Status
    </td>

    <td
      align="right"
      style="
        padding:12px 15px;
        color:${PRIMARY};
        font-size:14px;
        font-weight:bold;
      "
    >
      ${values.status}
    </td>
  </tr>

</table>
`;

/* =========================================================
   CREATE ACCOUNT
========================================================= */

const createAccount = (values: ICreateAccount) => {
  const content = `
    <h2 style="margin:0 0 10px;color:#111;">
      Verify your LinkFast eSIM account
    </h2>

    <p style="color:#555;font-size:15px;line-height:1.6;">
      Hi ${values.name},
      <br/><br/>

      Welcome to <b>LinkFast eSIM</b>.
      Use the verification code below to activate your account.
    </p>

    <div style="text-align:center;">
      ${otpBox(String(values.otp))}
    </div>

    <p style="color:#666;font-size:14px;">
      This code is valid for <b>3 minutes</b>.
    </p>

    <p
      style="
        color:#999;
        font-size:13px;
        margin-top:20px;
      "
    >
      If you didn’t request this email, you can safely ignore it.
    </p>
  `;

  return {
    to: values.email,
    subject: "Verify your LinkFast eSIM account",
    html: baseTemplate(content),
  };
};

/* =========================================================
   RESET PASSWORD
========================================================= */

const resetPassword = (values: IResetPassword) => {
  const content = `
    <h2 style="margin:0 0 10px;color:#111;">
      Reset your password
    </h2>

    <p style="color:#555;font-size:15px;line-height:1.6;">
      We received a request to reset your LinkFast eSIM password.
      Use the code below to continue.
    </p>

    <div style="text-align:center;">
      ${otpBox(String(values.otp))}
    </div>

    <p style="color:#666;font-size:14px;">
      This code is valid for <b>3 minutes</b>.
    </p>

    <p
      style="
        color:#999;
        font-size:13px;
        margin-top:20px;
      "
    >
      If you didn't request this password reset, you can safely ignore this
      email. Someone else may have entered your email address by mistake.
    </p>
  `;

  return {
    to: values.email,
    subject: "Reset your LinkFast eSIM password",
    html: baseTemplate(content),
  };
};

/* =========================================================
   BOOKING CONFIRMATION - USER
========================================================= */

const bookingConfirmation = (values: any) => {
  const content = `
    <h2 style="margin:0 0 10px;color:#111;">
      Booking Confirmed
    </h2>

    <p style="color:#555;font-size:15px;line-height:1.6;">
      Hi ${values.name},
      <br/><br/>

      Thank you for your purchase from <b>LinkFast eSIM</b>.
      Your eSIM booking has been successfully confirmed.
    </p>

    ${bookingDetails(values)}

    <div
      style="
        background:#ecfdf5;
        border-left:4px solid ${PRIMARY};
        padding:14px 16px;
        margin:20px 0;
        border-radius:6px;
      "
    >
      <p
        style="
          margin:0;
          color:#166534;
          font-size:14px;
          line-height:1.6;
        "
      >
        Your eSIM is ready. You can access your eSIM details and
        installation instructions from your LinkFast eSIM account.
      </p>
    </div>

    <p
      style="
        color:#999;
        font-size:13px;
        margin-top:20px;
      "
    >
      If you have any questions or need assistance with your eSIM,
      please contact our support team.
    </p>
  `;

  return {
    to: values.email,
    subject: `Booking Confirmation - ${values.packageName}`,
    html: baseTemplate(content),
  };
};

/* =========================================================
   BOOKING CONFIRMATION - ADMIN
========================================================= */

const adminBookingConfirmation = (
  values: any
) => {
  const content = `
    <h2 style="margin:0 0 10px;color:#111;">
      New Booking Received
    </h2>

    <p
      style="
        color:#555;
        font-size:15px;
        line-height:1.6;
      "
    >
      A new eSIM booking has been successfully placed on
      <b>LinkFast eSIM</b>.
    </p>

    ${bookingDetails(values)}

    <h3
      style="
        margin:25px 0 10px;
        color:#111;
      "
    >
      Customer Information
    </h3>

    <table
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        background:#f8faf9;
        border-radius:8px;
        overflow:hidden;
      "
    >

      <!-- Customer Name -->
      <tr>
        <td
          style="
            padding:12px 15px;
            color:#666;
            font-size:14px;
          "
        >
          Customer Name
        </td>

        <td
          align="right"
          style="
            padding:12px 15px;
            color:#111;
            font-size:14px;
            font-weight:bold;
          "
        >
          ${values.name}
        </td>
      </tr>

      <!-- Customer Email -->
      <tr>
        <td
          style="
            padding:12px 15px;
            color:#666;
            font-size:14px;
          "
        >
          Customer Email
        </td>

        <td
          align="right"
          style="
            padding:12px 15px;
            color:#111;
            font-size:14px;
          "
        >
          ${values.email}
        </td>
      </tr>

      <!-- Contact -->
      ${
        values.contact
          ? `
            <tr>
              <td
                style="
                  padding:12px 15px;
                  color:#666;
                  font-size:14px;
                "
              >
                Contact
              </td>

              <td
                align="right"
                style="
                  padding:12px 15px;
                  color:#111;
                  font-size:14px;
                "
              >
                ${values.contact}
              </td>
            </tr>
          `
          : ""
      }

    </table>

    <p
      style="
        color:#999;
        font-size:13px;
        margin-top:20px;
      "
    >
      Please review the booking from the admin panel if any further
      action is required.
    </p>
  `;

  return {
    to: config.email.from!,
    subject: `New Booking - ${values.packageName}`,
    html: baseTemplate(content),
  };
};

/* =========================================================
   EXPORT
========================================================= */

export const emailTemplate = {
  createAccount,
  resetPassword,
  bookingConfirmation,
  adminBookingConfirmation,
};