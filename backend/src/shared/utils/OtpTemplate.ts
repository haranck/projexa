export class OtpTemplate {
  static generate(otp: string): string {
    return `
      <div style="
        background:#f5f5f5;
        padding:20px;
        font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, 'Helvetica Neue', Arial, sans-serif;
      ">
        <div style="
          max-width:400px;
          margin:0 auto;
          background:#ffffff;
          border-radius:8px;
          overflow:hidden;
          box-shadow:0 2px 8px rgba(0,0,0,0.08);
        ">

          <!-- Header -->
          <div style="
            background:#000000;
            padding:20px 24px;
            text-align:center;
          ">
            <h1 style="
              margin:0;
              color:#ffffff;
              font-size:22px;
              font-weight:700;
              letter-spacing:0.5px;
            ">
              PROJEXA
            </h1>
          </div>

          <!-- Content -->
          <div style="padding:28px 24px;">

            <p style="
              margin:0 0 20px;
              color:#1a1a1a;
              font-size:15px;
              line-height:1.6;
              text-align:center;
            ">
              Your verification code
            </p>

            <!-- OTP Box -->
            <div style="
              margin:0 auto 20px;
              padding:16px;
              max-width:180px;
              background:#f8f9fa;
              border:2px solid #e9ecef;
              border-radius:8px;
              text-align:center;
            ">
              <div style="
                font-size:32px;
                font-weight:700;
                letter-spacing:8px;
                color:#000000;
                font-family:'Courier New', monospace;
              ">
                ${otp}
              </div>
            </div>

            <p style="
              margin:0 0 8px;
              color:#666666;
              font-size:13px;
              text-align:center;
            ">
              Valid for <strong>1 minute</strong>
            </p>

            <p style="
              margin:0;
              padding-top:16px;
              border-top:1px solid #e9ecef;
              color:#999999;
              font-size:12px;
              text-align:center;
            ">
              If you didn't request this code, please ignore this email.
            </p>

          </div>
        </div>
      </div>
    `;
  }
}
