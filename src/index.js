const axios = require("axios");
const parseString = require("xml2js").parseString;

module.exports = ({
  namespace,
  urlproxy,
  hostname,
  to,
  subject,
  body,
  from,
  format,
}) => {
  return new Promise(async (resolve, reject) => {
    if (!namespace) {
      reject(new Error("Required XML Schema"));
    }

    if (!urlproxy) {
      reject(new Error("Required Url Proxy"));
    }

    if (!hostname) {
      reject(new Error("Required Hostname"));
    }

    if (!from) {
      reject(new Error("Required Address From"));
    }

    if (!to) {
      reject(new Error("Required Address To"));
    }

    let _subject = subject || "";
    let _body = body || "<div/>";
    let _format = format || "Html";
    const data = `<?xml version="1.0" encoding="utf-8"?>\n
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n
                    <soap:Body>\n
                        <SendMail xmlns="${namespace}">\n
                            <strMailServerName>${hostname}</strMailServerName>\n
                            <strFrom>${from}</strFrom>\n
                            <strTo>${to}</strTo>\n
                            <strCC></strCC>\n
                            <strSubject>${_subject}</strSubject>\n
                            <strBody><![CDATA[${_body}]]></strBody>\n
                            <MailFormat>${_format}</MailFormat>\n
                        </SendMail>\n
                    </soap:Body>\n
                </soap:Envelope>`;

    try {
      const result = await axios.post(urlproxy, data, {
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
        },
      });

      resolve(result);

      const xml = result.data;
      parseString(xml, function (err, xresult) {
        console.log(xresult);
      });
    } catch (error) {
      reject(new Error("Can not connect server"));
    }
  });
};
