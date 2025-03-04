import React from "react";
import Layout from "../components/layout/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout title={"Privacy Policy - Antra"}>
      <div className="row content-center m-5">
        <div className="col-md-5">
          <img
            src="https://dt2sdf0db8zob.cloudfront.net/wp-content/uploads/2018/03/privacy-policy.jpg"
            className="call-image"
          ></img>
        </div>
        <div className="col-md-7 contact ml-2">
          <h2>Privacy Policy:</h2>

          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum."
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
