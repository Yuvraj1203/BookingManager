import { BookingType, useSettingStore } from '@/store';
import { generatePDF } from 'react-native-html-to-pdf';
import { formatDate } from './utils';

export const generateBookingPDF = async (booking: BookingType) => {
  const { businessName, businessPhone, invoicePrefix, currency } =
    useSettingStore.getState();

  const escapeHtml = (value?: string) => {
    if (!value) return '-';

    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatAmount = (value?: string) =>
    `${currency}${escapeHtml(
      Number(value || 0).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
      }),
    )}`;

  const invoiceNumber = `${invoicePrefix || 'INV'}-${booking.id
    .slice(-6)
    .toUpperCase()}`;

  const status = booking.status || 'Pending';

  const balanceDue =
    Number(booking.totalAmount || 0) - Number(booking.advancePaid || 0);

  const primaryColor = '#1C3D5A';

  const createdDate = formatDate({
    date: booking.createdAt,
    // parseFormat: 'DD MMM, YYYY hh:mm A',
    returnFormat: 'DD MMM, YYYY hh:mm A',
  });

  const bookingOfDate = formatDate({
    date: booking.date,
    // parseFormat: 'DD MMM, YYYY hh:mm A',
    returnFormat: 'DD MMM, YYYY hh:mm A',
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 40px;
            color: #1f2430;
            background: #ffffff;
            font-size: 13px;
            line-height: 1.5;
          }

          .container {
            width: 100%;
          }

          /* HEADER */

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 20px;
          }

          .business-name {
            font-size: 24px;
            font-weight: bold;
            color: #1f2430;
            margin-bottom: 6px;
            letter-spacing: 0.3px;
          }

          .business-phone {
            font-size: 12px;
            color: #6b7280;
          }

          .document-title {
            font-size: 26px;
            font-weight: bold;
            color: ${primaryColor};
            text-align: right;
            letter-spacing: 1px;
          }

          .document-subtitle {
            font-size: 12px;
            color: #6b7280;
            text-align: right;
            margin-top: 6px;
          }

          .accent-bar {
            height: 4px;
            border-radius: 4px;
            background: linear-gradient(90deg, ${primaryColor}, #7c93e6);
            margin-bottom: 26px;
          }

          /* META STRIP */

          .meta-strip {
            display: flex;
            justify-content: space-between;
            background-color: #f5f7ff;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 26px;
          }

          .meta-item {
            width: 32%;
          }

          .meta-label {
            font-size: 9px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }

          .meta-value {
            font-size: 13px;
            font-weight: bold;
            color: #1f2430;
          }

          .status {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            background-color: ${primaryColor};
            color: #ffffff;
            font-weight: bold;
            font-size: 11px;
          }

          /* SECTION */

          .section {
            margin-top: 22px;
          }

          .section-title {
            font-size: 13px;
            font-weight: bold;
            color: ${primaryColor};
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 14px;
          }

          /* INFO GRID */

          .info-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }

          .info-item {
            width: 48%;
            margin-bottom: 15px;
          }

          .info-label {
            font-size: 9px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }

          .info-value {
            font-size: 13px;
            color: #1f2430;
          }

          /* PAYMENT */

          .payment-box {
            margin-top: 6px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }

          .payment-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 18px;
            border-bottom: 1px solid #eeeeee;
          }

          .payment-row:last-child {
            border-bottom: none;
          }

          .payment-label {
            color: #555555;
          }

          .payment-value {
            font-weight: bold;
            color: #1f2430;
          }

          .total-row {
            background-color: #f5f7ff;
          }

          .total-row .payment-label,
          .total-row .payment-value {
            font-size: 16px;
            font-weight: bold;
            color: ${primaryColor};
          }

          /* ADDONS */

          .addons-box {
            background-color: #f8f9fb;
            padding: 12px 18px;
            border-radius: 8px;
            color: #333333;
          }

          /* NOTES */

          .notes-box {
            background-color: #f8f9fb;
            border-left: 3px solid ${primaryColor};
            padding: 12px 18px;
            border-radius: 0 8px 8px 0;
            line-height: 1.6;
            color: #444444;
          }

          /* FOOTER */

          .footer {
            margin-top: 42px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 10px;
          }

          .footer-business {
            margin-top: 4px;
            font-weight: bold;
            color: #6b7280;
          }
        </style>
      </head>

      <body>
        <div class="container">

          <!-- HEADER -->

          <div class="header">
            <div>
              <div class="business-name">
                ${escapeHtml(businessName) || 'Your Business Name'}
              </div>

              <div class="business-phone">
                ${businessPhone ? `Phone: ${escapeHtml(businessPhone)}` : ''}
              </div>
            </div>

            <div>
              <div class="document-title">
                INVOICE
              </div>

              <div class="document-subtitle">
                ${escapeHtml(invoiceNumber)}
              </div>
            </div>
          </div>

          <div class="accent-bar"></div>


          <!-- META STRIP -->

          <div class="meta-strip">

            <div class="meta-item">
              <div class="meta-label">
                Issue Date
              </div>

              <div class="meta-value">
                ${createdDate}
              </div>
            </div>

            <div class="meta-item">
              <div class="meta-label">
                Booking Date
              </div>

              <div class="meta-value">
                ${bookingOfDate}
              </div>
            </div>

            <div class="meta-item" style="text-align: right;">
              <div class="meta-label">
                Status
              </div>

              <div class="meta-value">
                <span class="status">
                  ${escapeHtml(status)}
                </span>
              </div>
            </div>

          </div>


          <!-- CLIENT INFORMATION -->

          <div class="section">

            <div class="section-title">
              Bill To
            </div>

            <div class="info-grid">

              <div class="info-item">
                <div class="info-label">
                  Client Name
                </div>

                <div class="info-value">
                  ${escapeHtml(booking.clientName)}
                </div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  Mobile
                </div>

                <div class="info-value">
                  ${escapeHtml(booking.mobile)}
                </div>
              </div>

            </div>

          </div>


          <!-- BOOKING INFORMATION -->

          <div class="section">

            <div class="section-title">
              Booking Details
            </div>

            <div class="info-grid">

              <div class="info-item">
                <div class="info-label">
                  Time
                </div>

                <div class="info-value">
                  ${escapeHtml(booking.time)}
                </div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  Duration
                </div>

                <div class="info-value">
                  ${escapeHtml(booking.duration)}
                </div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  Number of Horses
                </div>

                <div class="info-value">
                  ${escapeHtml(booking.horses)}
                </div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  Venue
                </div>

                <div class="info-value">
                  ${escapeHtml(booking.venue)}
                </div>
              </div>

            </div>

          </div>


          <!-- ADD-ONS -->

          ${
            booking.addOns
              ? `
                <div class="section">

                  <div class="section-title">
                    Add-ons
                  </div>

                  <div class="addons-box">
                    ${escapeHtml(booking.addOns)}
                  </div>

                </div>
              `
              : ''
          }


          <!-- PAYMENT -->

          <div class="section">

            <div class="section-title">
              Payment Summary
            </div>

            <div class="payment-box">

              <div class="payment-row">
                <div class="payment-label">
                  Total Amount
                </div>

                <div class="payment-value">
                  ${formatAmount(booking.totalAmount)}
                </div>
              </div>

              <div class="payment-row">
                <div class="payment-label">
                  Advance Paid
                </div>

                <div class="payment-value">
                  ${formatAmount(booking.advancePaid || '0')}
                </div>
              </div>

              <div class="payment-row total-row">
                <div class="payment-label">
                  Balance Due
                </div>

                <div class="payment-value">
                  ${formatAmount(String(balanceDue))}
                </div>
              </div>

            </div>

          </div>


          <!-- NOTES -->

          ${
            booking.notes
              ? `
                <div class="section">

                  <div class="section-title">
                    Notes
                  </div>

                  <div class="notes-box">
                    ${escapeHtml(booking.notes)}
                  </div>

                </div>
              `
              : ''
          }


          <!-- FOOTER -->

          <div class="footer">

            <div>
              Thank you for choosing us.
            </div>

            <div class="footer-business">
              ${escapeHtml(businessName) || 'Your Business Name'}${
    businessPhone ? ` · ${escapeHtml(businessPhone)}` : ''
  }
            </div>

          </div>

        </div>
      </body>
    </html>
  `;

  const pdf = await generatePDF({
    html,
    fileName: `${invoiceNumber}-${booking.clientName}`,
    directory: 'Documents',
  });

  return pdf.filePath;
};
