import React from "react";

import "../stylesheets/UserAgreement.css";

const SettingsUserAgreement = () => {
  const agreement = `IMPORTANT: PLEASE READ THIS END USER LICENSE AGREEMENT (“EULA”) CAREFULLY. BY INSTALLING, USING, OR ACCESSING THE PRICE BOOK SOFTWARE APPLICATION (THE "APPLICATION"), YOU AGREE TO BE LEGALLY BOUND BY THE TERMS OF THIS AGREEMENT. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT INSTALL, USE OR ACCESS THE APPLICATION.

This EULA is a legal agreement between you and Caloop Games LLC ("Licensor," "us," "we," or "our") for the Application, which includes computer software, and may include associated media, printed materials, and "online" or electronic documentation.

1. LICENSE GRANT. We grant you a limited, non-exclusive, non-transferable license to use the Application according to the terms of this EULA.

2. RESTRICTIONS. You may not distribute, sublicense, lease, rent, loan, or otherwise transfer the Application. You may not modify, adapt, reverse engineer, decompile, or disassemble the Application. You may not create derivative works of the Application.

3. RESERVATION OF RIGHTS. We reserve all rights not expressly granted to you in this EULA.

4. INTELLECTUAL PROPERTY. All title, trademarks, and copyrights in and pertaining to the Application (including but not limited to any images, photographs, animations, video, audio, music, text, and "applets" incorporated into the Application) are owned by us or our suppliers.

5. TERM AND TERMINATION. This EULA is effective until terminated. You may terminate this EULA at any time by uninstalling and destroying all copies of the Application. This EULA will automatically terminate if you fail to comply with any term hereof.

6. DISCLAIMER OF WARRANTIES. THE APPLICATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

7. LIMITATION OF LIABILITY. IN NO EVENT SHALL WE BE LIABLE FOR ANY SPECIAL, INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF BUSINESS PROFITS, BUSINESS INTERRUPTION, LOSS OF BUSINESS INFORMATION, OR ANY OTHER PECUNIARY LOSS) ARISING OUT OF THE USE OF OR INABILITY TO USE THE APPLICATION.

8. PRIVACY. By using the Application, you acknowledge and agree that internet transmissions are never completely private or secure. You understand that any message or information you send using the Application may be read or intercepted by others. For more information, please review our Privacy Policy.

9. GOVERNING LAW. This EULA shall be governed by the laws of the WA, USA.

If you have any questions or concerns about this EULA, or if you would like more information from us, please contact us at admin@caloopgames.com

BY INSTALLING, USING OR ACCESSING THE APPLICATION, YOU ACKNOWLEDGE THAT YOU HAVE READ THIS EULA, UNDERSTOOD IT, AND AGREE TO BE BOUND BY ITS TERMS AND CONDITIONS.

---

Caloop Games LLC
JUNE 6TH, 2023
End User License Agreement`;

  const formattedAgreement = agreement.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div>
      <h2>User Agreement</h2>
      <div className="eula-content">
        <p>{formattedAgreement}</p>
      </div>
    </div>
  );
};

export default SettingsUserAgreement;
