import React from "react";
import Layout from "../components/layout/Layout";
import { FaRegFaceSmile } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <Layout title={"Contact Us - Antra"}>
      <div className="row content-center m-5">
        <div className="col-md-5">
          <img
            src="https://st2.depositphotos.com/3662505/6206/i/950/depositphotos_62068487-stock-photo-call-center.jpg"
            className="call-image"
          ></img>
        </div>
        <div className="col-md-7 contact ml-2">
          <h2>Contact Us:</h2>

          <p>
            For any queries or information related to products feel free to
            reach out to us on following:
          </p>
          <p className="mt-2">
            <MdEmail /> : www.antrahelpline@antra.com
          </p>

          <p className="mt-2">
            <FaPhoneAlt /> : +91-1234567890
          </p>

          <h3>
            <FaRegFaceSmile /> Happy Shopping!
          </h3>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
