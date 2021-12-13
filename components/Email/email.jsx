import './style.css';

const email = ({ name }) => {
  return (
    <body
      width="100%"
      style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #222222;"
    >
      <div style="width: 100%; background-color: #f1f1f1;">
        <div
          style="max-width: 600px; margin: 0 auto;"
          className="email-container"
        >
          <table
            align="center"
            role="presentation"
            cellSpacing="0"
            cellPadding="0"
            border="0"
            width="100%"
            style="margin: auto;"
          >
            {/* <!-- LOGO --> */}
            <tr>
              <td valign="top" className="bg_white" style="padding: 1em 2.5em;">
                <table
                  role="presentation"
                  border="0"
                  cellPadding="0"
                  cellSpacing="0"
                  width="100%"
                >
                  <tr>
                    <td className="logo">
                      <img
                        src="./images/logoblack.png"
                        alt=""
                        height="40px"
                        style="float: right;"
                      ></img>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* <!-- SINERGIMP --> */}
            <tr>
              <td
                valign="middle"
                className="hero bg_white"
                style="background-image: url(./images/BusinessPlatform.jpg); background-size: cover; height: 350px;"
              >
                <div className="overlay"></div>
                <table>
                  <tr>
                    <td>
                      <div
                        className="text"
                        style="padding: 0 4em; text-align: center;"
                      >
                        <h2>Sinergi Merah Putih</h2>
                        <p>
                          Enthusiastic, and high curiosity is the key to keep
                          innovating. We will always be a partner to support
                          you.
                        </p>
                        <br />
                        <p>
                          <a
                            href="https://sinergimp1.vercel.app/"
                            className="btn btn-primary"
                          >
                            Read more
                          </a>
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* <!-- MESSAGE --> */}
            <tr>
              <td valign="top" className="bg_white" style="padding: 3em 2.5em;">
                <table
                  role="presentation"
                  border="0"
                  cellPadding="0"
                  cellSpacing="0"
                  width="100%"
                >
                  <tr>
                    <td className="logo">
                      <h2>Hi, {data.name}</h2>
                      <p>
                        We have received your message and would like to thank
                        you for writing to us. If your inquiry is urgent, please
                        use the telephone number listed below to talk to one of
                        our staff members.
                      </p>
                      <p>
                        Otherwise, we will reply by email as soon as possible.
                      </p>
                      <p>
                        In the meantime, make sure to follow us on{' '}
                        <a href="https://www.linkedin.com/company/ptsinergimp/mycompany/">
                          LinkedIn!
                        </a>{' '}
                      </p>
                      <br />
                      <p>Talk to you soon, Sinergi Merah Putih.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            {/* <!-- CONTACT --> */}
            <tr>
              <td valign="top" className="bg_black" style="padding: 3em 2.5em;">
                <table
                  role="presentation"
                  border="0"
                  cellPadding="0"
                  cellSpacing="0"
                  width="100%"
                  style="color: white;"
                >
                  <h4 style="color: white;">Contact Info</h4>
                  <tr>
                    <td width="7%">
                      <i className="size-small" data-feather="map-pin"></i>
                    </td>
                    <td>
                      <h6 style="color: white;">
                        Jl. Gatot Subroto Kav. 32-34, Kelurahan Kuningan Timur,
                        Kecamatan Setia Budi, Jakarta Selatan , 12950 Gedung
                        Patra Jasa Office Tower, Lantai 17 Ruang 1702-1704
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td width="7%">
                      <i className="size-small" data-feather="phone"></i>
                    </td>
                    <td>
                      <h6 style="color: white;">+62 21 52900252</h6>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <div className="" style="text-align: center; margin: 10px;">
            &copy;{' '}
            <span style="font-size: small;">
              {' '}
              &nbsp PT. Sinergi Merah Putih 2021
            </span>
          </div>
        </div>
      </div>
    </body>
  );
};

export default email;
