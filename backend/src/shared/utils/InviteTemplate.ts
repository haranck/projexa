export class InviteTemplate {
    static generate(link: string): string {
        return `
      <div style="
        padding: 40px 20px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: transparent;
      ">
        <div style="
          max-width: 440px;
          margin: 0 auto;
          background: #0f0f0f;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          color: #ffffff;
        ">
          <!-- Header -->
          <div style="
            background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent);
            padding: 32px 24px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          ">
            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 24px;
              font-weight: 800;
              letter-spacing: -0.5px;
              text-transform: uppercase;
            ">
              PRO<span style="color: #3b82f6;">JEXA</span>
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 32px; text-align: center;">
            <div style="margin-bottom: 32px;">
              <h2 style="
                margin: 0 0 12px;
                color: #ffffff;
                font-size: 20px;
                font-weight: 700;
              ">
                You've been invited!
              </h2>
              <p style="
                margin: 0;
                color: #a1a1aa;
                font-size: 14px;
                line-height: 1.5;
              ">
                You have been invited to join a workspace on Projexa. Click the button below to accept the invitation and get started.
              </p>
            </div>

            <!-- Action Button -->
            <div style="margin: 32px 0;">
              <a href="${link}" style="
                display: inline-block;
                padding: 16px 32px;
                background: #3b82f6;
                color: #ffffff;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                border-radius: 12px;
                transition: all 0.2s;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
              ">
                Join Workspace
              </a>
            </div>

            <div style="
              padding-top: 32px;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            ">
              <p style="
                margin: 0;
                color: #52525b;
                font-size: 12px;
                line-height: 1.5;
              ">
                If you were not expecting this invitation, you can safely ignore this email. The link will expire in 7 days.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="
            padding: 24px;
            text-align: center;
            background: rgba(0, 0, 0, 0.2);
          ">
            <p style="
              margin: 0;
              color: #3f3f46;
              font-size: 11px;
              font-weight: 600;
              letter-spacing: 1px;
              text-transform: uppercase;
            ">
              Secured by ProJexa Auth
            </p>
          </div>
        </div>
      </div>
    `;
    }
}
