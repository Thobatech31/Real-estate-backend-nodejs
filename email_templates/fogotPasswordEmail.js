function fogotPasswordEmailMessage(link, token) {
  const template = `
    <!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<body>
  <table bgcolor="#414a51""
    style="background-size:cover; background-position:top;" width="100%" border="0" align="center" cellpadding="0"
    cellspacing="0">
    <tr>
      <td height="45"></td>
    </tr>
    <tr>
      <td align="center">
        <table style=" box-shadow:0px 3px 0px #8a624a; border-radius:6px;" bgcolor="#FFFFFF" class="table-inner"
          width="500" border="0" align="center" cellpadding="0" cellspacing="0">

          <tr>
            <!--                    <td align="center" bgcolor="#f3f3f3">-->
            <td align="center" bgcolor="">
              <table class="table-inner" width="440" border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <table width="100%" align="left" border="0" cellspacing="0" cellpadding="0">

                      <tr>
                        <td align="center">
                          <img
                            src='https://finaki.netlify.app/assets/logoF-IgaTjon9.png'
                            width="90" align="center" />

                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
                <tr>
                  <td height="25"></td>
                </tr>
                <!--title-->
                <tr>
                  <td align="center"
                    style="font-family: 'Open Sans', Arial, sans-serif; color:black; font-size:34px; letter-spacing:2px; font-weight: bolder;">
                    Reset Password
                  </td>
                </tr>
                <!--end title-->
                <tr>
                  <td height="17"></td>
                </tr>
              </table>
            </td>
          </tr>
          <!--content-->
          <tr>
            <td align="center">
              <table align="center" class="table-inner" width="440" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center"
                    style="font-family: 'Open Sans', Arial, sans-serif; color:#7f8c8d; font-size:16px;line-height: 32px; font-weight: 500;">
                    <b>Hi </b> Please Click on the below link to reset your password
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td height="20"></td>
          </tr>
          <tr>
  <td align="center">
    <table align="center" class="table-inner" width="440" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <a href="${link}/${token}" style="text-decoration: none; display: inline-block; background: blue; padding: 10px 20px; border-radius: 5px;" target="_blank">
            <table>
              <tr>
                <td style="color: white; font-size: 16px; cursor: pointer; font-weight: bold;">
                  Reset Password
                </td>
              </tr>
            </table>
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>

      
          <!--end content-->
          <tr>
            <td height="60"></td>
          </tr>

          <tr>
            <td height="30" align="center" bgcolor="blue"
              style="border-bottom-left-radius:6px;border-bottom-right-radius:6px;">
              <table align="center" class="table-inner" width="440" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td height="15"></td>
                </tr>

                <!--preference-->
                <tr>
                  <td class="preference-link" align="center"
                    style="font-family: 'Open sans', Arial, sans-serif; color:#8a624a; text-decoration: none; font-size:12px; line-height: auto;">
                    <a href="#" style="text-decoration: none; " target="_blank">
                      <table>
                        <tr>
                          <td style="color:#FFFFFF; font-size: 16px; cursor:pointer; font-weight: bold;">
                            FINAKI</td>
                        </tr>
                      </table>
                    </a>
                  </td>
                </tr>
                <!--end preference-->
                <tr>
                  <td height="10"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td height="40"></td>
    </tr>
  </table>
</body>

</html>
  `;

  return template;
}

module.exports = { fogotPasswordEmailMessage };
